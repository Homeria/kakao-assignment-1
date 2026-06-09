import { STORAGE_KEYS } from '../constants/storage'

// Todo 내용이 아니라 화면 상태의 localStorage 입출력을 전담하는 Repository입니다.
// 예를 들어 주간 뷰가 어느 주차를 보고 있었는지 같은 UI 상태를 저장합니다.
// Todo 데이터 저장소와 분리해두면 Todo 도메인 데이터와 화면 편의 상태가 섞이지 않습니다.
export const uiStorageRepository = {
    // 저장된 일간 뷰 선택 날짜를 가져옵니다.
    // 저장된 값이 없거나 읽기에 실패하면 호출자가 넘긴 fallbackDate를 사용합니다.
    loadSelectedDate(fallbackDate) {
        try {
            const savedSelectedDate = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE)

            if (savedSelectedDate === null) {
                return fallbackDate
            }

            return JSON.parse(savedSelectedDate)
        } catch (error) {
            console.error('일간 뷰 선택 날짜를 불러오지 못했습니다.', error)
            return fallbackDate
        }
    },

    // 현재 일간 뷰 선택 날짜를 저장합니다.
    // 새로고침 후에도 주간 뷰와 일간 뷰가 같은 날짜 흐름을 바라보게 하기 위해 사용합니다.
    saveSelectedDate(selectedDate) {
        try {
            localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, JSON.stringify(selectedDate))
        } catch (error) {
            console.error('일간 뷰 선택 날짜를 저장하지 못했습니다.', error)
        }
    },

    // 저장된 주간 뷰 시작 날짜를 가져옵니다.
    // 저장된 값이 없거나 읽기에 실패하면 호출자가 넘긴 fallbackDate를 사용합니다.
    loadWeekStartDate(fallbackDate) {
        try {
            const savedWeekStartDate = localStorage.getItem(STORAGE_KEYS.WEEK_START_DATE)

            if (savedWeekStartDate === null) {
                return fallbackDate
            }

            return JSON.parse(savedWeekStartDate)
        } catch (error) {
            console.error('주간 뷰 기준 날짜를 불러오지 못했습니다.', error)
            return fallbackDate
        }
    },

    // 현재 주간 뷰의 시작 날짜를 저장합니다.
    // 새로고침 후에도 사용자가 보던 주차를 복구하기 위해 사용합니다.
    saveWeekStartDate(weekStartDate) {
        try {
            localStorage.setItem(STORAGE_KEYS.WEEK_START_DATE, JSON.stringify(weekStartDate))
        } catch (error) {
            console.error('주간 뷰 기준 날짜를 저장하지 못했습니다.', error)
        }
    },
}
