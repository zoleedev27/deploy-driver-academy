import { useEffect, useState, useCallback, useRef } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import { Funnel, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import {
  GalleryFilterKey,
  GalleryImage,
  GallerySortOption,
} from "@/types/gallery.ts";
import { getFileUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
const filterKeys: GalleryFilterKey[] = ["campaign", "course", "year"];

export default function GalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showAllValues, setShowAllValues] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const initialData: Record<`${GalleryFilterKey}s`, string[]> = {
    campaigns: [],
    courses: [],
    years: [],
  };

  const [selectedFilters, setSelectedFilters] = useState(initialData);

  const [sortBy, setSortBy] = useState<GallerySortOption>({
    key: "year",
    order: "desc",
  });

  const getFiltersAndSortFromURL = (): {
    filters: Record<`${GalleryFilterKey}s`, string[]>;
    sort: GallerySortOption | null;
  } => {
    const url = new URLSearchParams(searchParams.toString());

    const filters = {
      campaigns: url.getAll("campaigns"),
      courses: url.getAll("courses"),
      years: url.getAll("years"),
    };

    const sortKey = url.get("sortKey") as keyof GalleryImage | null;
    const rawOrder = url.get("sortOrder");
    const sortOrder: "asc" | "desc" = rawOrder === "desc" ? "desc" : "asc";

    const sort = sortKey ? { key: sortKey, order: sortOrder } : null;

    return { filters, sort };
  };

  useEffect(() => {
    const { filters, sort } = getFiltersAndSortFromURL();

    setSelectedFilters(filters);
    if (sort) setSortBy(sort);

    fetch("/api/mock-gallery")
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data as GalleryImage[]).filter((file) =>
          imageExtensions.includes(file.ext.toLowerCase())
        );
        setImages(filtered);
        setFilteredImages(filtered);
      });
  }, []);

  useEffect(() => {
    const { filters, sort } = getFiltersAndSortFromURL();

    setSelectedFilters(filters);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        sortRef.current &&
        !sortRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false);
        setShowSort(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const applyFilters = (
    data: GalleryImage[],
    filters: Record<`${GalleryFilterKey}s`, string[]>
  ) => {
    return data.filter((img) => {
      return filterKeys.every((key) => {
        const values = filters[`${key}s`];
        return values.length === 0 || values.includes(img[key]);
      });
    });
  };

  useEffect(() => {
    const filtered = applyFilters(images, selectedFilters);
    setFilteredImages(applySorting(filtered));
  }, [selectedFilters, images, sortBy]);

  const applySorting = (data: GalleryImage[]) => {
    const { key, order } = sortBy;
    if (!key) {
      return data;
    }
    return [...data].sort((a, b) => {
      if (key === "year") {
        const valA = Number(a[key]);
        const valB = Number(b[key]);
        return order === "asc" ? valA - valB : valB - valA;
      }
      const valA = a[key]?.toString().toLowerCase();
      const valB = b[key]?.toString().toLowerCase();
      if (valA < valB) {
        return order === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const toggleFilter = (category: `${GalleryFilterKey}s`, value: string) => {
    setSelectedFilters((prev) => {
      const exists = prev[category].includes(value);
      const updated = exists
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      const newFilters = { ...prev, [category]: updated };
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, values]) => {
        values.forEach((v) => params.append(k, v));
      });
      if (sortBy.key) {
        params.set("sortKey", sortBy.key);
        params.set("sortOrder", sortBy.order);
      }
      router.push(`?${params.toString()}`);
      setShowFilter(true);
      setTimeout(() => setShowFilter(false), 5000);
      return newFilters;
    });
  };

  const getUnique = (key: keyof GalleryImage): string[] => {
    const values = [...new Set(images.map((img) => img[key]))];
    if (key === "year") {
      return values.sort((a, b) => Number(b) - Number(a));
    }
    return values.sort((a, b) => a.localeCompare(b));
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === "Escape") setCurrentIndex(null);
      else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredImages.length) % filteredImages.length
            : null
        );
      }
    },
    [currentIndex, filteredImages.length]
  );

  useEffect(() => {
    if (currentIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [currentIndex, handleKeyDown]);

  const fullscreenImage =
    currentIndex !== null
      ? getFileUrl(filteredImages[currentIndex]?.name)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-end items-center mb-6 gap-4 relative">
        <button
          onClick={() => {
            setShowFilter((p) => !p);
            setShowSort(false);
          }}
          className={`hover:scale-110 transition-colors ${
            showFilter
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Toggle filters"
        >
          <Funnel className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setShowSort((p) => !p);
            setShowFilter(false);
          }}
          className={`hover:scale-110 transition-colors ${
            showSort
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Toggle sort"
        >
          <ArrowUpDown className="w-6 h-6" />
        </button>

        {showFilter && (
          <div
            ref={filterRef}
            className="absolute top-10 right-0 z-50 w-72 bg-[#1e1e1e] text-[#e5e5e5] dark:bg-[#121212] dark:text-[#e5e5e5] border border-[#2a2a2a] dark:border-[#2f2f2f] rounded-lg shadow-xl p-4 text-sm"
          >
            {(["campaign", "course", "year"] satisfies GalleryFilterKey[]).map(
              (categoryKey) => {
                const options = getUnique(categoryKey);
                const showAll = showAllValues[categoryKey] || false;
                const displayOptions = showAll ? options : options.slice(0, 6);
                return (
                  <div key={categoryKey} className="mb-4">
                    <p className="font-semibold capitalize mb-2">
                      {categoryKey}s
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {displayOptions.map((value) => (
                        <button
                          key={value}
                          onClick={() => toggleFilter(`${categoryKey}s`, value)}
                          className={`text-xs px-2 py-1 rounded font-medium transition ${
                            selectedFilters[`${categoryKey}s`].includes(value)
                              ? "bg-[#e1e1e1] text-[#121212] dark:bg-[#d4d4d4] dark:text-black"
                              : "bg-[#2e2e2e] hover:bg-[#444444] text-[#e5e5e5] dark:bg-[#2e2e2e] dark:hover:bg-[#3b3b3b]"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    {options.length > 6 && (
                      <button
                        onClick={() =>
                          setShowAllValues((prev) => ({
                            ...prev,
                            [categoryKey]: !prev[categoryKey],
                          }))
                        }
                        className="flex items-center mt-2 text-xs text-gray-300 hover:text-white"
                      >
                        {showAll ? "Show less" : "Show all"}
                        {showAll ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )}
                      </button>
                    )}
                  </div>
                );
              }
            )}
            <button
              onClick={() => {
                setSelectedFilters(initialData);
                const params = new URLSearchParams();

                if (sortBy.key) {
                  params.set("sortKey", sortBy.key);
                  params.set("sortOrder", sortBy.order);
                }

                router.push(`?${params.toString()}`);
              }}
              className="w-full mt-2 text-xs font-semibold text-gray-300 hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        )}

        {showSort && (
          <div
            ref={sortRef}
            className="absolute top-10 right-0 z-50 w-72 bg-[#1e1e1e] text-[#e5e5e5] dark:bg-[#121212] dark:text-[#e5e5e5] border border-[#2a2a2a] dark:border-[#2f2f2f] rounded-lg shadow-xl p-4 text-sm"
          >
            {filterKeys.map((key) => (
              <div key={key} className="flex justify-between items-center mb-3">
                <span className="font-semibold capitalize mb-2">{key}</span>
                <div className="flex gap-1">
                  <button
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      sortBy.key === key && sortBy.order === "asc"
                        ? "bg-[#e1e1e1] text-[#121212] dark:bg-[#d4d4d4] dark:text-black"
                        : "bg-[#2e2e2e] text-[#e5e5e5] hover:bg-[#444444] dark:hover:bg-[#3b3b3b]"
                    }`}
                    onClick={() => {
                      const newSort: {
                        key: keyof GalleryImage;
                        order: "asc" | "desc";
                      } = { key, order: "asc" };
                      setSortBy(newSort);

                      const params = new URLSearchParams();

                      Object.entries(selectedFilters).forEach(([k, values]) => {
                        values.forEach((v) => params.append(k, v));
                      });

                      params.set("sortKey", newSort.key);
                      params.set("sortOrder", newSort.order);

                      router.push(`?${params.toString()}`);
                    }}
                  >
                    {key === "year" ? "Oldest First" : "A→Z"}
                  </button>
                  <button
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      sortBy.key === key && sortBy.order === "desc"
                        ? "bg-[#e1e1e1] text-[#121212] dark:bg-[#d4d4d4] dark:text-black"
                        : "bg-[#2e2e2e] text-[#e5e5e5] hover:bg-[#444444] dark:hover:bg-[#3b3b3b]"
                    }`}
                    onClick={() => {
                      const newSort: {
                        key: keyof GalleryImage;
                        order: "asc" | "desc";
                      } = { key, order: "desc" };
                      setSortBy(newSort);

                      const params = new URLSearchParams();

                      Object.entries(selectedFilters).forEach(([k, values]) => {
                        values.forEach((v) => params.append(k, v));
                      });

                      params.set("sortKey", newSort.key);
                      params.set("sortOrder", newSort.order);

                      router.push(`?${params.toString()}`);
                    }}
                  >
                    {key === "year" ? "Latest First" : "Z→A"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ResponsiveMasonry
        columnsCountBreakPoints={{ 0: 1, 320: 2, 768: 3, 1024: 4 }}
      >
        <Masonry gutter="10px">
          {filteredImages.map((image, index) => (
            <div key={image.name} className="relative group">
              <div
                onClick={() => setCurrentIndex(index)}
                className="relative w-full h-full transition-all duration-300 ease-in-out transform-gpu group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-xl rounded-lg overflow-hidden bg-white dark:bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={getFileUrl(image.name)}
                    width={400}
                    height={400}
                    alt={image.name}
                    className="rounded-lg object-cover w-full h-auto transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex gap-2 max-w-full rounded-b-lg">
                    {filterKeys.map((key) => {
                      const value = image[key];
                      if (!value) return null;

                      return (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter(`${key}s`, value);
                            setShowFilter(true);
                            setCurrentIndex(null);
                          }}
                          className="px-1.5 py-0.5 rounded-full text-[clamp(7px,1.5vw,12px)] font-medium whitespace-nowrap bg-gradient-to-r from-[#3a3a3a] via-[#4a4a4a] to-[#3a3a3a] text-[#f1f1f1] hover:from-[#5a5a5a] hover:to-[#5a5a5a] shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {fullscreenImage && currentIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center pt-[calc((100vh-80vh)/2)] pb-[calc((100vh-80vh)/2)]"
          onClick={() => setCurrentIndex(null)}
        >
          <div className="relative max-h-[80vh] flex items-center justify-center">
            <Image
              src={fullscreenImage}
              alt="fullscreen"
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 px-4">
            {(["campaign", "course", "year"] as const).map((key) => {
              const value = filteredImages[currentIndex]?.[key];
              if (!value) return null;

              return (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilter(`${key}s`, value);
                    setCurrentIndex(null);
                    setShowFilter(true);
                  }}
                  className="px-3 py-[4px] rounded-full text-[10px] sm:text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-700 hover:scale-105 transition-all duration-200"
                >
                  {value}
                </button>
              );
            })}
          </div>
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:scale-110 transition"
            onClick={() => setCurrentIndex(null)}
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev !== null
                  ? (prev - 1 + filteredImages.length) % filteredImages.length
                  : null
              );
            }}
            className="absolute left-4 text-white text-4xl font-bold hover:scale-125 transition"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev !== null ? (prev + 1) % filteredImages.length : null
              );
            }}
            className="absolute right-4 text-white text-4xl font-bold hover:scale-125 transition"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
