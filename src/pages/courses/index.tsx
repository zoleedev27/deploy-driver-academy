import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchCourses } from '@/pages/api/courses';
import { useTranslation } from 'next-i18next';
import KartingCourseCard from '@/components/CourseCard';
import { PaginatedList } from '@/components/PaginatedList';

type Course = {
  id: number;
  title: string;
  description: string;
  teacherName: string;
  price: number;
  maxParticipants: number;
  difficulty: string;
  images: string[];
};

const COURSES_QUERY_KEY = ['courses'];

export default function CoursesPage({}: any) {
  const { t } = useTranslation('courses');

  const { data } = useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: () => fetchCourses({ page: 1, itemsPerPage: 100 }),
  });

  const courses = data?.data.map((course: any) => ({
    ...course,
    images: course.images?.map((img: any) => img.url) ?? [],
  })) ?? [];

  return (
    <main className="flex flex-col items-center gap-8 px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        {t("pageTitle")}
      </h1>

      <PaginatedList
        items={courses}
        routePrefix="/courses"
        renderItem={(course: Course) => (
          <KartingCourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            teacherName={course.teacherName}
            price={course.price}
            maxParticipants={course.maxParticipants}
            difficulty={course.difficulty}
            images={course.images}
            labels={{
              cardTitle: t("cardTitle"),
              registerButton: t("registerButton"),
            }}
          />
        )}
      />
    </main>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: () => fetchCourses({ page: 1, itemsPerPage: 100 }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(locale, [
        'courses',
        'pagination',
        'layout',
      ])),
    },
  };
}
