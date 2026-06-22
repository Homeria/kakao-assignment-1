import Link from "next/link";
import TodoForm from "../../components/todo/TodoForm";
import { createTodoSearchHref, parseTodoSearchParams, toURLSearchParams } from "../../lib/searchParams";

type NewTodoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const currentSearchParams = toURLSearchParams(await searchParams);
  const searchState = parseTodoSearchParams(currentSearchParams);
  const cancelHref = createTodoSearchHref(currentSearchParams, {
    date: searchState.date,
    weekStart: searchState.weekStart,
  });

  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href={cancelHref} className="text-sm font-semibold text-[#672be0] hover:underline">
          목록으로 돌아가기
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-950">Todo 추가</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          선택한 날짜에 저장할 Todo를 입력합니다.
        </p>

        <div className="mt-6">
          <TodoForm
            mode="create"
            defaultDate={searchState.date}
            cancelHref={cancelHref}
            returnSearchParams={currentSearchParams.toString()}
          />
        </div>
      </section>
    </main>
  );
}

