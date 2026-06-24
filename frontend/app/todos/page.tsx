import DateHeader from "../components/date/DateHeader";
import TodoDebugPanel from "../components/debug/TodoDebugPanel";
import WeeklyView from "../components/date/WeeklyView";
import FilterTabs from "../components/filter/FilterTabs";
import TodoList from "../components/todo/TodoList";
import TodoSearch from "../components/todo/TodoSearch";
import ButtonLink from "../components/ui/ButtonLink";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageCard from "../components/ui/PageCard";
import { getTodayDateKey } from "../lib/date";
import { createTodoDebugState } from "../lib/debug/todoDebug";
import { getTodoPageData } from "../lib/todo/pageData";
import {
  createNewTodoHref,
  parseTodoSearchParams,
  toURLSearchParams,
} from "../lib/url/searchParams";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentSearchParams = toURLSearchParams(resolvedSearchParams);
  const searchState = parseTodoSearchParams(currentSearchParams);
  const todayDate = getTodayDateKey();
  const createHref = createNewTodoHref(currentSearchParams, searchState);
  const { selectedTodos, weeklyTodoCounts, errorMessage } = await getTodoPageData(searchState);
  const debugState = createTodoDebugState({
    currentSearchParams,
    searchState,
    selectedTodoCount: selectedTodos.length,
    weeklyTodoCounts,
  });

  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <PageCard as="header">
          <TodoDebugPanel debugState={debugState}>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#672be0]">
              Kakao Tech Campus Assignment 3
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Todo List</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              선택한 날짜의 Todo를 서버에서 조회하고, 날짜 이동 상태는 URL로 관리합니다.
            </p>
          </TodoDebugPanel>
        </PageCard>

        <WeeklyView
          todayDate={todayDate}
          weeklyTodoCounts={weeklyTodoCounts}
          searchState={searchState}
          currentSearchParams={currentSearchParams}
        />

        <PageCard>
          <DateHeader searchState={searchState} currentSearchParams={currentSearchParams} />

          <div className="mt-6 space-y-4">
            <TodoSearch
              key={searchState.search}
              initialSearch={searchState.search}
              currentSearchParams={currentSearchParams.toString()}
            />
            <FilterTabs searchState={searchState} currentSearchParams={currentSearchParams} />
          </div>

          <div className="mt-5">
            <ButtonLink href={createHref}>Todo 추가</ButtonLink>
          </div>

          {errorMessage && (
            <ErrorMessage className="mt-5">
              <p className="font-bold">Todo 데이터를 불러오지 못했습니다.</p>
              <p className="mt-1">{errorMessage}</p>
              <p className="mt-2 text-xs text-red-600">
                백엔드 서버가 실행 중인지, `BACKEND_URL`이 올바른지 확인해주세요.
              </p>
            </ErrorMessage>
          )}

          <div className="mt-6">
            <TodoList
              todos={selectedTodos}
              search={searchState.search}
              currentSearchParams={currentSearchParams}
            />
          </div>
        </PageCard>
      </div>
    </main>
  );
}
