import { isDateKey } from "./date";
import type { TodoCreateInput, TodoUpdateInput } from "./todo";

export type TodoFormValues = {
  title: string;
  date: string;
  completed: boolean;
};

type TodoFormValidationResult =
  | {
      isValid: true;
      input: TodoCreateInput;
    }
  | {
      isValid: false;
      message: string;
    };

// 폼 입력값을 서버에 보낼 Todo payload로 변환합니다.
// UI 컴포넌트는 검증 메시지를 보여주는 일만 맡고, 입력 정책은 이 파일에 모읍니다.
export function validateTodoFormValues(values: TodoFormValues): TodoFormValidationResult {
  const title = values.title.trim();
  const date = values.date.trim();

  if (!title) {
    return {
      isValid: false,
      message: "할 일을 입력해주세요.",
    };
  }

  if (!isDateKey(date)) {
    return {
      isValid: false,
      message: "날짜는 YYYY-MM-DD 형식으로 입력해주세요.",
    };
  }

  return {
    isValid: true,
    input: {
      title,
      completed: values.completed,
      date,
    },
  };
}

export function toTodoUpdateInput(input: TodoCreateInput): TodoUpdateInput {
  return {
    title: input.title,
    completed: input.completed,
    date: input.date,
  };
}
