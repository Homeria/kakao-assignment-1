import Link from "next/link";
import { addDays, formatKoreanDate } from "../../lib/date";
import { createTodoSearchHref, type TodoSearchState } from "../../lib/searchParams";

type DateHeaderProps = {
  searchState: TodoSearchState;
  currentSearchParams: URLSearchParams;
};

export default function DateHeader({ searchState, currentSearchParams }: DateHeaderProps) {
  const previousDate = addDays(searchState.date, -1);
  const nextDate = addDays(searchState.date, 1);

  return (
    <section className="flex items-center justify-between gap-3" aria-label="선택 날짜 이동">
      <Link
        href={createTodoSearchHref(currentSearchParams, { date: previousDate })}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
        aria-label="이전 날짜로 이동"
      >
        &lt;
      </Link>

      <div className="min-w-0 text-center">
        <p className="text-sm font-semibold text-slate-500">선택 날짜</p>
        <h2 className="mt-1 truncate text-xl font-bold text-slate-950">
          {formatKoreanDate(searchState.date)}
        </h2>
      </div>

      <Link
        href={createTodoSearchHref(currentSearchParams, { date: nextDate })}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
        aria-label="다음 날짜로 이동"
      >
        &gt;
      </Link>
    </section>
  );
}

