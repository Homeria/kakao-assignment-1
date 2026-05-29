/**
 * app.js
 * TaskFlow Entry Point
 * 
 * ES Modules entry script to bootstrap the Todo application.
 * Imports the centralized state Store and initializes active components.
 */

import store from './js/core/store.js';
import TodoInput from './js/components/TodoInput.js';
import TodoList from './js/components/TodoList.js';

document.addEventListener('DOMContentLoaded', () => {
  // 디버깅 및 브라우저 콘솔 테스트 편의를 위해 전역 window 객체에 store 바인딩
  window.store = store;

  // [3단계] 컴포넌트 인스턴스화 및 마운트 처리
  new TodoInput('#todo-input-container');
  new TodoList('#todo-list-container');

  console.log('TaskFlow: Bootstrapped successfully with TodoInput and TodoList components.');
});
