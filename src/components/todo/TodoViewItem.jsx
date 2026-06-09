// 일반 조회 모드의 Todo 한 줄을 표시하는 컴포넌트입니다.
// 완료 토글, 수정 모드 진입, 삭제 요청을 상위 TodoItem으로 전달합니다.
export function TodoViewItem({ todo, onToggleTodo, onStartEdit, onDeleteTodo }) {
    return (
        <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-sm transition ${
                        todo.completed
                            ? 'border-[#672be0] bg-[#672be0] text-white'
                            : 'border-slate-300 text-transparent hover:border-[#672be0]'
                    }`}
                    type="button"
                    onClick={() => onToggleTodo(todo.id)}
                    aria-label={todo.completed ? '진행 중으로 변경' : '완료로 변경'}
                >
                    ✓
                </button>
                <span
                    className={`truncate text-left text-sm ${
                        todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                    title={todo.text}
                >
                    {todo.text}
                </span>
            </div>

            <div className="flex shrink-0 gap-2">
                <button
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    type="button"
                    onClick={onStartEdit}
                >
                    수정
                </button>
                <button
                    className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    type="button"
                    onClick={() => onDeleteTodo(todo.id)}
                >
                    삭제
                </button>
            </div>
        </li>
    )
}
