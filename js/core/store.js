/**
 * Store - 애플리케이션 비즈니스 상태 관리 모듈
 * 
 * Observable 클래스를 상속받아 이벤트 전파 메커니즘을 획득하고,
 * storage 모듈을 연동하여 로컬 데이터 영속성을 유지합니다.
 * 오직 전역 상태 제어와 데이터 필터링/가공(Getter) 역할만 책임집니다.
 */

import Observable from './observable.js';
import storage from './storage.js';

class Store extends Observable {
  constructor() {
    super(); // Observable 클래스의 생성자 호출 (subscribers 배열 초기화)

    // 글로벌 상태 트리 정의
    this.state = {
      selectedDate: this.getTodayDateString(), // 활성화된 기준 날짜 (YYYY-MM-DD)
      activeFilter: 'all',                     // 렌더링 필터 조건 ('all' | 'active' | 'completed')
      todos: storage.load()                    // 날짜별 할 일 데이터 객체 { "YYYY-MM-DD": [ ... ] }
    };
  }

  /* ==========================================================================
     상태 제어 비즈니스 액션 (Action Layer)
     ========================================================================== */

  /**
   * 새로운 할 일(Todo)을 현재 선택된 날짜에 추가합니다.
   * @param {string} text - 할 일 내용
   */
  addTodo(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const dateKey = this.state.selectedDate;
    if (!this.state.todos[dateKey]) {
      this.state.todos[dateKey] = [];
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedText,
      completed: false
    };

    this.state.todos[dateKey].push(newTodo);
    this.commitChanges();
  }

  /**
   * 할 일의 완료 상태를 토글(반전)합니다.
   * @param {number} todoId - 대상 할 일 ID
   */
  toggleTodoStatus(todoId) {
    const dateKey = this.state.selectedDate;
    const todoList = this.state.todos[dateKey] || [];
    const todo = todoList.find(item => item.id === todoId);

    if (todo) {
      todo.completed = !todo.completed;
      this.commitChanges();
    }
  }

  /**
   * 특정 할 일의 텍스트를 변경합니다.
   * @param {number} todoId - 대상 할 일 ID
   * @param {string} newText - 수정할 텍스트 내용
   */
  updateTodoText(todoId, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    const dateKey = this.state.selectedDate;
    const todoList = this.state.todos[dateKey] || [];
    const todo = todoList.find(item => item.id === todoId);

    if (todo) {
      todo.text = trimmedText;
      this.commitChanges();
    }
  }

  /**
   * 특정 할 일을 리스트에서 완전 삭제합니다.
   * @param {number} todoId - 대상 할 일 ID
   */
  deleteTodo(todoId) {
    const dateKey = this.state.selectedDate;
    const todoList = this.state.todos[dateKey] || [];

    this.state.todos[dateKey] = todoList.filter(item => item.id !== todoId);
    
    // 메모리 절약을 위해 해당 날짜의 할 일이 없으면 키 삭제
    if (this.state.todos[dateKey].length === 0) {
      delete this.state.todos[dateKey];
    }

    this.commitChanges();
  }

  /**
   * 기준 선택 날짜를 변경합니다.
   * @param {string} dateString - 변경할 날짜 문자열 (YYYY-MM-DD)
   */
  setSelectedDate(dateString) {
    if (this.state.selectedDate !== dateString) {
      this.state.selectedDate = dateString;
      this.publish(this.state); // 날짜 변경은 스토리지 비저장이므로 publish만 실행
    }
  }

  /**
   * 조회용 상태 필터를 갱신합니다.
   * @param {string} filter - 'all' | 'active' | 'completed'
   */
  setFilter(filter) {
    const validFilters = ['all', 'active', 'completed'];
    if (validFilters.includes(filter) && this.state.activeFilter !== filter) {
      this.state.activeFilter = filter;
      this.publish(this.state); // 필터 변경 역시 publish만 실행
    }
  }

  /* ==========================================================================
     상태 동기화 및 발행 보조 메서드
     ========================================================================== */

  /**
   * 상태의 변경사항을 로컬 저장소에 동기화하고 변경 알림을 전송(Publish)합니다.
   */
  commitChanges() {
    storage.save(this.state.todos);
    this.publish(this.state);
  }

  /* ==========================================================================
     데이터 가공 게터 메서드 (Getter Layer)
     ========================================================================== */

  /**
   * 현재 날짜와 설정된 필터 조건에 부합하는 투두 목록을 반환합니다.
   * @returns {Array} 가공된 투두 객체 리스트
   */
  getFilteredTodos() {
    const dateKey = this.state.selectedDate;
    const todoList = this.state.todos[dateKey] || [];
    const filter = this.state.activeFilter;

    if (filter === 'active') {
      return todoList.filter(todo => !todo.completed);
    }
    if (filter === 'completed') {
      return todoList.filter(todo => todo.completed);
    }
    return todoList;
  }

  /**
   * 특정 날짜의 총/진행중/완료 할 일 개수 정보를 제공합니다.
   * @param {string} dateString - 조회 대상 날짜 (YYYY-MM-DD)
   * @returns {Object} { total, active, completed }
   */
  getTodoCountInfo(dateString) {
    const todoList = this.state.todos[dateString] || [];
    const completedCount = todoList.filter(todo => todo.completed).length;
    
    return {
      total: todoList.length,
      active: todoList.length - completedCount,
      completed: completedCount
    };
  }

  /**
   * 브라우저 로컬 시간을 기준으로 YYYY-MM-DD 형식 문자열을 획득합니다.
   * @returns {string} 로컬 날짜 문자열
   */
  getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// 싱글톤 인스턴스 수출
const store = new Store();
export default store;
