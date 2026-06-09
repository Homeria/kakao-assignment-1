// 인라인 수정 모드의 Todo 한 줄을 표시하는 컴포넌트입니다.
// 수정 입력값과 에러 메시지는 TodoItem이 관리하고, 이 컴포넌트는 수정 UI만 담당합니다.
export function TodoEditItem({
    editText,
    errorMessage,
    onChangeEditText,
    onSaveEdit,
    onCancelEdit,
    onEditKeyDown,
}) {
    return (
        <li className="rounded-lg border border-[#672be0]/30 bg-[#672be0]/5 p-3">
            <div className="flex gap-2">
                <input
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
                    type="text"
                    value={editText}
                    onChange={(event) => onChangeEditText(event.target.value)}
                    onKeyDown={onEditKeyDown}
                    maxLength={100}
                    autoFocus
                />
                <button
                    className="rounded-md bg-[#672be0] px-3 py-2 text-sm font-semibold text-white hover:bg-[#5524bd]"
                    type="button"
                    onClick={onSaveEdit}
                >
                    저장
                </button>
                <button
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    type="button"
                    onClick={onCancelEdit}
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
