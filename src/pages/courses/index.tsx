import { PaginatedList } from "@/components/PaginatedList";
import KartingCourseCard from "@/components/CourseCard";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
};

export default function Courses({ courses }: { courses: Course[] }) {
  const { t } = useTranslation("courses");

  return (
    <main className="flex flex-col items-center gap-8 px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        {t("pageTitle")}
      </h1>

      <PaginatedList
        items={courses}
        routePrefix="/courses"
        renderItem={(course) => (
          <KartingCourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            price={course.price}
            duration={course.duration}
            imageUrl={course.imageUrl}
            labels={{
              cardTitle: t("cardTitle"),
              duration: t("duration"),
              registerButton: t("registerButton"),
            }}
          />
        )}
      />
    </main>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  const res = await fetch("http://localhost:4000/api/courses");
  const data = await res.json();

  const courses = data.courses_mock;

  return {
    props: {
      courses,
      ...(await serverSideTranslations(locale, [
        "courses",
        "pagination",
        "layout",
      ])),
    },
  };
}
