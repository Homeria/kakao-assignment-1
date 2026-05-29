/**
 * TodoList Component
 * 
 * 현재 선택된 날짜와 활성화된 필터 조건에 대응하는 할 일 리스트를 화면에 렌더링합니다.
 * 토글(Toggle), 수정(Edit), 삭제(Delete) 기능을 이벤트 위임(Event Delegation)을 통해 처리하며,
 * 비어있는 경우 우아한 Empty State를 제공합니다.
 */

import store from '../core/store.js';

export default class TodoList {
  /**
   * @param {string} containerSelector - 마운트될 DOM 컨테이너 셀렉터
   */
  constructor(containerSelector) {
    this.$container = document.querySelector(containerSelector);
    if (!this.$container) return;

    // 현재 수정 모드에 진입해 있는 Todo의 ID (null일 경우 일반 모드)
    this.editingTodoId = null;

    // 1. 스토어 구독: 전역 상태가 바뀔 때마다 render 함수가 자동 재실행되도록 연결
    store.subscribe(() => this.render());

    // 2. 초기화 화면 렌더링
    this.render();

    // 3. 이벤트 위임 리스너 등록
    this.bindEvents();
  }

  /**
   * 상태 기반 투두 목록 동적 드로잉
   */
  render() {
    const todos = store.getFilteredTodos();

    // 할 일 리스트가 없는 경우 Empty State 출력
    if (todos.length === 0) {
      this.$container.innerHTML = this.getEmptyStateHTML();
      return;
    }

    // 할 일 리스트 출력
    this.$container.innerHTML = `
      <div class="todo-list-container">
        ${todos.map(todo => this.getTodoItemHTML(todo)).join('')}
      </div>
    `;
  }

  /**
   * 개별 Todo 항목의 HTML 템플릿 생성 (수정 모드 분기 처리)
   * @param {Object} todo - 투두 아이템 데이터 객체
   */
  getTodoItemHTML(todo) {
    const isEditing = this.editingTodoId === todo.id;
    const isCompleted = todo.completed;

    if (isEditing) {
      // 1) 인라인 수정 모드 HTML
      return `
        <div class="todo-item editing" data-id="${todo.id}">
          <div class="todo-item-left">
            <input 
              type="text" 
              class="todo-edit-input" 
              value="${todo.text}"
              maxlength="100"
            >
          </div>
          <div class="todo-actions">
            <button class="todo-action-btn save-btn" aria-label="저장">
              저장
            </button>
            <button class="todo-action-btn cancel-btn" aria-label="취소">
              취소
            </button>
          </div>
        </div>
      `;
    }

    // 2) 일반 조회 및 토글 모드 HTML
    return `
      <div class="todo-item ${isCompleted ? 'completed' : ''}" data-id="${todo.id}">
        <div class="todo-item-left">
          <button class="todo-checkbox-btn" aria-label="${isCompleted ? '진행중으로 토글' : '완료로 토글'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <span class="todo-text" title="${todo.text}">${todo.text}</span>
        </div>
        <div class="todo-actions">
          <button class="todo-action-btn edit-btn" aria-label="수정">
            수정
          </button>
          <button class="todo-action-btn delete-btn" aria-label="삭제">
            삭제
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 할 일이 비어있을 때 표출될 비주얼 HTML 구조 정의
   */
  getEmptyStateHTML() {
    return `
      <div class="todo-empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>등록된 할 일이 없습니다.</p>
      </div>
    `;
  }

  /**
   * 이벤트 위임(Event Delegation)을 통한 고성능 클릭 이벤트 조율
   */
  bindEvents() {
    // 1. 클릭 관련 액션 총괄
    this.$container.addEventListener('click', (e) => {
      const $todoItem = e.target.closest('.todo-item');
      if (!$todoItem) return;

      const todoId = Number($todoItem.dataset.id);

      // A. 완료 체크 토글 버튼 클릭 시
      if (e.target.closest('.todo-checkbox-btn')) {
        store.toggleTodoStatus(todoId);
        return;
      }

      // B. 수정 모드 진입 버튼 클릭 시
      if (e.target.closest('.edit-btn')) {
        this.editingTodoId = todoId;
        this.render();
        // 수정 인풋 창 포커스 진입 처리
        const $input = this.$container.querySelector(`.todo-item[data-id="${todoId}"] .todo-edit-input`);
        if ($input) {
          $input.focus();
          $input.setSelectionRange($input.value.length, $input.value.length); // 커서를 텍스트 끝으로 이동
        }
        return;
      }

      // C. 수정 취소 버튼 클릭 시
      if (e.target.closest('.cancel-btn')) {
        this.editingTodoId = null;
        this.render();
        return;
      }

      // D. 수정 내용 저장 버튼 클릭 시
      if (e.target.closest('.save-btn')) {
        this.handleSave(todoId, $todoItem);
        return;
      }

      // E. 투두 삭제 버튼 클릭 시
      if (e.target.closest('.delete-btn')) {
        store.deleteTodo(todoId);
        return;
      }
    });

    // 2. 수정 모드 키보드 처리 (엔터 저장, ESC 취소)
    this.$container.addEventListener('keydown', (e) => {
      const $todoItem = e.target.closest('.todo-item');
      if (!$todoItem || this.editingTodoId === null) return;

      const todoId = Number($todoItem.dataset.id);
      const $input = $todoItem.querySelector('.todo-edit-input');

      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSave(todoId, $todoItem);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.editingTodoId = null;
        this.render();
      }
    });
  }

  /**
   * 수정 데이터 무결성 체크 및 세이브 수행 후 뷰 탈출
   * @param {number} todoId - 수정 대상 ID
   * @param {HTMLElement} $todoItem - 대상 Todo DOM 행 노드
   */
  handleSave(todoId, $todoItem) {
    const $input = $todoItem.querySelector('.todo-edit-input');
    if (!$input) return;

    const value = $input.value.trim();
    if (!value) {
      alert('할 일을 입력해 주세요!');
      $input.focus();
      return;
    }

    // 수정 반영 및 모드 탈출
    this.editingTodoId = null;
    store.updateTodoText(todoId, value);
  }
}
