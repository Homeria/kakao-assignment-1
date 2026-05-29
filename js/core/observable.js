/**
 * Observable - Pub/Sub 패턴의 관찰자 부모 클래스
 * 
 * 상태를 감시하고 변화가 발생했을 때 구독자들에게 통지하는 기본 이벤트 버스 역할을 수행합니다.
 * 이를 상속받은 클래스는 자유롭게 이벤트를 발행할 수 있습니다.
 */
export default class Observable {
  constructor() {
    // 상태 구독자 콜백 함수 리스트
    this.subscribers = [];
  }

  /**
   * 상태 변화 이벤트를 감시하기 위해 콜백 함수를 등록합니다.
   * @param {Function} callback - 상태 변경 시 실행될 함수
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.subscribers.push(callback);
    }
  }

  /**
   * 등록된 모든 구독자 콜백을 실행하여 변경된 상태를 전파합니다.
   * @param {Object} state - 전파할 최신 상태 객체
   */
  publish(state) {
    this.subscribers.forEach(callback => callback(state));
  }
}
