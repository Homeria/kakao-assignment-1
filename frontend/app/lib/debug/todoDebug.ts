import { requestClientApi } from "../api/client";
import { buildTodoQuery, type TodoSearchState } from "../url/searchParams";
import type { TodoQuery } from "../todo/types";

export type DebugBackendHealth = {
  status: string;
};

export type TodoDebugState = {
  selectedDate: string;
  weekStart: string;
  filter: TodoSearchState["filter"];
  search: string;
  todoQuery: TodoQuery;
  todoQueryString: string;
};

function createTodoQueryString(query: TodoQuery) {
  const searchParams = new URLSearchParams();

  if (query.date) {
    searchParams.set("date", query.date);
  }

  if (query.filter && query.filter !== "all") {
    searchParams.set("filter", query.filter);
  }

  if (query.search) {
    searchParams.set("search", query.search);
  }

  return searchParams.toString();
}

// Todo 화면의 URL 상태를 디버그 패널에서 보여주기 좋은 구조로 변환합니다.
// 실제 Todo 목록 조회에 쓰는 query와 같은 기준을 사용해 화면 상태와 API 요청 상태를 함께 확인할 수 있습니다.
export function createTodoDebugState(searchState: TodoSearchState): TodoDebugState {
  const todoQuery = buildTodoQuery(searchState);

  return {
    selectedDate: searchState.date,
    weekStart: searchState.weekStart,
    filter: searchState.filter,
    search: searchState.search,
    todoQuery,
    todoQueryString: createTodoQueryString(todoQuery),
  };
}

export function checkBackendHealth() {
  return requestClientApi<DebugBackendHealth>("/debug/health");
}
