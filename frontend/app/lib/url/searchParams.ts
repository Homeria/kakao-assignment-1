import { getTodayDateKey, getWeekStartDate, isDateKey } from "../date";
import { isTodoFilter, type TodoFilter, type TodoQuery } from "../todo/types";

export type TodoSearchState = {
  date: string;
  weekStart: string;
  filter: TodoFilter;
  search: string;
};

function getParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);

  return value?.trim() ?? "";
}

export function toURLSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      if (value[0] !== undefined) {
        urlSearchParams.set(key, value[0]);
      }
      continue;
    }

    if (value !== undefined) {
      urlSearchParams.set(key, value);
    }
  }

  return urlSearchParams;
}

// URL 쿼리 파라미터를 화면에서 바로 쓰기 좋은 상태 객체로 정리합니다.
// 잘못된 날짜나 필터 값은 기본값으로 되돌려 직접 URL을 입력해도 화면이 깨지지 않게 합니다.
export function parseTodoSearchParams(searchParams: URLSearchParams): TodoSearchState {
  const dateParam = getParam(searchParams, "date");
  const weekStartParam = getParam(searchParams, "weekStart");
  const filterParam = getParam(searchParams, "filter");
  const search = getParam(searchParams, "search");
  const todayDate = getTodayDateKey();
  const date = isDateKey(dateParam) ? dateParam : todayDate;

  return {
    date,
    weekStart: isDateKey(weekStartParam) ? weekStartParam : getWeekStartDate(date),
    filter: isTodoFilter(filterParam) ? filterParam : "all",
    search,
  };
}

export function buildTodoQuery(state: TodoSearchState): TodoQuery {
  return {
    date: state.date,
    filter: state.filter,
    search: state.search,
  };
}

function createTodoHref(
  pathname: string,
  currentSearchParams: URLSearchParams,
  updates: Partial<TodoSearchState>,
) {
  const nextSearchParams = new URLSearchParams(currentSearchParams.toString());

  if (updates.date !== undefined) {
    nextSearchParams.set("date", updates.date);
    nextSearchParams.set("weekStart", updates.weekStart ?? getWeekStartDate(updates.date));
  }

  if (updates.weekStart !== undefined) {
    nextSearchParams.set("weekStart", updates.weekStart);
  }

  if (updates.filter !== undefined) {
    if (updates.filter === "all") {
      nextSearchParams.delete("filter");
    } else {
      nextSearchParams.set("filter", updates.filter);
    }
  }

  if (updates.search !== undefined) {
    if (updates.search.trim()) {
      nextSearchParams.set("search", updates.search.trim());
    } else {
      nextSearchParams.delete("search");
    }
  }

  const queryString = nextSearchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

// 기존 쿼리 문자열을 보존하면서 일부 값만 바꿀 때 사용합니다.
// 빈 문자열이나 기본값은 URL에서 제거해 주소를 짧고 읽기 쉽게 유지합니다.
export function createTodoSearchHref(
  currentSearchParams: URLSearchParams,
  updates: Partial<TodoSearchState>,
) {
  return createTodoHref("/todos", currentSearchParams, updates);
}

export function createTodoListHref(
  currentSearchParams: URLSearchParams,
  searchState: Pick<TodoSearchState, "date" | "weekStart">,
) {
  return createTodoSearchHref(currentSearchParams, searchState);
}

export function createDateHref(currentSearchParams: URLSearchParams, date: string) {
  return createTodoSearchHref(currentSearchParams, { date });
}

export function createWeekHref(currentSearchParams: URLSearchParams, weekStart: string) {
  return createTodoSearchHref(currentSearchParams, {
    date: weekStart,
    weekStart,
  });
}

export function createFilterHref(currentSearchParams: URLSearchParams, filter: TodoFilter) {
  return createTodoSearchHref(currentSearchParams, { filter });
}

export function createSearchHref(currentSearchParams: URLSearchParams, search: string) {
  return createTodoSearchHref(currentSearchParams, { search });
}

export function createNewTodoHref(
  currentSearchParams: URLSearchParams,
  searchState: Pick<TodoSearchState, "date" | "weekStart">,
) {
  return createTodoHref("/todos/new", currentSearchParams, searchState);
}

export function createEditTodoHref(todoId: string | number, currentSearchParams: URLSearchParams) {
  const pathname = `/todos/${encodeURIComponent(String(todoId))}`;

  return createTodoHref(pathname, currentSearchParams, {});
}
