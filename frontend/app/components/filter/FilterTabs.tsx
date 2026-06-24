import Link from "next/link";
import { createTodoSearchHref, type TodoSearchState } from "../../lib/searchParams";
import { TODO_FILTER_LABELS, TODO_FILTERS, type TodoFilter } from "../../lib/todo";

type FilterTabsProps = {
  searchState: TodoSearchState;
  currentSearchParams: URLSearchParams;
};

function getFilterDescription(filter: TodoFilter) {
  if (filter === "active") {
    return "진행 중 Todo만 보기";
  }

  if (filter === "completed") {
    return "완료된 Todo만 보기";
  }

  return "모든 Todo 보기";
}

export default function FilterTabs({ searchState, currentSearchParams }: FilterTabsProps) {
  return (
    <nav className="grid grid-cols-3 gap-2" aria-label="Todo 상태 필터">
      {TODO_FILTERS.map((filter) => {
        const isActive = filter === searchState.filter;

        return (
          <Link
            key={filter}
            href={createTodoSearchHref(currentSearchParams, { filter })}
            className={`rounded-lg px-3 py-2 text-center text-sm font-bold transition ${
              isActive
                ? "bg-[#672be0] text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-[#672be0] hover:text-[#672be0]"
            }`}
            aria-current={isActive ? "page" : undefined}
            title={getFilterDescription(filter)}
          >
            {TODO_FILTER_LABELS[filter]}
          </Link>
        );
      })}
    </nav>
  );
}

