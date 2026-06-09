// localStorage key를 한 곳에서 관리합니다.
// 문자열 key를 여러 파일에 직접 쓰면 오타가 나도 찾기 어렵기 때문에 상수로 분리합니다.
export const STORAGE_KEYS = {
    TODOS: `taskflow_todos_data`,
    WEEK_START_DATE: `taskflow_week_start_date`
};
