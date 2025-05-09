"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";

const ContactSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be more detailed"),
  email: z.string().email("Invalid email"),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const { t } = useTranslation("common");

  const onSubmit = async (data: ContactFormData) => {
    console.log("Sending message:", data);
  };

  return (
    <section className="max-w-3xl mx-auto p-8 bg-background rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
          {t("contact.us.title")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("have.any.questions")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-800 dark:text-white mb-2 block">
            {t("title")}
          </label>
          <Input
            {...register("title")}
            placeholder={t("enter.subject")}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all mt-2 ${
              isSubmitted && errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-800 dark:text-white mb-2 block">
            {t("description")}
          </label>
          <Textarea
            {...register("description")}
            placeholder={t("write.message")}
            rows={6}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all mt-2 ${
              isSubmitted && errors.description
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-800 dark:text-white mb-2 block">
            {t("email")}
          </label>
          <Input
            {...register("email")}
            placeholder={t("mail.example")}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all mt-2 ${
              isSubmitted && errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-white bg-gray-700 hover:bg-gray-600 rounded-xl shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Send className="animate-spin h-5 w-5" />
              {t("sending")}
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              {t("send.message")}
            </>
          )}
        </Button>
      </form>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale ?? "en", [
    "common",
    "layout",
  ]);

  return {
    props: {
      ...translations,
    },
  };
};
