/**
 * TodoInput Component
 * 
 * 신규 할 일 입력창 폼을 렌더링하고 사용자 입력을 수집합니다.
 * 빈 값 제출 시 인라인 경고 메시지를 토글하여 피드백을 전달합니다.
 */

import store from '../core/store.js';

export default class TodoInput {
  /**
   * @param {string} containerSelector - 마운트될 DOM 컨테이너 셀렉터
   */
  constructor(containerSelector) {
    this.$container = document.querySelector(containerSelector);
    if (!this.$container) return;

    this.render();
    this.bindEvents();
  }

  /**
   * 컴포넌트의 HTML 뼈대를 마운트
   */
  render() {
    this.$container.innerHTML = `
      <form id="todo-form" class="todo-form">
        <div class="todo-input-wrapper">
          <input 
            type="text" 
            id="todo-input" 
            class="todo-input-field" 
            placeholder="새로운 할 일을 입력하세요..." 
            autocomplete="off"
            maxlength="100"
          >
          <button type="submit" class="todo-add-btn">추가</button>
        </div>
        <div id="todo-error" class="todo-error-msg" aria-live="polite">
          할 일을 입력해 주세요! (공백 입력 불가)
        </div>
      </form>
    `;
  }

  /**
   * 사용자 폼 이벤트 리스너 바인딩
   */
  bindEvents() {
    const $form = this.$container.querySelector('#todo-form');
    const $input = this.$container.querySelector('#todo-input');
    const $error = this.$container.querySelector('#todo-error');

    if (!$form || !$input || !$error) return;

    // 할 일 등록 제출 이벤트
    $form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = $input.value.trim();

      // 빈 값(또는 공백만 있는 값) 제출 방어 및 인라인 에러 활성화
      if (!value) {
        $error.classList.add('visible');
        $input.focus();
        return;
      }

      // 정상 처리 시 에러 숨김, 데이터 추가 및 인풋 클리어
      $error.classList.remove('visible');
      store.addTodo(value);
      $input.value = '';
      $input.focus();
    });

    // 사용자가 다시 입력을 시작하면 경고 메시지 실시간 비활성화
    $input.addEventListener('input', () => {
      if ($input.value.trim()) {
        $error.classList.remove('visible');
      }
    });
  }
}
