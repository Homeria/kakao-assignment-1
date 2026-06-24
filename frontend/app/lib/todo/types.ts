export const TODO_FILTERS = ["all", "active", "completed"] as const;

export type TodoFilter = (typeof TODO_FILTERS)[number];

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
  created_at: string;
  updated_at: string;
};

export type TodoQuery = {
  date?: string;
  filter?: TodoFilter;
  search?: string;
};

export type TodoCreateInput = {
  title: string;
  completed?: boolean;
  date?: string | null;
};

export type TodoUpdateInput = Partial<TodoCreateInput>;

export const TODO_FILTER_LABELS: Record<TodoFilter, string> = {
  all: "전체",
  active: "진행 중",
  completed: "완료",
};

export function isTodoFilter(value: string | null | undefined): value is TodoFilter {
  return TODO_FILTERS.includes(value as TodoFilter);
}

