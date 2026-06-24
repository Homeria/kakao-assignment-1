"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createSearchHref } from "../../lib/url/searchParams";

type TodoSearchProps = {
  initialSearch: string;
  currentSearchParams: string;
};

export default function TodoSearch({ initialSearch, currentSearchParams }: TodoSearchProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const searchParams = useMemo(
    () => new URLSearchParams(currentSearchParams),
    [currentSearchParams],
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const nextHref = createSearchHref(searchParams, searchInput);

      router.replace(nextHref);
    }, 350);

    return () => window.clearTimeout(timerId);
  }, [router, searchInput, searchParams]);

  return (
    <div>
      <label htmlFor="todo-search" className="block text-sm font-semibold text-slate-700">
        Todo 검색
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="todo-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="검색어를 입력하세요"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="shrink-0 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            지우기
          </button>
        )}
      </div>
    </div>
  );
}
