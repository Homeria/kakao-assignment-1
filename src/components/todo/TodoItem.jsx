import { useState } from 'react'

// 개별 Todo 한 줄을 담당하는 컴포넌트입니다.
// 수정 모드와 수정 중인 입력값은 해당 TodoItem 내부에서만 필요한 UI 상태이므로 여기서 관리합니다.
export function TodoItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(todo.text)
    const [errorMessage, setErrorMessage] = useState('')

    function startEdit() {
        setEditText(todo.text)
        setErrorMessage('')
        setIsEditing(true)
    }

    function cancelEdit() {
        setEditText(todo.text)
        setErrorMessage('')
        setIsEditing(false)
    }

    function saveEdit() {
        const trimmedText = editText.trim()

        if (!trimmedText) {
            setErrorMessage('수정할 내용을 입력해 주세요.')
            return
        }

        onUpdateTodo(todo.id, trimmedText)
        setIsEditing(false)
        setErrorMessage('')
    }

    function handleEditKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            saveEdit()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            cancelEdit()
        }
    }

    if (isEditing) {
        return (
            <li className="rounded-lg border border-[#672be0]/30 bg-[#672be0]/5 p-3">
                <div className="flex gap-2">
                    <input
                        className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
                        type="text"
                        value={editText}
                        onChange={(event) => {
                            setEditText(event.target.value)
                            setErrorMessage('')
                        }}
                        onKeyDown={handleEditKeyDown}
                        maxLength={100}
                        autoFocus
                    />
                    <button
                        className="rounded-md bg-[#672be0] px-3 py-2 text-sm font-semibold text-white hover:bg-[#5524bd]"
                        type="button"
                        onClick={saveEdit}
                    >
                        저장
                    </button>
                    <button
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        type="button"
                        onClick={cancelEdit}
                    >
                        취소
                    </button>
                </div>

                {errorMessage && (
                    <p className="mt-2 text-left text-sm font-medium text-red-600" role="alert">
                        {errorMessage}
                    </p>
                )}
            </li>
        )
    }

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
                    onClick={startEdit}
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
