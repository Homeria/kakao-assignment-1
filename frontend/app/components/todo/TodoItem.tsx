"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestClientApi } from "../../lib/clientApi";
import type { Todo } from "../../lib/todo";

type TodoItemProps = {
  todo: Todo;
  editHref: string;
};

export default function TodoItem({ todo, editHref }: TodoItemProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle() {
    setIsUpdating(true);
    setErrorMessage("");

    try {
      await requestClientApi<Todo>(`/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Todo 상태 변경에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm("이 Todo를 삭제할까요?")) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await requestClientApi<void>(`/todos/${todo.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Todo 삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  }

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              todo.completed
                ? "border-[#672be0] bg-[#672be0] text-white"
                : "border-slate-300 text-transparent hover:border-[#672be0] hover:text-[#672be0]"
            }`}
            aria-label={todo.completed ? "진행 중으로 변경" : "완료로 변경"}
          >
            ✓
          </button>
          <span
            className={`truncate text-sm ${
              todo.completed ? "text-slate-400 line-through" : "text-slate-900"
            }`}
            title={todo.title}
          >
            {todo.title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={editHref}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            수정
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "삭제 중" : "삭제"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </li>
  );
}

