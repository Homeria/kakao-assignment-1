"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "../../lib/api/errors";
import { createDateHref } from "../../lib/url/searchParams";
import { createTodo, updateTodo } from "../../lib/todo/client";
import type { Todo } from "../../lib/todo/types";
import { toTodoUpdateInput, validateTodoFormValues } from "../../lib/todo/validation";

type TodoFormProps = {
  mode: "create" | "edit";
  todo?: Todo;
  defaultDate: string;
  cancelHref: string;
  returnSearchParams: string;
};

export default function TodoForm({
  mode,
  todo,
  defaultDate,
  cancelHref,
  returnSearchParams,
}: TodoFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(todo?.title ?? "");
  const [date, setDate] = useState(todo?.date ?? defaultDate);
  const [completed, setCompleted] = useState(todo?.completed ?? false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateTodoFormValues({
      title,
      completed,
      date,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (mode === "create") {
        await createTodo(validation.input);
      } else if (todo) {
        await updateTodo(todo.id, toTodoUpdateInput(validation.input));
      }

      const redirectHref = createDateHref(
        new URLSearchParams(returnSearchParams),
        validation.input.date ?? date,
      );

      router.push(redirectHref);
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Todo 저장에 실패했습니다."));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
          할 일
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="할 일을 입력하세요"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-semibold text-slate-700">
          날짜
        </label>
        <input
          id="date"
          type="text"
          inputMode="numeric"
          pattern="\d{4}-\d{2}-\d{2}"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          placeholder="YYYY-MM-DD"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
        />
        <p className="mt-2 text-xs text-slate-500">예: 2026-06-22</p>
      </div>

      {mode === "edit" && (
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => setCompleted(event.target.checked)}
            className="size-4 accent-[#672be0]"
          />
          완료된 Todo로 표시
        </label>
      )}

      {errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#672be0] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5622be] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          취소
        </button>
      </div>
    </form>
  );
}
