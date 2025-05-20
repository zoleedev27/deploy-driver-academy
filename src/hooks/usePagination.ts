import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  routePrefix: string;
  allowedPerPageOptions?: number[];
}

export const usePagination = ({
  totalItems,
  routePrefix,
  allowedPerPageOptions = [5, 10, 15, 20],
}: UsePaginationProps) => {
  const router = useRouter();
  const { page, perPage } = router.query;

  const parsedPerPage = parseInt(perPage as string);
  const parsedPage = parseInt(page as string);

  const itemsPerPage = allowedPerPageOptions.includes(parsedPerPage)
    ? parsedPerPage
    : allowedPerPageOptions[0];

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.min(
    Math.max(1, isNaN(parsedPage) ? 1 : parsedPage),
    totalPages
  );

  useEffect(() => {
    const isValidPerPage = allowedPerPageOptions.includes(parsedPerPage);
    const isValidPage =
      !isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages;

    if (totalItems !== 0) {
      if (!isValidPerPage || !isValidPage) {
        router.replace({
          pathname: routePrefix,
          query: { page: currentPage, perPage: itemsPerPage },
        });
      }
    }
  }, [
    parsedPage,
    parsedPerPage,
    routePrefix,
    router,
    itemsPerPage,
    totalPages,
    currentPage,
  ]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItemsRange = [startIndex, startIndex + itemsPerPage];

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    router.push({
      pathname: routePrefix,
      query: { ...router.query, page: pageNumber },
    });
  };

  const setItemsPerPage = (newPerPage: number) => {
    router.push({
      pathname: routePrefix,
      query: { ...router.query, page: 1, perPage: newPerPage },
    });
  };

  const pagesToDisplay = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const midRange = Array.from(
      { length: 3 },
      (_, i) => currentPage - 1 + i
    ).filter((p) => p > 1 && p < totalPages);

    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    pages.push(...midRange);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    currentItemsRange,
    goToPage,
    setItemsPerPage,
    pagesToDisplay,
  };
};
