/**
 * DateHeader Component
 * 
 * 오늘 날짜 및 선택된 날짜 정보를 화면 상단에 한국어로 표시하고,
 * 이전 날짜, 다음 날짜로 이동하는 네비게이션 버튼을 제어합니다.
 */

import store from '../core/store.js';
import { formatDateToKorean, addDays } from '../utils/date.js';

export default class DateHeader {
  /**
   * @param {string} containerSelector - 마운트될 DOM 컨테이너 셀렉터
   */
  constructor(containerSelector) {
    this.$container = document.querySelector(containerSelector);
    if (!this.$container) return;

    // 1. 스토어 구독: 날짜 변경 시 텍스트 갱신을 위해 연동
    store.subscribe(() => this.render());

    // 2. 초기 렌더링
    this.render();

    // 3. 네비게이션 버튼 클릭 이벤트 바인딩
    this.bindEvents();
  }

  /**
   * 기준 선택 날짜 정보를 활용해 화면 업데이트
   */
  render() {
    const { selectedDate } = store.state;
    const formattedDate = formatDateToKorean(selectedDate);

    this.$container.innerHTML = `
      <button id="prev-date-btn" class="date-nav-btn" aria-label="이전 날짜로 이동">
        &lt;
      </button>
      <h2 class="current-date-text" id="current-date-text">
        ${formattedDate}
      </h2>
      <button id="next-date-btn" class="date-nav-btn" aria-label="다음 날짜로 이동">
        &gt;
      </button>
    `;
  }

  /**
   * 날짜 이동 컨트롤러 이벤트 바인딩 (이벤트 위임 활용)
   */
  bindEvents() {
    this.$container.addEventListener('click', (e) => {
      const selectedDate = store.state.selectedDate;

      // A. 이전 날짜 버튼 클릭 시
      if (e.target.closest('#prev-date-btn')) {
        const prevDate = addDays(selectedDate, -1);
        store.setSelectedDate(prevDate);
        return;
      }

      // B. 다음 날짜 버튼 클릭 시
      if (e.target.closest('#next-date-btn')) {
        const nextDate = addDays(selectedDate, 1);
        store.setSelectedDate(nextDate);
        return;
      }
    });
  }
}
