"use client";

import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageCard from "../components/ui/PageCard";

type TodosErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TodosError({ error, reset }: TodosErrorProps) {
  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <PageCard className="mx-auto max-w-2xl" tone="danger">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Todo 화면 오류
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Todo 데이터를 불러오지 못했습니다</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          백엔드 서버 상태나 네트워크 연결을 확인한 뒤 다시 시도해주세요.
        </p>
        <ErrorMessage className="mt-4">{error.message || "알 수 없는 오류가 발생했습니다."}</ErrorMessage>
        <Button onClick={reset} className="mt-5">
          다시 시도
        </Button>
      </PageCard>
    </main>
  );
}
