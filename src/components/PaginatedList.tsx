import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "next-i18next";

interface PaginatedListProps<T> {
  items: T[];
  routePrefix: string;
  renderItem: (item: T) => React.ReactNode;
}

export function PaginatedList<T>({
  items,
  routePrefix,
  renderItem,
}: PaginatedListProps<T>) {
  const {
    currentPage,
    itemsPerPage,
    currentItemsRange,
    goToPage,
    setItemsPerPage,
    pagesToDisplay,
  } = usePagination({
    totalItems: items.length,
    routePrefix,
    allowedPerPageOptions: [5, 10, 15, 20],
  });

  const { t } = useTranslation("pagination");

  const currentItems = items.slice(currentItemsRange[0], currentItemsRange[1]);

  const handlePerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
  };

  const renderPageLinks = () => {
    return pagesToDisplay.map((page, index) =>
      typeof page === "number" ? (
        <PaginationItem key={index}>
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => goToPage(page)}
            className={`w-10 h-10 px-0 text-sm rounded-md cursor-pointer ${
              page === currentPage
                ? "bg-green-600 text-white hover:bg-green-700"
                : "text-green-600 hover:bg-green-100"
            }`}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ) : (
        <PaginationItem key={index}>
          <span className="px-2 text-gray-500">...</span>
        </PaginationItem>
      )
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full max-w-[80%] sm:max-w-2/3 mx-auto flex justify-start px-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
          <span>{t("itemsPerPage")}:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[80px] h-9 border border-gray-300 dark:border-green-500 text-sm focus:ring-green-500 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-0 w-[80px]">
              {[5, 10, 15, 20].map((option) => (
                <SelectItem
                  key={option}
                  value={String(option)}
                  className="w-[80px] justify-center"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {currentItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(currentPage - 1)}
              className="text-green-600 hover:bg-green-100 cursor-pointer"
            />
          </PaginationItem>

          {renderPageLinks()}

          <PaginationItem>
            <PaginationNext
              onClick={() => goToPage(currentPage + 1)}
              className="text-green-600 hover:bg-green-100 cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
