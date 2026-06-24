import Link from "next/link";
import { formatShortDate } from "../../lib/date";
import { createDateHref, type TodoSearchState } from "../../lib/url/searchParams";

type WeeklyDayCardProps = {
  dateKey: string;
  count: number;
  todayDate: string;
  searchState: TodoSearchState;
  currentSearchParams: URLSearchParams;
};

export default function WeeklyDayCard({
  dateKey,
  count,
  todayDate,
  searchState,
  currentSearchParams,
}: WeeklyDayCardProps) {
  const { dayLabel, dateLabel } = formatShortDate(dateKey);
  const isSelected = dateKey === searchState.date;
  const isToday = dateKey === todayDate;

  return (
    <Link
      href={createDateHref(currentSearchParams, dateKey)}
      className={`flex min-h-20 flex-col items-center justify-center rounded-lg border px-1 py-2 text-center transition ${
        isSelected
          ? "border-[#672be0] bg-[#672be0] text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-[#672be0]"
      }`}
      aria-current={isSelected ? "date" : undefined}
    >
      <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-500"}`}>
        {dayLabel}
      </span>
      <span className="mt-1 text-lg font-bold leading-none">{dateLabel}</span>
      {count > 0 && (
        <span
          className={`mt-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}
          aria-label={`${dateKey} Todo ${count}개`}
        >
          {count}개
        </span>
      )}
      {isToday && (
        <span
          className={`mt-1 text-[10px] font-bold ${isSelected ? "text-white" : "text-[#672be0]"}`}
        >
          오늘
        </span>
      )}
    </Link>
  );
}
