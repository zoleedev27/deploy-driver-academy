import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { posts } from "@/data/posts";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

type Post = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  author: {
    name: string;
  };
};

type PostPageProps = {
  post: Post | null;
};

export default function PostPage({ post }: PostPageProps) {
  const { t } = useTranslation();

  if (!post) {
    return (
      <article className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold">{t("blog:postNotFound")}</h1>
        <p className="text-muted-foreground mt-4">
          {t("blog:articleNotFound")}
        </p>
      </article>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} | Karting Insights</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author.name} />
      </Head>

      <article className="max-w-4xl mx-auto px-6 py-12 prose dark:prose-invert">
        <header className="mb-8">
          <h1 className="text-5xl font-bold leading-tight mb-2">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("common:by")}{" "}
            <span className="font-medium">{post.author.name}</span>{" "}
            {t("common:on")} {new Date(post.date).toLocaleDateString()}
          </p>
        </header>

        <div className="w-full h-96 relative rounded-xl overflow-hidden shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <section className="mt-10 space-y-6 text-lg leading-relaxed">
          <p>{post.description}</p>
          <p>
            Go-karting is more than just speed—it&apos;s about control,
            precision, and mastering the art of racing lines. Whether
            you&apos;re an aspiring racer or just enjoying the thrill,
            understanding the dynamics of each corner and how your kart reacts
            is key to improving.
          </p>
          <p>
            In this article, we&apos;ll explore essential karting techniques,
            including throttle control, weight distribution, and how to find the
            fastest racing lines. We&apos;ll also look at common mistakes and
            how to avoid them to shave off those crucial tenths of a second.
          </p>
          <p>
            Finally, we&apos;ll recommend tracks and gear for beginners and
            seasoned racers alike. Buckle up—your journey to karting mastery
            begins here.
          </p>
        </section>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale ?? "en";

  const translations = await serverSideTranslations(locale ?? "en", [
    "common",
    "blog",
    "layout",
  ]);

  const { id } = context.params || {};

  const post = posts.find((p) => p.id.toString() === id);

  return {
    props: {
      post: post || null,
      ...translations,
    },
  };
};
