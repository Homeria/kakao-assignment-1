import { DateHeader } from './components/date/DateHeader'
import { WeeklyView } from './components/date/WeeklyView'
import { DebugPanel } from './components/debug/DebugPanel'
import { FilterTabs } from './components/filter/FilterTabs'
import { TodoInput } from './components/todo/TodoInput'
import { TodoList } from './components/todo/TodoList'
import { useTodoAppState } from './hooks/useTodoAppState'

function App() {
  const todoApp = useTodoAppState()

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#672be0]">
              Kakao Tech Campus Precourse
            </p>
            <h1 className="mt-2 text-3xl font-bold">Todo List</h1>
          </div>

          <DebugPanel
            activeFilter={todoApp.activeFilter}
            filteredTodoCount={todoApp.filteredTodos.length}
            selectedDateTodoCount={todoApp.selectedDateTodoCount}
            allTodoCount={todoApp.allTodoCount}
            weekTodoCount={todoApp.weekTodoCount}
            storedDateCount={todoApp.storedDateCount}
            selectedDate={todoApp.selectedDate}
            todayDate={todoApp.todayDate}
            weekDates={todoApp.weekDates}
          />
        </div>

        <div className="mt-6">
          <WeeklyView
            weekDates={todoApp.weekDates}
            selectedDate={todoApp.selectedDate}
            todayDate={todoApp.todayDate}
            weeklyTodoCounts={todoApp.weeklyTodoCounts}
            onSelectDate={todoApp.selectDate}
            onMoveWeek={todoApp.moveWeek}
          />
        </div>

        <div className="mt-6">
          <DateHeader
            selectedDate={todoApp.selectedDate}
            onMoveDate={todoApp.moveDate}
          />
        </div>

        <div className="mt-6">
          <TodoInput onAddTodo={todoApp.addTodo} />
        </div>

        <div className="mt-4">
          <FilterTabs
            activeFilter={todoApp.activeFilter}
            onChangeFilter={todoApp.changeFilter}
          />
        </div>

        <div className="mt-6">
          <TodoList
            todos={todoApp.filteredTodos}
            onToggleTodo={todoApp.toggleTodo}
            onUpdateTodo={todoApp.updateTodo}
            onDeleteTodo={todoApp.deleteTodo}
          />
        </div>
      </section>
    </main>
  )
}

export default App
