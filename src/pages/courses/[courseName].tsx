import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { GetServerSidePropsContext } from "next";
import { fetchCourses } from "@/pages/api/courses";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

type Course = {
  title: string;
  description: string;
  teacherName: string;
  price: number;
  maxParticipants: number;
  difficulty: string;
  images: string[];
};

const fetchCourseBySlug = async (slug: string): Promise<Course> => {
  const data = await fetchCourses({ page: 1, itemsPerPage: 100 });
  const course = data.data.find((c: any) => slugify(c.title) === slug);

  if (!course) throw new Error("Course not found");

  return {
    ...course,
    images: course.images?.map((img: any) => img.url) ?? [],
  };
};

export default function CourseDetailsPage({ courseSlug }: { courseSlug: string }) {
  const { t } = useTranslation("courses");

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseSlug],
    queryFn: () => fetchCourseBySlug(courseSlug),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !course) return <div>Error: Course not found</div>;

  return (
    <main className="px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="order-1 md:order-2">
          <div className="relative w-full h-56 sm:h-72 md:h-86 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={
                course.images?.length > 0
                  ? course.images[0]
                  : "/images/course-mock.png"
              }
              alt={course.title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
              priority
            />
          </div>
        </div>

        <div className="order-2 md:order-1 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {course.description}
          </p>

          <div className="space-y-2 text-gray-800 dark:text-gray-200">
            <p>
              <span className="font-semibold">{t("teacherName")}:</span>{" "}
              {course.teacherName}
            </p>
            <p>
              <span className="font-semibold">{t("price")}:</span>{" "}
              {course.price} Lei
            </p>
            <p>
              <span className="font-semibold">{t("difficulty")}:</span>{" "}
              {course.difficulty}
            </p>
            <p>
              <span className="font-semibold">{t("maxParticipants")}:</span>{" "}
              {course.maxParticipants}
            </p>
          </div>

          <button className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition">
            {t("registerButton")}
          </button>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { courseName } = context.params as { courseName: string };
  const locale = context.locale ?? "en";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["course", courseName],
    queryFn: () => fetchCourseBySlug(courseName),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      courseSlug: courseName,
      ...(await serverSideTranslations(locale, ["courses", "pagination", "layout"])),
    },
  };
}
