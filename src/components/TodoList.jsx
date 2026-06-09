import { EmptyState } from './EmptyState'
import { TodoItem } from './TodoItem'

// 현재 선택 날짜와 필터 조건을 반영한 Todo 목록을 렌더링합니다.
// TodoItem에 개별 행의 수정/토글/삭제 UI를 위임합니다.
export function TodoList({ todos, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
    if (todos.length === 0) {
        return <EmptyState />
    }

    return (
        <ul className="space-y-3">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleTodo={onToggleTodo}
                    onUpdateTodo={onUpdateTodo}
                    onDeleteTodo={onDeleteTodo}
                />
            ))}
        </ul>
    )
}
