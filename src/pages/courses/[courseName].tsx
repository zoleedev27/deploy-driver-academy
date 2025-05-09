import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { GetServerSidePropsContext } from "next";

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
};

interface CourseDetailsProps {
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
}

export default function CourseDetails(props: CourseDetailsProps) {
  const { title, description, price, duration, imageUrl } = props;

  const { t } = useTranslation("courses");

  return (
    <main className="px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="order-1 md:order-2">
          <div className="relative w-full h-56 sm:h-72 md:h-86 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
              priority
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="order-2 md:order-1 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>

          <div className="space-y-2 text-gray-800 dark:text-gray-200">
            <p>
              <span className="font-semibold">
                {t("duration") || "Duration"}:
              </span>{" "}
              {duration}
            </p>
            <p>
              <span className="font-semibold">{t("price") || "Price"}:</span> $
              {price.toFixed(2)}
            </p>
          </div>

          <button className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition">
            {t("registerButton") || "Register Now"}
          </button>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps({
  params,
  locale,
}: GetServerSidePropsContext) {
  const { courseName } = params as { courseName: string };
  const slug = courseName as string;

  const res = await fetch("http://localhost:4000/api/courses");
  const data = await res.json();
  const courses: Course[] = data.courses_mock;
  const course = courses.find((c) => slugify(c.title) === slug);

  if (!course) {
    return { notFound: true };
  }

  return {
    props: {
      ...course,
      ...(await serverSideTranslations(locale ?? "en", [
        "courses",
        "pagination",
        "layout",
      ])),
    },
  };
}
