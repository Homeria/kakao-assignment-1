"use server";

import { revalidatePath } from "next/cache";
import {
  buildTodosPath,
  fetchBackendJson,
  fetchBackendNoContent,
} from "./lib/api";
import { JSON_HEADERS } from "./lib/http";
import type { Todo, TodoCreateInput, TodoQuery, TodoUpdateInput } from "./lib/todo";

// Server Component에서 Todo 목록을 바로 조회할 때 사용하는 서버 함수입니다.
// 클라이언트에 BACKEND_URL을 노출하지 않고 FastAPI를 호출할 수 있습니다.
export async function getTodos(query: TodoQuery = {}) {
  return fetchBackendJson<Todo[]>(buildTodosPath(query));
}

// 수정 페이지처럼 특정 Todo 하나가 필요한 서버 화면에서 사용합니다.
export async function getTodo(todoId: string | number) {
  return fetchBackendJson<Todo>(`/todos/${todoId}`);
}

// Server Action 방식으로 Todo를 생성할 때 사용할 수 있도록 준비한 함수입니다.
// 현재 페이지 캐시를 갱신해 목록 화면이 오래된 데이터를 보여주지 않게 합니다.
export async function createTodo(input: TodoCreateInput) {
  const todo = await fetchBackendJson<Todo>("/todos", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });

  revalidatePath("/todos");

  return todo;
}

// Todo 제목, 완료 상태, 날짜 중 필요한 값만 부분 수정합니다.
// 상세 페이지와 목록 페이지 양쪽이 영향을 받을 수 있어 둘 다 revalidate합니다.
export async function updateTodo(todoId: string | number, input: TodoUpdateInput) {
  const todo = await fetchBackendJson<Todo>(`/todos/${todoId}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });

  revalidatePath("/todos");
  revalidatePath(`/todos/${todoId}`);

  return todo;
}

// 삭제 후 목록 페이지를 다시 검증해 서버 DB 상태와 화면을 맞춥니다.
export async function deleteTodo(todoId: string | number) {
  await fetchBackendNoContent(`/todos/${todoId}`, {
    method: "DELETE",
  });

  revalidatePath("/todos");
}
