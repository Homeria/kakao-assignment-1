"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "../../lib/api/errors";
import { formatShortDate } from "../../lib/date";
import { createDateHref } from "../../lib/url/searchParams";
import { createTodo, updateTodo } from "../../lib/todo/client";
import type { Todo } from "../../lib/todo/types";
import { toTodoUpdateInput, validateTodoFormValues } from "../../lib/todo/validation";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";

type TodoFormProps = {
  mode: "create" | "edit";
  todo?: Todo;
  defaultDate: string;
  cancelHref: string;
  returnSearchParams: string;
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function formatDatePickerLabel(dateKey: string) {
  const { dayLabel } = formatShortDate(dateKey);

  if (!dayLabel) {
    return dateKey;
  }

  return `${dateKey} (${dayLabel})`;
}

export default function TodoForm({
  mode,
  todo,
  defaultDate,
  cancelHref,
  returnSearchParams,
}: TodoFormProps) {
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(todo?.title ?? "");
  const [date, setDate] = useState(todo?.date ?? defaultDate);
  const [completed, setCompleted] = useState(todo?.completed ?? false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePickerLabel = formatDatePickerLabel(date);

  function openDatePicker() {
    const dateInput = dateInputRef.current;

    if (!dateInput) {
      return;
    }

    // 브라우저가 지원하면 커스텀 날짜 버튼에서도 기본 달력 패널을 바로 엽니다.
    if (typeof dateInput.showPicker === "function") {
      try {
        dateInput.showPicker();
        return;
      } catch {
        // 일부 브라우저는 showPicker 호출 조건이 맞지 않으면 예외를 던져 기본 클릭 흐름으로 보완합니다.
      }
    }

    dateInput.focus();
    dateInput.click();
  }

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
        <div className="relative mt-2">
          <input
            ref={dateInputRef}
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute h-px w-px opacity-0"
          />
          <button
            type="button"
            onClick={openDatePicker}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-slate-300 px-4 py-3 text-left text-sm transition hover:border-[#672be0] focus:outline-none focus:ring-2 focus:ring-[#672be0]/20"
            aria-label={`날짜 선택: ${datePickerLabel}`}
          >
            <span className="font-semibold text-slate-800">{datePickerLabel}</span>
            <span className="text-slate-500" aria-hidden="true">
              <CalendarIcon />
            </span>
          </button>
          <span className="sr-only" aria-live="polite">
            선택한 날짜: {datePickerLabel}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          날짜 칸을 누르면 달력에서 선택할 수 있습니다.
        </p>
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

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </Button>
        <Button variant="secondary" onClick={() => router.push(cancelHref)}>
          취소
        </Button>
      </div>
    </form>
  );
}
