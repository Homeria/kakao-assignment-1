import { formatDateToKorean } from '../utils/date'

// 선택된 날짜를 보여주고 이전/다음 날짜 이동을 요청하는 컴포넌트입니다.
// 날짜 상태 자체는 상위 Hook이 관리하고, 이 컴포넌트는 표시와 이동 버튼만 담당합니다.
export function DateHeader({ selectedDate, onMoveDate }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <button
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
                type="button"
                onClick={() => onMoveDate(-1)}
                aria-label="이전 날짜로 이동"
            >
                &lt;
            </button>

            <div className="min-w-0 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#672be0]">Selected Date</p>
                <h2 className="mt-1 truncate text-lg font-bold text-slate-950 sm:text-xl">
                    {formatDateToKorean(selectedDate)}
                </h2>
            </div>

            <button
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
                type="button"
                onClick={() => onMoveDate(1)}
                aria-label="다음 날짜로 이동"
            >
                &gt;
            </button>
        </div>
    )
}
