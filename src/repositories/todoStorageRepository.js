import { STORAGE_KEYS } from '../constants/storage'

// Todo 데이터의 localStorage 입출력을 전담하는 Repository입니다.
// 이 계층은 "어디에 저장할지"만 알고, Todo를 어떻게 추가/수정/삭제할지는 알지 않습니다.
// Todo 생성, 수정, 삭제 같은 도메인 규칙은 service 계층에서 처리합니다.
export const todoStorageRepository = {

    // localStorage에 저장된 전체 Todo 데이터를 가져옵니다.
    // 저장된 값이 없거나 읽기에 실패하면 앱이 계속 동작하도록 빈 객체를 반환합니다.
    load() {
        try {
            const savedTodos = localStorage.getItem(STORAGE_KEYS.TODOS)

            if (savedTodos === null) {
                return {}
            }

            return JSON.parse(savedTodos)
        } catch (error) {
            console.error('Todo 데이터를 불러오지 못했습니다.', error)
            return {}
        }
    },

    // todosByDate 전체 상태를 localStorage에 덮어씁니다.
    // 새 Todo 추가, 수정, 삭제 결과가 반영된 "최신 전체 상태"를 저장하는 역할입니다.
    save(todosByDate) {
        try {
            localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todosByDate))
        } catch (error) {
            console.error('Todo 데이터를 저장하지 못했습니다.', error)
        }
    },

    // localStorage에서 Todo 데이터를 모두 삭제합니다.
    // 일반 CRUD 흐름에서는 자주 쓰지 않지만, 초기화나 디버깅 상황을 위해 둡니다.
    clear() {
        try {
            localStorage.removeItem(STORAGE_KEYS.TODOS)
        } catch (error) {
            console.error('Todo 데이터를 삭제하지 못했습니다.', error)
        }
    },
}
