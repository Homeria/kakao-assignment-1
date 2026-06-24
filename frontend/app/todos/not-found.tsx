import Link from "next/link";

export default function TodoNotFound() {
  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#672be0]">
          Todo Not Found
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Todo를 찾을 수 없습니다</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          이미 삭제되었거나 존재하지 않는 Todo입니다.
        </p>
        <Link
          href="/todos"
          className="mt-5 inline-flex rounded-lg bg-[#672be0] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5622be]"
        >
          목록으로 돌아가기
        </Link>
      </section>
    </main>
  );
}

