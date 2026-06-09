import { useState } from 'react'
import { TODO_FILTER_LABELS } from '../../constants/filters'

// 과제 검증과 학습을 돕기 위한 상태 확인 패널입니다.
// 실제 Todo 사용 흐름을 방해하지 않도록 기본적으로 접어두고, 버튼을 눌렀을 때만 상태 정보를 보여줍니다.
export function DebugPanel({
    activeFilter,
    filteredTodoCount,
    selectedDateTodoCount,
    allTodoCount,
    weekTodoCount,
    storedDateCount,
    selectedDate,
    todayDate,
    weekDates,
}) {
    const [isOpen, setIsOpen] = useState(false)
    const weekRangeText = formatWeekRange(weekDates)

    return (
        <div className="relative flex justify-end">
            <button
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition ${
                    isOpen
                        ? 'border-[#672be0] bg-[#672be0] text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#672be0]/50 hover:text-[#672be0]'
                }`}
                type="button"
                onClick={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
                aria-expanded={isOpen}
            >
                <span>상태</span>
                <span className={`text-xs ${isOpen ? 'text-white/80' : 'text-slate-400'}`}>
                    {isOpen ? '닫기' : '보기'}
                </span>
            </button>

            {isOpen && (
                <section className="absolute right-0 top-12 z-20 w-[min(88vw,28rem)] rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#672be0]">Debug Snapshot</p>
                            <h2 className="mt-1 text-base font-bold text-slate-950">React 상태 요약</h2>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                            local
                        </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <DebugMetric label="선택 날짜" value={selectedDate} />
                        <DebugMetric label="오늘 날짜" value={todayDate} />
                        <DebugMetric label="주간 범위" value={weekRangeText} />
                        <DebugMetric label="현재 필터" value={TODO_FILTER_LABELS[activeFilter]} />
                        <DebugMetric label="표시 목록" value={`${filteredTodoCount}개`} />
                        <DebugMetric label="저장된 날짜" value={`${storedDateCount}일`} />
                    </div>

                    <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
                        <DebugCountGroup title="선택 날짜" countInfo={selectedDateTodoCount} />
                        <DebugCountGroup title="이번 주" countInfo={weekTodoCount} />
                        <DebugCountGroup title="전체 저장" countInfo={allTodoCount} />
                    </div>
                </section>
            )}
        </div>
    )
}

function formatWeekRange(weekDates) {
    if (weekDates.length === 0) {
        return '-'
    }

    const startDate = weekDates[0]
    const endDate = weekDates[weekDates.length - 1]
    const [startYear, startMonth, startDay] = startDate.split('-')
    const [endYear, endMonth, endDay] = endDate.split('-')

    if (startYear === endYear) {
        return `${startYear}.${startMonth}.${startDay} ~ ${endMonth}.${endDay}`
    }

    return `${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay}`
}

function DebugMetric({ label, value }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 truncate text-sm font-bold text-slate-950">{value}</p>
        </div>
    )
}

function DebugCountGroup({ title, countInfo }) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">{title}</p>
            <dl className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">전체</dt>
                    <dd className="font-bold text-slate-950">{countInfo.total}개</dd>
                </div>
                <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">진행</dt>
                    <dd className="font-bold text-[#672be0]">{countInfo.active}개</dd>
                </div>
                <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">완료</dt>
                    <dd className="font-bold text-slate-950">{countInfo.completed}개</dd>
                </div>
            </dl>
        </div>
    )
}
