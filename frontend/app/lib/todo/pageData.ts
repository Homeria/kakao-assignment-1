import { getTodos } from "../../actions";
import { buildTodoQuery, type TodoSearchState } from "../url/searchParams";
import type { Todo } from "./types";

export type TodoPageData = {
  selectedTodos: Todo[];
  weeklyTodoCounts: Record<string, number>;
  errorMessage: string;
};

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

function createTodoPageFallbackData(error: unknown): TodoPageData {
  return {
    selectedTodos: [],
    weeklyTodoCounts: {},
    errorMessage: error instanceof Error ? error.message : "Todo 데이터를 불러오지 못했습니다.",
  };
}

// /todos 페이지가 렌더링에만 집중할 수 있도록 서버 조회와 화면용 데이터 가공을 이곳에 모읍니다.
// 선택 날짜 목록과 주간 날짜별 개수는 서로 다른 조건으로 조회해야 해서 병렬로 요청합니다.
export async function getTodoPageData(searchState: TodoSearchState): Promise<TodoPageData> {
  try {
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
  } catch (error) {
    return createTodoPageFallbackData(error);
  }
}
