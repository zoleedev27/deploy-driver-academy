import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import GalleryClient from "@/components/Gallery";
import {GetServerSideProps} from "next";

export default function GalleryPage() {
    const { t } = useTranslation("gallery");

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
        <h1 className="font-body text-3xl font-bold text-foreground mb-6 text-center">
            {t('gallery')}
        </h1>
        <GalleryClient />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale ?? "en", [
        "common",
        "layout",
        "calendar",
        "landing-page",
        "gallery"
    ]);

    return {
        props: {
            ...translations,
        },
    };
};
