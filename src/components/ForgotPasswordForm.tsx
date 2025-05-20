import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { KeyRound, ArrowRight, AtSign } from "lucide-react";
import { createForgotPasswordSchema } from "@/types/SchemaEmailForgotPassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "next-i18next";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ForgotPasswordForm = () => {
  const router = useRouter();

  const { t } = useTranslation("auth");
  const schema = createForgotPasswordSchema(t);
  const [isError, setIsError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { forgotPassword } = useAuth();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsPending(true);
    setIsError(null);
    try {
      await forgotPassword({
        email: data.email,
      });
      setIsPending(false);
      router.push(
        `/forgot-password/check-email?email=${encodeURIComponent(data.email)}`
      );
    } catch (err) {
      console.error(err);
      setIsError(t("forgot.password.email.reset.errors.email.send.failed"));
      setIsPending(false);
      return;
    } finally {
      setIsPending(false);
    }
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-10">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-background border-2 border-black dark:border-white">
              <KeyRound className="h-10 w-10 text-black dark:text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-body text-center">
            {t("forgot.password.email.reset.form.title")}
          </CardTitle>
          <CardDescription className="font-body text-center">
            {t("forgot.password.email.reset.form.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{isError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("forgot.password.email.reset.form.email.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center relative">
                        <AtSign className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t(
                            "forgot.password.email.reset.form.email.placeholder"
                          )}
                          {...field}
                          className="pl-9"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    {t("forgot.password.email.reset.form.submit.processing")}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {t("forgot.password.email.reset.form.submit.send")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center items-center font-body">
          <Button
            variant="link"
            onClick={() => `${router.push("/")}`}
            className="hover:text-red-900"
          >
            <span>{t("forgot.password.email.reset.back.home")}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
