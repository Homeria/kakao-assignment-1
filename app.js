/**
 * app.js
 * TaskFlow Entry Point (애플리케이션 진입 파일)
 * 
 * 브라우저 자체적으로 지원하는 ES Modules(ECMAScript Modules) 스펙을 활용하여,
 * 별도의 빌드 도구(Webpack, Vite 등)나 의존성 라이브러리 없이
 * 순수 바닐라 자바스크립트로 동작하는 컴포넌트 기반 애플리케이션을 구동합니다.
 * 
 * 본 모듈은 중앙 집중식 상태 관리자(Store)를 인스턴스화하고
 * 화면을 구성하는 각 컴포넌트(주간 뷰, 일간 날짜 바, 입력창, 필터 탭, 목록)를 마운트하여 기동합니다.
 */

import store from './js/core/store.js';
import WeeklyView from './js/components/WeeklyView.js';
import DateHeader from './js/components/DateHeader.js';
import TodoInput from './js/components/TodoInput.js';
import FilterTabs from './js/components/FilterTabs.js';
import TodoList from './js/components/TodoList.js';

// DOM 트리 분석이 끝나고 화면 구성 요소들이 완성된 시점에 진입
document.addEventListener('DOMContentLoaded', () => {
  
  /**
   * [1] 디버깅 및 브라우저 콘솔 테스트 편의성 제고
   * - 브라우저 F12 개발자 도구의 Console 탭에서 직접 "window.store" 객체에 접근할 수 있게 설정합니다.
   * - 예시: 콘솔에 `window.store.addTodo("테스트 할 일")`를 입력하여 상태 변경을 즉시 검사할 수 있습니다.
   */
  window.store = store;

  /**
   * [2] 각 영역별 UI 컴포넌트 독립 인스턴스화 및 컨테이너 바인딩
   * - index.html에 미리 정의된 고유 셀렉터(Selector) 영역에 맞추어 컴포넌트를 마운트합니다.
   * - 각 컴포넌트는 내부적으로 중앙 Store를 관찰(Subscribe)하도록 자동 연결됩니다.
   */
  new WeeklyView('#weekly-view-container');   // 주간 7일 캘린더 네비게이션 & 통계 배지
  new DateHeader('#date-header-container');   // 일간 상세 날짜 정보 & 이전/다음 날짜 변경
  new TodoInput('#todo-input-container');     // 할 일 신규 등록 입력창 & 빈 값 에러 피드백
  new FilterTabs('#filter-tabs-container');   // 전체/진행중/완료 상태 정렬 필터 컨트롤러
  new TodoList('#todo-list-container');       // 할 일 렌더러 및 CRUD(체크/수정/삭제) 연동 리스트

  // 시스템 초기화 완료 기록
  console.log('TaskFlow: Bootstrapped successfully with all core components.');
  console.log('Centralized Store State:', store.state);
});
