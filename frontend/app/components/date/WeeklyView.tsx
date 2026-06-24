import Link from "next/link";
import { addDays, getWeekDates } from "../../lib/date";
import { createWeekHref, type TodoSearchState } from "../../lib/url/searchParams";
import WeeklyDayCard from "./WeeklyDayCard";

type WeeklyViewProps = {
  todayDate: string;
  weeklyTodoCounts: Record<string, number>;
  searchState: TodoSearchState;
  currentSearchParams: URLSearchParams;
};

export default function WeeklyView({
  todayDate,
  weeklyTodoCounts,
  searchState,
  currentSearchParams,
}: WeeklyViewProps) {
  const weekDates = getWeekDates(searchState.weekStart);
  const previousWeekStart = addDays(searchState.weekStart, -7);
  const nextWeekStart = addDays(searchState.weekStart, 7);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="주간 날짜 선택">
      <div className="flex items-center gap-2">
        <Link
          href={createWeekHref(currentSearchParams, previousWeekStart)}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-base font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
          aria-label="이전 주로 이동"
        >
          &lt;
        </Link>

        <div className="grid min-w-0 flex-1 grid-cols-7 gap-1">
          {weekDates.map((dateKey) => (
            <WeeklyDayCard
              key={dateKey}
              dateKey={dateKey}
              count={weeklyTodoCounts[dateKey] ?? 0}
              todayDate={todayDate}
              searchState={searchState}
              currentSearchParams={currentSearchParams}
            />
          ))}
        </div>

        <Link
          href={createWeekHref(currentSearchParams, nextWeekStart)}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-base font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
          aria-label="다음 주로 이동"
        >
          &gt;
        </Link>
      </div>
    </section>
  );
}
