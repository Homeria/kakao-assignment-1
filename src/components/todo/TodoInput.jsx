import { useState } from 'react'

// 새 Todo를 입력받는 컴포넌트입니다.
// 입력값 검증은 화면 피드백을 위해 여기서 처리하고, 실제 데이터 추가는 상위 콜백에 맡깁니다.
export function TodoInput({ onAddTodo }) {
    const [todoText, setTodoText] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        const trimmedText = todoText.trim()

        if (!trimmedText) {
            setErrorMessage('할 일을 입력해 주세요. 공백만 입력할 수 없습니다.')
            return
        }

        onAddTodo(trimmedText)
        setTodoText('')
        setErrorMessage('')
    }

    function handleChange(event) {
        setTodoText(event.target.value)

        if (errorMessage) {
            setErrorMessage('')
        }
    }

    return (
        <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="flex gap-2">
                <input
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
                    type="text"
                    value={todoText}
                    onChange={handleChange}
                    placeholder="새로운 할 일을 입력하세요"
                    maxLength={100}
                />
                <button
                    className="rounded-lg bg-[#672be0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5524bd]"
                    type="submit"
                >
                    추가
                </button>
            </div>

            {errorMessage && (
                <p className="text-left text-sm font-medium text-red-600" role="alert">
                    {errorMessage}
                </p>
            )}
        </form>
    )
}
