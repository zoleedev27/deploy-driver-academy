// src/pages/signup.tsx
import Head from "next/head";
import SignUpForm from "@/components/SignUpForm";
import { useTranslation } from "next-i18next";
import { ModeToggle } from "@/components/theme/ThemeToggle";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function SignUpPage() {
    const { t } = useTranslation('signUp');

    return (
        <>
            <Head>
                <title>{t('signup.pageTitle')}</title>
            </Head>
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
                <div className="absolute top-4 right-4">
                    <ModeToggle />
                </div>
                <SignUpForm />
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale ?? "en", ["signUp"]);

    return {
        props: {
            ...translations,
        },
    };
};