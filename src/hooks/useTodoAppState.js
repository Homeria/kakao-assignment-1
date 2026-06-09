import { useCallback, useMemo, useState } from 'react'
import { TODO_FILTERS, TODO_FILTER_VALUES } from '../constants/filters'
import { todoStorageRepository } from '../repositories/todoStorageRepository'
import { uiStorageRepository } from '../repositories/uiStorageRepository'
import { addDays, getTodayDateKey, getWeekDates, getWeekStartDate } from '../utils/date'
import { useStoredState } from './useStoredState'
import {
    addTodo,
    getFilteredTodos,
    getTodoCountByDate,
    getTodosByDate,
    removeTodo,
    toggleTodoCompleted,
    updateTodoText,
} from '../services/todoService'

// Todo 앱의 핵심 상태와 액션을 조립하는 Hook입니다.
// Repository는 저장소 입출력을, Service는 Todo 데이터 변환을 담당하고,
// 이 Hook은 두 계층을 React state 흐름에 연결합니다.
export function useTodoAppState() {
    const todayDate = getTodayDateKey()

    const [todosByDate, setTodosByDate] = useStoredState(
        todoStorageRepository.load,
        todoStorageRepository.save,
    )
    const [selectedDate, setSelectedDate] = useState(todayDate)
    const [activeFilter, setActiveFilter] = useState(TODO_FILTERS.ALL)
    const [weekStartDate, setWeekStartDate] = useStoredState(
        () => uiStorageRepository.loadWeekStartDate(getWeekStartDate(todayDate)),
        uiStorageRepository.saveWeekStartDate,
    )

    // 선택된 날짜의 원본 Todo 목록입니다.
    const selectedDateTodos = useMemo(() => {
        return getTodosByDate(todosByDate, selectedDate)
    }, [todosByDate, selectedDate])

    // 선택된 날짜와 현재 필터를 모두 반영한 화면 표시용 Todo 목록입니다.
    const filteredTodos = useMemo(() => {
        return getFilteredTodos(selectedDateTodos, activeFilter)
    }, [selectedDateTodos, activeFilter])

    // 선택된 날짜의 전체/진행 중/완료 개수 정보입니다.
    const selectedDateTodoCount = useMemo(() => {
        return getTodoCountByDate(todosByDate, selectedDate)
    }, [todosByDate, selectedDate])

    // 주간 뷰에서 사용할 월~일 7일 날짜 배열입니다.
    const weekDates = useMemo(() => {
        return getWeekDates(weekStartDate)
    }, [weekStartDate])

    const handleAddTodo = useCallback((text) => {
        setTodosByDate((previousTodosByDate) => {
            return addTodo(previousTodosByDate, selectedDate, text, Date.now())
        })
    }, [selectedDate, setTodosByDate])

    const handleToggleTodo = useCallback((todoId) => {
        setTodosByDate((previousTodosByDate) => {
            return toggleTodoCompleted(previousTodosByDate, selectedDate, todoId)
        })
    }, [selectedDate, setTodosByDate])

    const handleUpdateTodo = useCallback((todoId, nextText) => {
        setTodosByDate((previousTodosByDate) => {
            return updateTodoText(previousTodosByDate, selectedDate, todoId, nextText)
        })
    }, [selectedDate, setTodosByDate])

    const handleDeleteTodo = useCallback((todoId) => {
        setTodosByDate((previousTodosByDate) => {
            return removeTodo(previousTodosByDate, selectedDate, todoId)
        })
    }, [selectedDate, setTodosByDate])

    const handleChangeFilter = useCallback((nextFilter) => {
        if (TODO_FILTER_VALUES.includes(nextFilter)) {
            setActiveFilter(nextFilter)
        }
    }, [])

    const handleSelectDate = useCallback((nextDate) => {
        setSelectedDate(nextDate)
        setWeekStartDate(getWeekStartDate(nextDate))
    }, [setWeekStartDate])

    const handleMoveDate = useCallback((offsetDays) => {
        const nextDate = addDays(selectedDate, offsetDays)
        setSelectedDate(nextDate)
        setWeekStartDate(getWeekStartDate(nextDate))
    }, [selectedDate, setWeekStartDate])

    const handleMoveWeek = useCallback((offsetWeeks) => {
        const nextWeekStartDate = addDays(weekStartDate, offsetWeeks * 7)
        setWeekStartDate(nextWeekStartDate)
        setSelectedDate(nextWeekStartDate)
    }, [weekStartDate, setWeekStartDate])

    return {
        todosByDate,
        selectedDate,
        activeFilter,
        weekStartDate,
        todayDate,
        selectedDateTodos,
        filteredTodos,
        selectedDateTodoCount,
        weekDates,
        addTodo: handleAddTodo,
        toggleTodo: handleToggleTodo,
        updateTodo: handleUpdateTodo,
        deleteTodo: handleDeleteTodo,
        changeFilter: handleChangeFilter,
        selectDate: handleSelectDate,
        moveDate: handleMoveDate,
        moveWeek: handleMoveWeek,
    }
}
