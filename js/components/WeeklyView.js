/**
 * WeeklyView Component
 * 
 * 이번 주(월요일~일요일) 7일간의 날짜 목록을 가로형 패널 카드로 표시합니다.
 * 요일 클릭 시 일간 뷰와 상호 연동되어 해당 날짜로 이동하고,
 * 각 요일 카드에 해당 일자의 진행 중(미완료) Todo 개수를 실시간 배지 형태로 집계하여 출력합니다.
 * 실제 현실의 오늘 날짜(Today)를 영구 테두리 하이라이트하여 UX 사용성을 고도화했습니다.
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

    // 1. 스토어 구독: 날짜 이동 및 Todo 데이터 변환에 실시간 리렌더링
    store.subscribe(() => this.render());

    // 2. 초기 렌더링
    this.render();

    // 3. 요일 카드 클릭 탐색 이벤트 바인딩
    this.bindEvents();
  }

  /**
   * 스토어 상태 기반으로 주간 달력 및 실시간 개수 렌더링
   */
  render() {
    const { selectedDate } = store.state;
    
    // 현재 기기 기준의 실제 현실 오늘 날짜 획득 (YYYY-MM-DD)
    const realTodayDateKey = store.getTodayDateString();
    
    // 현재 선택된 날짜가 속한 월~일 7일 날짜 배열 획득
    const weekDates = getWeekDates(selectedDate);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const cardsHTML = weekDates.map(dateKey => {
      const dateObj = parseLocalDate(dateKey);
      const dayName = weekdays[dateObj.getDay()];
      const dayNumber = dateObj.getDate();
      
      const isActive = dateKey === selectedDate;         // 사용자가 현재 화면에서 선택하여 보고 있는 날짜인가
      const isToday = dateKey === realTodayDateKey;       // 현실 시간상 실제 오늘 날짜인가
      
      const countInfo = store.getTodoCountInfo(dateKey);
      const activeTodoCount = countInfo.active;          // 미완료 투두 개수

      return `
        <div 
          class="weekly-day-card ${isActive ? 'active' : ''} ${isToday ? 'is-today' : ''}" 
          data-date="${dateKey}"
          role="button"
          aria-label="${dateKey} 일정 보기 ${isToday ? '(오늘)' : ''}"
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
