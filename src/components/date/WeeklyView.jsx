import { WeeklyDayCard } from './WeeklyDayCard'

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
                    {weekDates.map((dateKey) => (
                        <WeeklyDayCard
                            key={dateKey}
                            dateKey={dateKey}
                            selectedDate={selectedDate}
                            todayDate={todayDate}
                            countInfo={weeklyTodoCounts[dateKey] ?? { total: 0, active: 0, completed: 0 }}
                            onSelectDate={onSelectDate}
                        />
                    ))}
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
