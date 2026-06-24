import { createEditTodoHref } from "../../lib/searchParams";
import type { Todo } from "../../lib/todo";
import EmptyState from "./EmptyState";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  search: string;
  currentSearchParams: URLSearchParams;
};

export default function TodoList({ todos, search, currentSearchParams }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editHref={createEditTodoHref(todo.id, currentSearchParams)}
        />
      ))}
    </ul>
  );
}
