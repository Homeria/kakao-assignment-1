import { TODO_FILTER_LABELS, TODO_FILTER_VALUES } from '../constants/filters'

// Todo 목록의 표시 조건을 바꾸는 필터 탭 컴포넌트입니다.
// 실제 필터 상태는 App 계층의 Hook이 관리하고, 이 컴포넌트는 현재 값과 변경 이벤트만 받습니다.
export function FilterTabs({ activeFilter, onChangeFilter }) {
    return (
        <div className="rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Todo 상태 필터">
            <div className="grid grid-cols-3 gap-1">
                {TODO_FILTER_VALUES.map((filter) => {
                    const isActive = activeFilter === filter

                    return (
                        <button
                            key={filter}
                            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                                isActive
                                    ? 'bg-white text-[#672be0] shadow-sm'
                                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                            }`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onChangeFilter(filter)}
                        >
                            {TODO_FILTER_LABELS[filter]}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
