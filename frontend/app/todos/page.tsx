import { getTodos } from "../actions";
import DateHeader from "../components/date/DateHeader";
import WeeklyView from "../components/date/WeeklyView";
import TodoList from "../components/todo/TodoList";
import { getTodayDateKey } from "../lib/date";
import { buildTodoQuery, parseTodoSearchParams } from "../lib/searchParams";
import type { Todo } from "../lib/todo";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toURLSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      if (value[0] !== undefined) {
        urlSearchParams.set(key, value[0]);
      }
      continue;
    }

    if (value !== undefined) {
      urlSearchParams.set(key, value);
    }
  }

  return urlSearchParams;
}

function getTodoCountByDate(todos: Todo[]) {
  return todos.reduce<Record<string, number>>((counts, todo) => {
    if (!todo.date) {
      return counts;
    }

    return {
      ...counts,
      [todo.date]: (counts[todo.date] ?? 0) + 1,
    };
  }, {});
}

async function getTodoPageData(searchState: ReturnType<typeof parseTodoSearchParams>) {
  const selectedTodosPromise = getTodos(buildTodoQuery(searchState));
  const weeklySourceTodosPromise = getTodos({
    filter: searchState.filter,
    search: searchState.search,
  });

  const [selectedTodos, weeklySourceTodos] = await Promise.all([
    selectedTodosPromise,
    weeklySourceTodosPromise,
  ]);

  return {
    selectedTodos,
    weeklyTodoCounts: getTodoCountByDate(weeklySourceTodos),
    errorMessage: "",
  };
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentSearchParams = toURLSearchParams(resolvedSearchParams);
  const searchState = parseTodoSearchParams(currentSearchParams);
  const todayDate = getTodayDateKey();
  const { selectedTodos, weeklyTodoCounts, errorMessage } = await getTodoPageData(searchState).catch(
    (error: unknown) => ({
      selectedTodos: [],
      weeklyTodoCounts: {},
      errorMessage: error instanceof Error ? error.message : "Todo 데이터를 불러오지 못했습니다.",
    }),
  );

  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#672be0]">
            Kakao Tech Campus Assignment 3
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Todo List</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            선택한 날짜의 Todo를 서버에서 조회하고, 날짜 이동 상태는 URL로 관리합니다.
          </p>
        </header>

        <WeeklyView
          todayDate={todayDate}
          weeklyTodoCounts={weeklyTodoCounts}
          searchState={searchState}
          currentSearchParams={currentSearchParams}
        />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <DateHeader searchState={searchState} currentSearchParams={currentSearchParams} />

          {errorMessage && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="mt-6">
            <TodoList todos={selectedTodos} search={searchState.search} />
          </div>
        </section>
      </div>
    </main>
  );
}
