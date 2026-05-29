/**
 * app.js
 * TaskFlow Entry Point
 * 
 * ES Modules entry script to bootstrap the Todo application.
 * Imports the centralized state Store and initializes active components.
 */

import store from './js/core/store.js';
import WeeklyView from './js/components/WeeklyView.js';
import DateHeader from './js/components/DateHeader.js';
import TodoInput from './js/components/TodoInput.js';
import FilterTabs from './js/components/FilterTabs.js';
import TodoList from './js/components/TodoList.js';

document.addEventListener('DOMContentLoaded', () => {
  // 디버깅 및 브라우저 콘솔 테스트 편의를 위해 전역 window 객체에 store 바인딩
  window.store = store;

  // [6단계] 컴포넌트 인스턴스화 및 마운트 처리
  new WeeklyView('#weekly-view-container');
  new DateHeader('#date-header-container');
  new TodoInput('#todo-input-container');
  new FilterTabs('#filter-tabs-container');
  new TodoList('#todo-list-container');

  console.log('TaskFlow: Bootstrapped successfully with all core components including WeeklyView.');
});
