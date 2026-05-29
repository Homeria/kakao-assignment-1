/**
 * WeeklyView Component
 * 
 * 이번 주(월요일~일요일) 7일간의 날짜 목록을 가로형 패널 카드로 표시합니다.
 * 요일 클릭 시 일간 뷰와 상호 연동되어 해당 날짜로 이동하고,
 * 각 요일 카드에 해당 일자의 진행 중(미완료) Todo 개수를 실시간 배지 형태로 집계하여 출력합니다.
 */

import store from '../core/store.js';
import { getWeekDates, parseLocalDate } from '../utils/date.js';

export default class WeeklyView {
  /**
   * @param {string} containerSelector - 마운트될 DOM 컨테이너 셀렉터
   */
  constructor(containerSelector) {
    this.$container = document.querySelector(containerSelector);
    if (!this.$container) return;

    // 1. 스토어 구독: 날짜 이동 및 Todo 생성/삭제/완료 상태에 반응해 주간 배지와 카드를 갱신
    store.subscribe(() => this.render());

    // 2. 초기 렌더링
    this.render();

    // 3. 요일 카드 클릭 탐색 이벤트 바인딩
    this.bindEvents();
  }

  /**
   * 스토어 상태 기반으로 주간 달력 렌더링
   */
  render() {
    const { selectedDate } = store.state;
    
    // 현재 선택된 날짜가 속한 월~일 7일 날짜 배열 획득
    const weekDates = getWeekDates(selectedDate);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const cardsHTML = weekDates.map(dateKey => {
      const dateObj = parseLocalDate(dateKey);
      const dayName = weekdays[dateObj.getDay()];
      const dayNumber = dateObj.getDate();
      
      const isActive = dateKey === selectedDate;
      const countInfo = store.getTodoCountInfo(dateKey);
      const activeTodoCount = countInfo.active; // 미완료 투두 개수 배지 타깃

      return `
        <div 
          class="weekly-day-card ${isActive ? 'active' : ''}" 
          data-date="${dateKey}"
          role="button"
          aria-label="${dateKey} 일정 보기"
          aria-current="${isActive ? 'true' : 'false'}"
        >
          <span class="weekly-day-name">${dayName}</span>
          <span class="weekly-day-number">${dayNumber}</span>
          <span class="weekly-day-badge ${activeTodoCount > 0 ? 'has-todos' : 'zero'}">
            ${activeTodoCount}
          </span>
        </div>
      `;
    }).join('');

    this.$container.innerHTML = `
      <div class="weekly-grid">
        ${cardsHTML}
      </div>
    `;
  }

  /**
   * 주간 캘린더 요일 카드 클릭 이벤트 바인딩 (이벤트 위임 활용)
   */
  bindEvents() {
    this.$container.addEventListener('click', (e) => {
      const $card = e.target.closest('.weekly-day-card');
      if (!$card) return;

      const newDate = $card.dataset.date;
      store.setSelectedDate(newDate);
    });
  }
}
