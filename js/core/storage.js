/**
 * storage.js - LocalStorage 데이터 관리 유틸리티
 * 
 * 브라우저 로컬 저장소와의 안전한 데이터 직렬화(JSON) 및 예외 처리(try-catch)를 전담합니다.
 */

const STORAGE_KEY = 'taskflow_todos_data';

export const storage = {
  /**
   * 데이터를 JSON 문자열로 변환하여 로컬 스토리지에 안전하게 저장합니다.
   * @param {Object} data - 저장할 데이터 객체
   */
  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage 저장 실패:', e);
    }
  },

  /**
   * 로컬 스토리지로부터 데이터를 안전하게 파싱하여 로드합니다.
   * @returns {Object} 복구된 데이터 객체 (오류 또는 데이터 부재 시 빈 객체 반환)
   */
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('LocalStorage 로드 실패:', e);
      return {};
    }
  }
};
export default storage;
