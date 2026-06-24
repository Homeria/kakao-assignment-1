"use client";

type TodosErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TodosError({ error, reset }: TodosErrorProps) {
  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Todo 화면 오류
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Todo 데이터를 불러오지 못했습니다</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          백엔드 서버 상태나 네트워크 연결을 확인한 뒤 다시 시도해주세요.
        </p>
        <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-lg bg-[#672be0] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5622be]"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}

