import { parseLocalDate } from '../../utils/date'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

// 주간 뷰 안에서 날짜 카드 하나를 담당하는 컴포넌트입니다.
// 선택 여부, 오늘 여부, Todo 개수 배지를 한 카드 안에서 표현합니다.
export function WeeklyDayCard({ dateKey, selectedDate, todayDate, countInfo, onSelectDate }) {
    const date = parseLocalDate(dateKey)
    const weekday = WEEKDAY_LABELS[date.getDay()]
    const dayNumber = date.getDate()
    const isSelected = dateKey === selectedDate
    const isToday = dateKey === todayDate

    return (
        <button
            className={`min-w-0 rounded-lg border px-1 py-2 text-center transition ${
                isSelected
                    ? 'border-[#672be0] bg-[#672be0] text-white shadow-sm'
                    : 'border-transparent bg-slate-50 text-slate-600 hover:border-[#672be0]/40 hover:bg-[#672be0]/5'
            }`}
            type="button"
            onClick={() => onSelectDate(dateKey)}
            aria-label={`${dateKey} 일정 보기${isToday ? ' 오늘' : ''}`}
            aria-current={isSelected ? 'date' : undefined}
        >
            <span className="block text-xs font-semibold">{weekday}</span>
            <span className="mt-1 block text-lg font-bold leading-none">{dayNumber}</span>
            <span
                className={`mx-auto mt-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                    isSelected
                        ? 'bg-white/20 text-white'
                        : countInfo.active > 0
                            ? 'bg-[#672be0]/10 text-[#672be0]'
                            : 'bg-slate-200 text-slate-500'
                }`}
                title={`전체 ${countInfo.total}개, 진행 중 ${countInfo.active}개, 완료 ${countInfo.completed}개`}
            >
                {countInfo.active}
            </span>
            {isToday && (
                <span
                    className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-[#672be0]'
                    }`}
                    aria-hidden="true"
                />
            )}
        </button>
    )
}
