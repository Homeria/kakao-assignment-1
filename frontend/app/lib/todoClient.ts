import { requestClientApi } from "./clientApi";
import { JSON_HEADERS } from "./http";
import type { Todo, TodoCreateInput, TodoUpdateInput } from "./todo";

function getTodoPath(todoId: string | number) {
  return `/todos/${encodeURIComponent(String(todoId))}`;
}

function createJsonRequestInit(method: "POST" | "PUT", input: TodoCreateInput | TodoUpdateInput) {
  return {
    method,
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  };
}

// Client Component에서 사용하는 Todo 전용 API caller입니다.
// 컴포넌트는 HTTP method, header, JSON 변환 방식을 몰라도 되게 이 파일에 모아둡니다.
export function createTodo(input: TodoCreateInput) {
  return requestClientApi<Todo>("/todos", createJsonRequestInit("POST", input));
}

export function updateTodo(todoId: string | number, input: TodoUpdateInput) {
  return requestClientApi<Todo>(getTodoPath(todoId), createJsonRequestInit("PUT", input));
}

export function deleteTodo(todoId: string | number) {
  return requestClientApi<void>(getTodoPath(todoId), {
    method: "DELETE",
  });
}

export function toggleTodo(todo: Todo) {
  return updateTodo(todo.id, {
    completed: !todo.completed,
  });
}
