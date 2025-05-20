import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Users, X } from "lucide-react";
import { sampleEvents as events } from "@/data/events";
import { KartingEvent } from "@/types/event";
import { useTranslation } from "next-i18next";

interface DayObject {
  day: number;
  currentMonth: boolean;
  date: Date;
}

export default function KartingCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [animateDetails, setAnimateDetails] = useState<boolean>(false);
  const [clickedDateIndex, setClickedDateIndex] = useState<string | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setShowEventDetails(false);
    setAnimateDetails(false);
    setClickedDateIndex(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setShowEventDetails(false);
    setAnimateDetails(false);
    setClickedDateIndex(null);
  };

  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const createCalendarGrid = (): DayObject[] => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: DayObject[] = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(currentYear, currentMonth, i),
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i),
      });
    }

    return days;
  };

  const formatTime = (timeString?: string): string => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getEventsForDate = (date: Date): KartingEvent[] => {
    const formattedDate = formatDate(date);
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const currentDate = new Date(formattedDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      return currentDate >= start && currentDate <= end;
    });
  };

  const handleDateClick = (date: Date, dayId: string) => {
    setSelectedDate(date);
    setShowEventDetails(true);
    setClickedDateIndex(dayId);

    setAnimateDetails(false);
    setTimeout(() => {
      setAnimateDetails(true);
    }, 10);
  };

  const closeEventDetails = () => {
    setAnimateDetails(false);
    setTimeout(() => {
      setShowEventDetails(false);
      setClickedDateIndex(null);
    }, 300);
  };

  const calendarGrid = createCalendarGrid();

  const weeks: DayObject[][] = [];
  for (let i = 0; i < calendarGrid.length; i += 7) {
    weeks.push(calendarGrid.slice(i, i + 7));
  }

  const { t } = useTranslation();

  return (
    <div className="rounded-lg shadow-lg md:px-6 max-w-6xl mx-auto bg-background">
      <div className="flex flex-col md:flex-row gap-6">
        <div
          className={`w-full ${
            showEventDetails ? "md:w-3/5" : "md:w-full"
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {t(`calendar:months.${monthNames[currentMonth]}`)} {currentYear}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-muted cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer select-none"
              >
                {t("calendar:today")}
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-muted cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-red-400 dark:bg-red-500 inline-block mr-2"></span>
              <span className="text-sm text-muted-foreground flex items-center">
                <User size={16} className="mr-1" /> {t("calendar:yourEvents")}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-red-700 dark:bg-red-900 inline-block mr-2"></span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Users size={16} className="mr-1" /> {t("calendar:allEvents")}
              </span>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-muted/50">
              {dayNames.map((day, index) => (
                <div
                  key={index}
                  className="py-2 text-center font-medium text-muted-foreground border-b border-border"
                >
                  {t(`calendar:shortenedDays.${day}`)}
                </div>
              ))}
            </div>

            <div>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7">
                  {week.map((dayObj, dayIndex) => {
                    const dateEvents = getEventsForDate(dayObj.date);
                    const hasPersonalEvent = dateEvents.some(
                      (event) => event.isPersonal
                    );
                    const hasGeneralEvent = dateEvents.some(
                      (event) => !event.isPersonal
                    );
                    const dayId = `day-${weekIndex}-${dayIndex}`;
                    const isSelected = dayId === clickedDateIndex;

                    return (
                      <div
                        key={dayIndex}
                        id={dayId}
                        className={`min-h-24 p-1 border border-border relative ${
                          dayObj.currentMonth
                            ? "bg-background"
                            : "bg-muted/50 text-muted-foreground"
                        } ${
                          dateEvents.length > 0
                            ? "cursor-pointer hover:bg-muted/25"
                            : "cursor-default"
                        } transition-all duration-300 ease-in-out`}
                        onClick={() =>
                          dayObj.currentMonth &&
                          dateEvents.length > 0 &&
                          handleDateClick(dayObj.date, dayId)
                        }
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-500/10 animate-pulse z-0" />
                        )}

                        <div className="relative z-10">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {dayObj.day}
                            </span>
                            <div className="flex space-x-1">
                              {hasPersonalEvent && (
                                <span className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500"></span>
                              )}
                              {hasGeneralEvent && (
                                <span className="w-2 h-2 rounded-full bg-red-700 dark:bg-red-900"></span>
                              )}
                            </div>
                          </div>
                          <div className="mt-1">
                            {dateEvents.slice(0, 2).map((event, idx) => {
                              const isStartDate =
                                formatDate(dayObj.date) === event.startDate;
                              const isEndDate =
                                formatDate(dayObj.date) === event.endDate;
                              const isMiddleDate = !isStartDate && !isEndDate;

                              return (
                                <div
                                  key={idx}
                                  className={`text-xs p-1 mb-1 truncate ${
                                    isStartDate && isEndDate
                                      ? "rounded"
                                      : isStartDate
                                      ? "rounded-l"
                                      : isEndDate
                                      ? "rounded-r"
                                      : ""
                                  } ${
                                    event.isPersonal
                                      ? "bg-red-300 dark:bg-red-500 text-red-800 dark:text-white"
                                      : "bg-red-700 dark:bg-red-900 text-white"
                                  } ${
                                    isMiddleDate
                                      ? "border-l border-r border-dashed border-red-400 dark:border-red-600"
                                      : ""
                                  }`}
                                >
                                  {isStartDate ||
                                  (!isStartDate &&
                                    idx === 0 &&
                                    weekIndex > 0) ? (
                                    <div className="flex justify-between items-center">
                                      <span className="truncate">
                                        {event.title}
                                      </span>
                                      {isStartDate && event.startTime && (
                                        <span className="whitespace-nowrap text-opacity-70 ml-1">
                                          {formatTime(event.startTime).replace(
                                            " ",
                                            ""
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            })}
                            {dateEvents.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{dateEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showEventDetails && selectedDate && (
          <div
            className={`w-full md:w-2/5 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 ${
              animateDetails
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            } transition-all duration-300 ease-in-out`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {t("calendar:eventsFor")}{" "}
                <span>
                  {t(
                    `calendar:months.${selectedDate
                      .toLocaleDateString("en-US", {
                        month: "long",
                      })
                      .toLowerCase()}`
                  )}{" "}
                  {selectedDate.getDate()}, {selectedDate.getFullYear()}
                </span>
              </h3>
              <button
                onClick={closeEventDetails}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 text-sm flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500/20 border border-dashed border-red-500/40 mr-2"></span>
              <span className="text-muted-foreground">
                {t("calendar:multiDayEvents")}
              </span>
            </div>

            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event, idx) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-md ${
                      event.isPersonal
                        ? "bg-red-100/50 dark:bg-red-900/50 border-l-4 border-red-400 dark:border-red-500"
                        : "bg-red-200/50 dark:bg-red-800/50 border-l-4 border-red-600 dark:border-red-700"
                    } transform transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                      animateDetails
                        ? `opacity-100 translate-y-0`
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${idx * 75}ms` }}
                  >
                    <div className="flex items-center">
                      {event.isPersonal ? (
                        <User
                          size={16}
                          className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0"
                        />
                      ) : (
                        <Users
                          size={16}
                          className="text-red-700 dark:text-red-300 mr-2 flex-shrink-0"
                        />
                      )}
                      <h4 className="font-medium">{event.title}</h4>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        {event.isPersonal
                          ? t("calendar:yourPersonalEvent")
                          : t("calendar:openToAllUsers")}
                      </p>

                      <div className="text-sm font-medium mt-1 sm:mt-0">
                        {event.startTime && event.endTime && (
                          <span className="whitespace-nowrap">
                            {formatTime(event.startTime)} -{" "}
                            {formatTime(event.endTime)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      {(() => {
                        const start = new Date(event.startDate);
                        const end = new Date(event.endDate);

                        const formatParts = (date: Date) => ({
                          weekday: date.toLocaleDateString("en-US", {
                            weekday: "long",
                          }),
                          month: date.toLocaleDateString("en-US", {
                            month: "long",
                          }),
                          day: date.toLocaleDateString("en-US", {
                            day: "numeric",
                          }),
                        });

                        const startParts = formatParts(start);
                        const endParts = formatParts(end);

                        return (
                          <>
                            {t(
                              `calendar:daysOfWeek.${startParts.weekday.toLowerCase()}`
                            )}
                            ,{" "}
                            {t(
                              `calendar:months.${startParts.month.toLowerCase()}`
                            )}{" "}
                            {startParts.day}
                            {event.startDate !== event.endDate && (
                              <>
                                {" "}
                                –{" "}
                                {t(
                                  `calendar:daysOfWeek.${endParts.weekday.toLowerCase()}`
                                )}
                                ,{" "}
                                {t(
                                  `calendar:months.${endParts.month.toLowerCase()}`
                                )}{" "}
                                {endParts.day}
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-8 text-muted-foreground ${
                  animateDetails ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
              >
                <p>No events scheduled for this day.</p>
              </div>
            )}

            <div
              className={`mt-6 ${
                animateDetails
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } transition-all duration-300 ease-in-out`}
              style={{ transitionDelay: "300ms" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
