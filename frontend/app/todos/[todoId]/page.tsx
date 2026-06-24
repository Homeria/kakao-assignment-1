import Link from "next/link";
import { notFound } from "next/navigation";
import { getTodo } from "../../actions";
import TodoForm from "../../components/todo/TodoForm";
import { BackendRequestError } from "../../lib/api/backend";
import {
  createTodoListHref,
  parseTodoSearchParams,
  toURLSearchParams,
} from "../../lib/url/searchParams";

type EditTodoPageProps = {
  params: Promise<{
    todoId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditTodoPage({ params, searchParams }: EditTodoPageProps) {
  const { todoId } = await params;
  const currentSearchParams = toURLSearchParams(await searchParams);
  const searchState = parseTodoSearchParams(currentSearchParams);
  const cancelHref = createTodoListHref(currentSearchParams, searchState);

  const todo = await getTodo(todoId).catch((error: unknown) => {
    if (error instanceof BackendRequestError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href={cancelHref} className="text-sm font-semibold text-[#672be0] hover:underline">
          목록으로 돌아가기
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-950">Todo 수정</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Todo 내용, 날짜, 완료 상태를 수정합니다.
        </p>

        <div className="mt-6">
          <TodoForm
            mode="edit"
            todo={todo}
            defaultDate={searchState.date}
            cancelHref={cancelHref}
            returnSearchParams={currentSearchParams.toString()}
          />
        </div>
      </section>
    </main>
  );
}
