/**
 * FilterTabs Component
 * 
 * 할 일의 상태 조건(전체, 진행 중, 완료) 필터링 탭 메뉴를 렌더링하고 관리합니다.
 * 현재 선택된 활성 필터 탭에 하이라이트 디자인 효과를 자동 적용합니다.
 */

import store from '../core/store.js';

export default class FilterTabs {
  /**
   * @param {string} containerSelector - 마운트될 DOM 컨테이너 셀렉터
   */
  constructor(containerSelector) {
    this.$container = document.querySelector(containerSelector);
    if (!this.$container) return;

    // 1. 스토어 구독: 필터 상태 전이 시 탭 하이라이트 상태 재정렬을 위해 연동
    store.subscribe(() => this.render());

    // 2. 초기 렌더링
    this.render();

    // 3. 필터 전환 이벤트 바인딩
    this.bindEvents();
  }

  /**
   * 스토어 상태 필터 값을 기준으로 탭 스타일 분기 렌더링
   */
  render() {
    const { activeFilter } = store.state;

    this.$container.innerHTML = `
      <div class="filter-tabs-container">
        <button 
          class="filter-tab-btn ${activeFilter === 'all' ? 'active' : ''}" 
          data-filter="all"
          aria-pressed="${activeFilter === 'all'}"
        >
          전체
        </button>
        <button 
          class="filter-tab-btn ${activeFilter === 'active' ? 'active' : ''}" 
          data-filter="active"
          aria-pressed="${activeFilter === 'active'}"
        >
          진행 중
        </button>
        <button 
          class="filter-tab-btn ${activeFilter === 'completed' ? 'active' : ''}" 
          data-filter="completed"
          aria-pressed="${activeFilter === 'completed'}"
        >
          완료
        </button>
      </div>
    `;
  }

  /**
   * 탭 전환을 조율할 위임형 클릭 이벤트 바인딩
   */
  bindEvents() {
    this.$container.addEventListener('click', (e) => {
      const $btn = e.target.closest('.filter-tab-btn');
      if (!$btn) return;

      const filter = $btn.dataset.filter;
      store.setFilter(filter);
    });
  }
}
