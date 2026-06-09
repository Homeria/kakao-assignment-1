// Todo 목록을 어떤 상태 기준으로 보여줄지 나타내는 필터 상수입니다.
// 문자열을 컴포넌트와 service에 직접 흩뿌리지 않기 위해 한 곳에서 관리합니다.
export const TODO_FILTERS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed',
}

// 필터 값 검증에 사용할 배열입니다.
// 잘못된 필터 값이 들어왔을 때 상태가 깨지는 것을 막는 데 사용합니다.
export const TODO_FILTER_VALUES = Object.values(TODO_FILTERS)

// 화면에 표시할 필터 이름입니다.
// 실제 상태 값과 사용자에게 보이는 텍스트를 분리해두면 UI 문구 변경이 쉬워집니다.
export const TODO_FILTER_LABELS = {
    [TODO_FILTERS.ALL]: '전체',
    [TODO_FILTERS.ACTIVE]: '진행 중',
    [TODO_FILTERS.COMPLETED]: '완료',
}
