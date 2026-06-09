import { TODO_FILTER_LABELS } from './constants/filters'
import { useTodoAppState } from './hooks/useTodoAppState'
import { formatDateToKorean } from './utils/date'

function App() {
  const todoApp = useTodoAppState()

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#672be0]">
          Kakao Tech Campus Precourse
        </p>
        <h1 className="mt-2 text-3xl font-bold">Todo List</h1>

        <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <p>
            <strong>선택 날짜:</strong> {formatDateToKorean(todoApp.selectedDate)}
          </p>
          <p>
            <strong>현재 필터:</strong> {TODO_FILTER_LABELS[todoApp.activeFilter]}
          </p>
          <p>
            <strong>표시 중인 Todo:</strong> {todoApp.filteredTodos.length}개
          </p>
          <p>
            <strong>선택 날짜 통계:</strong> 전체 {todoApp.selectedDateTodoCount.total}개 / 진행 중{' '}
            {todoApp.selectedDateTodoCount.active}개 / 완료 {todoApp.selectedDateTodoCount.completed}개
          </p>
          <p>
            <strong>주간 기준 날짜:</strong> {todoApp.weekStartDate}
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
