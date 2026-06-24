"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { checkBackendHealth, type TodoDebugState } from "../../lib/debug/todoDebug";
import { getErrorMessage } from "../../lib/api/errors";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";

type BackendHealthState = {
  status: "idle" | "checking" | "ok" | "error";
  message: string;
  checkedAt: string;
};

type TodoDebugPanelProps = {
  debugState: TodoDebugState;
  children: ReactNode;
};

const filterLabels: Record<TodoDebugState["filter"], string> = {
  all: "전체",
  active: "진행 중",
  completed: "완료",
};

function formatCheckedAt(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-2 last:border-b-0 sm:grid-cols-[120px_1fr]">
      <dt className="shrink-0 text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="min-w-0 break-all text-xs font-semibold text-slate-800 sm:text-right">{value}</dd>
    </div>
  );
}

function DebugIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
      <path d="M7 10h10" />
      <path d="M6 13H4" />
      <path d="M20 13h-2" />
      <path d="M7 17H5" />
      <path d="M19 17h-2" />
      <path d="M8 9h8v8a4 4 0 0 1-8 0z" />
      <path d="M10 21h4" />
    </svg>
  );
}

export default function TodoDebugPanel({ children, debugState }: TodoDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState<BackendHealthState>({
    status: "idle",
    message: "아직 확인하지 않았습니다.",
    checkedAt: "-",
  });

  async function handleCheckBackendHealth() {
    setBackendHealth((current) => ({
      ...current,
      status: "checking",
      message: "확인 중...",
    }));

    try {
      const health = await checkBackendHealth();

      setBackendHealth({
        status: health.status === "ok" ? "ok" : "error",
        message: `백엔드 응답: ${health.status}`,
        checkedAt: formatCheckedAt(new Date()),
      });
    } catch (error) {
      setBackendHealth({
        status: "error",
        message: getErrorMessage(error, "백엔드 상태 확인에 실패했습니다."),
        checkedAt: formatCheckedAt(new Date()),
      });
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">{children}</div>
        <Button
          variant="secondary"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="todo-debug-panel"
          aria-label={isOpen ? "디버그 채널 닫기" : "디버그 채널 열기"}
          title={isOpen ? "디버그 채널 닫기" : "디버그 채널 열기"}
          className={`flex size-10 shrink-0 items-center justify-center p-0 ${
            isOpen ? "border-[#672be0] text-[#672be0]" : ""
          }`}
        >
          <DebugIcon />
        </Button>
      </div>

      {isOpen && (
        <div
          id="todo-debug-panel"
          className="mt-5 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <div>
            <p className="text-sm font-bold text-slate-900">디버그 채널</p>
            <p className="mt-1 text-xs text-slate-500">
              URL 상태, API 요청 기준, 서버 연결 상태를 한 번에 확인합니다.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <dl className="rounded-lg border border-slate-200 bg-white px-4 py-2">
              <DebugRow label="선택 날짜" value={debugState.selectedDate} />
              <DebugRow label="주 시작일" value={debugState.weekStart} />
              <DebugRow label="필터" value={filterLabels[debugState.filter]} />
              <DebugRow label="검색어" value={debugState.search || "-"} />
              <DebugRow
                label="현재 URL query"
                value={debugState.currentQueryString || "query parameter 없음"}
              />
            </dl>

            <dl className="rounded-lg border border-slate-200 bg-white px-4 py-2">
              <DebugRow label="Todo API path" value={debugState.todoApiPath} />
              <DebugRow
                label="Todo API query"
                value={debugState.todoQueryString || "query parameter 없음"}
              />
              <DebugRow label="선택 Todo 수" value={`${debugState.selectedTodoCount}개`} />
              <DebugRow label="주간 Todo 날짜 수" value={`${debugState.weeklyTodoDateCount}일`} />
              <DebugRow label="주간 Todo 총합" value={`${debugState.weeklyTodoTotalCount}개`} />
              <DebugRow label="생성 시각" value={debugState.generatedAt} />
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">백엔드 상태</p>
                <p
                  className={`mt-1 text-sm font-bold ${
                    backendHealth.status === "ok" ? "text-emerald-600" : "text-slate-800"
                  }`}
                >
                  {backendHealth.message}
                </p>
                <p className="mt-1 text-xs text-slate-500">마지막 확인: {backendHealth.checkedAt}</p>
              </div>
              <Button
                onClick={handleCheckBackendHealth}
                disabled={backendHealth.status === "checking"}
                className="shrink-0 px-3 py-2"
              >
                {backendHealth.status === "checking" ? "확인 중" : "상태 확인"}
              </Button>
            </div>

            {backendHealth.status === "error" && (
              <ErrorMessage className="mt-3 px-3 py-2">{backendHealth.message}</ErrorMessage>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
