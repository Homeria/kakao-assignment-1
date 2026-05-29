/**
 * app.js
 * TaskFlow Entry Point
 * 
 * ES Modules entry script to bootstrap the Todo application.
 * Imports the centralized state Store and registers global setups.
 */

import store from './js/core/store.js';

document.addEventListener('DOMContentLoaded', () => {
  // 디버깅 및 브라우저 콘솔 테스트 편의를 위해 전역 window 객체에 store 바인딩
  window.store = store;

  // Store가 성공적으로 부트스트랩되었는지 모니터링 로그 출력
  console.log('TaskFlow: Global state store loaded successfully.');
  console.log('Current Store State:', store.state);
  console.log('You can test store actions directly in F12 Console via "window.store"');
});
