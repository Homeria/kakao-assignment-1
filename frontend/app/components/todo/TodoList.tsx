import type { Todo } from "../../lib/todo";
import EmptyState from "./EmptyState";

type TodoListProps = {
  todos: Todo[];
  search: string;
};

export default function TodoList({ todos, search }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-sm ${
                todo.completed
                  ? "border-[#672be0] bg-[#672be0] text-white"
                  : "border-slate-300 text-transparent"
              }`}
              aria-hidden="true"
            >
              ✓
            </span>
            <span
              className={`truncate text-sm ${
                todo.completed ? "text-slate-400 line-through" : "text-slate-900"
              }`}
              title={todo.title}
            >
              {todo.title}
            </span>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {todo.completed ? "완료" : "진행 중"}
          </span>
        </li>
      ))}
    </ul>
  );
}

