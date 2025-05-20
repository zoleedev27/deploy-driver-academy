export async function fetchCourses({
  page = 1,
  itemsPerPage = 10,
  teacherName,
  column,
  order,
}: {
  page?: number;
  itemsPerPage?: number;
  teacherName?: string;
  column?: string;
  order?: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    itemsPerPage: itemsPerPage.toString(),
  });

  if (teacherName) params.append("teacherName", teacherName);
  if (column) params.append("column", column);
  if (order) params.append("order", order);

  const res = await fetch(
    `https://backend-spring2025.web-staging.eu/api/courses?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
}

export async function fetchCourseById(courseId: number) {
  const res = await fetch(
    `https://backend-spring2025.web-staging.eu/api/courses/${courseId}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch course with ID ${courseId}`);
  }

  return res.json();
}
