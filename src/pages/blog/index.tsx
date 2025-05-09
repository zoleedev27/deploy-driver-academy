import { GetServerSideProps } from "next";
import Head from "next/head";
import BlogGrid from "@/components/BlogGrid";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Post } from "@/types/post";
import { useRouter } from "next/router";

const posts = await import("@/data/posts").then((mod) => mod.posts);

type BlogPageProps = {
  posts: Post[];
};

export default function BlogPage({ posts }: BlogPageProps) {
  const { locale } = useRouter();
  const currentLocale = (locale ?? "en") as keyof typeof metaDescription;

  const metaDescription = {
    en: "Explore the latest karting tips, gear reviews, and pro techniques.",
    ro: "Explorați cele mai recente sfaturi de karting, recenzii de echipamente și tehnici profesionale.",
  };

  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content={metaDescription[currentLocale]} />
        <link
          rel="alternate"
          hrefLang="en"
          href="http://localhost:3000/en/blog"
        />
        <link
          rel="alternate"
          hrefLang="ro"
          href="http://localhost:3000/ro/blog"
        />

        <meta property="og:type" content="website" />
      </Head>
      <BlogGrid posts={posts} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale ?? "en", [
    "common",
    "blog",
    "layout",
  ]);

  return {
    props: {
      posts,
      ...translations,
    },
  };
};
