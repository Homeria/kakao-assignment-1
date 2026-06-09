import { parseLocalDate } from '../utils/date'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

// 월요일부터 일요일까지의 주간 날짜 목록을 보여주는 컴포넌트입니다.
// 날짜 계산과 Todo 개수 계산은 상위 Hook에서 끝내고, 이 컴포넌트는 표시와 선택 이벤트만 담당합니다.
export function WeeklyView({
    weekDates,
    selectedDate,
    todayDate,
    weeklyTodoCounts,
    onSelectDate,
    onMoveWeek,
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="주간 날짜 선택">
            <div className="flex items-center gap-2">
                <button
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-base font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
                    type="button"
                    onClick={() => onMoveWeek(-1)}
                    aria-label="이전 주로 이동"
                >
                    &lt;
                </button>

                <div className="grid min-w-0 flex-1 grid-cols-7 gap-1">
                    {weekDates.map((dateKey) => {
                        const date = parseLocalDate(dateKey)
                        const weekday = WEEKDAY_LABELS[date.getDay()]
                        const dayNumber = date.getDate()
                        const isSelected = dateKey === selectedDate
                        const isToday = dateKey === todayDate
                        const countInfo = weeklyTodoCounts[dateKey] ?? { total: 0, active: 0, completed: 0 }

                        return (
                            <button
                                key={dateKey}
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
                    })}
                </div>

                <button
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-base font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
                    type="button"
                    onClick={() => onMoveWeek(1)}
                    aria-label="다음 주로 이동"
                >
                    &gt;
                </button>
            </div>
        </section>
    )
}
