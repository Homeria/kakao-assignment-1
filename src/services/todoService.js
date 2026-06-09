import { TODO_FILTERS } from '../constants/filters'

// Todo 도메인 규칙과 데이터 변환을 담당하는 service 계층입니다.
// 이 파일은 React state나 localStorage를 직접 다루지 않고, 전달받은 데이터를 새 데이터로 변환합니다.

// 선택한 날짜의 Todo 배열을 가져옵니다.
// 해당 날짜에 Todo가 없으면 빈 배열을 반환해 컴포넌트에서 안전하게 map/filter를 사용할 수 있게 합니다.
export function getTodosByDate(todosByDate, dateKey) {
    return todosByDate[dateKey] ?? []
}

// 현재 필터 조건에 맞는 Todo 목록만 반환합니다.
// 필터 상태가 바뀌어도 원본 데이터는 수정하지 않고 화면에 보여줄 배열만 계산합니다.
export function getFilteredTodos(todos, activeFilter) {
    if (activeFilter === TODO_FILTERS.ACTIVE) {
        return todos.filter((todo) => !todo.completed)
    }

    if (activeFilter === TODO_FILTERS.COMPLETED) {
        return todos.filter((todo) => todo.completed)
    }

    return todos
}

// 특정 날짜의 Todo 개수 정보를 계산합니다.
// 주간 뷰의 날짜별 개수 배지와 일간 요약 표시에서 사용할 수 있습니다.
export function getTodoCountByDate(todosByDate, dateKey) {
    const todos = getTodosByDate(todosByDate, dateKey)
    const completed = todos.filter((todo) => todo.completed).length

    return {
        total: todos.length,
        active: todos.length - completed,
        completed,
    }
}

// 새로운 Todo를 선택한 날짜에 추가한 다음, 변경된 전체 todosByDate 객체를 반환합니다.
// id 생성은 호출하는 쪽에서 넘겨받아 service를 가능한 한 예측 가능한 함수로 유지합니다.
export function addTodo(todosByDate, dateKey, text, todoId) {
    const trimmedText = text.trim()

    if (!trimmedText) {
        return todosByDate
    }

    const previousTodos = getTodosByDate(todosByDate, dateKey)
    const newTodo = {
        id: todoId,
        text: trimmedText,
        completed: false,
    }

    return {
        ...todosByDate,
        [dateKey]: [...previousTodos, newTodo],
    }
}

// 특정 Todo의 완료 상태를 반전합니다.
// 완료 버튼을 누를 때 기존 객체를 직접 수정하지 않고 새 배열과 새 객체를 만들어 반환합니다.
export function toggleTodoCompleted(todosByDate, dateKey, todoId) {
    const previousTodos = getTodosByDate(todosByDate, dateKey)

    return {
        ...todosByDate,
        [dateKey]: previousTodos.map((todo) => {
            if (todo.id !== todoId) {
                return todo
            }

            return {
                ...todo,
                completed: !todo.completed,
            }
        }),
    }
}

// 특정 Todo의 텍스트를 수정합니다.
// 빈 문자열로 수정하려는 경우에는 기존 상태를 그대로 반환합니다.
export function updateTodoText(todosByDate, dateKey, todoId, nextText) {
    const trimmedText = nextText.trim()

    if (!trimmedText) {
        return todosByDate
    }

    const previousTodos = getTodosByDate(todosByDate, dateKey)

    return {
        ...todosByDate,
        [dateKey]: previousTodos.map((todo) => {
            if (todo.id !== todoId) {
                return todo
            }

            return {
                ...todo,
                text: trimmedText,
            }
        }),
    }
}

// 특정 Todo를 삭제합니다.
// 삭제 후 해당 날짜에 Todo가 하나도 남지 않으면 날짜 key도 제거해 빈 배열 데이터가 쌓이지 않게 합니다.
export function removeTodo(todosByDate, dateKey, todoId) {
    const previousTodos = getTodosByDate(todosByDate, dateKey)
    const nextTodos = previousTodos.filter((todo) => todo.id !== todoId)

    if (nextTodos.length === 0) {
        const nextTodosByDate = { ...todosByDate }
        delete nextTodosByDate[dateKey]

        return nextTodosByDate
    }

    return {
        ...todosByDate,
        [dateKey]: nextTodos,
    }
}
