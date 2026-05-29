/**
 * date.js - 날짜 처리 및 연산 유틸리티
 * 
 * 브라우저 시차 격차를 배제하고, YYYY-MM-DD 날짜 문자열에 대한 가산, 감산, 한국어 변환 및
 * 특정 날짜가 속한 주간(7일) 목록 연산을 수행하는 순수 헬퍼 함수군입니다.
 */

/**
 * YYYY-MM-DD 문자열을 파싱하여 로컬 타임존 시차가 어긋나지 않는 Date 객체를 생성합니다.
 * @param {string} dateString - YYYY-MM-DD 형식 날짜 문자열
 * @returns {Date} 생성된 Date 객체
 */
export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Date 객체를 YYYY-MM-DD 포맷 문자열로 변환합니다.
 * @param {Date} dateObj - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식 문자열
 */
export function formatToDateKey(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 날짜를 한국어 가독성 포맷으로 변경합니다.
 * 예시: "2026-05-29" -> "2026년 5월 29일 금요일"
 * @param {string} dateString - YYYY-MM-DD 형식 날짜 문자열
 * @returns {string} 한국어 표시용 날짜 문자열
 */
export function formatDateToKorean(dateString) {
  const date = parseLocalDate(dateString);
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayName = weekdays[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${weekdayName}`;
}

/**
 * 특정 YYYY-MM-DD 날짜에 오프셋(일수)을 가감합니다.
 * @param {string} dateString - YYYY-MM-DD 형식 날짜 문자열
 * @param {number} offsetDays - 가산/감산할 일 수 (음수 지원)
 * @returns {string} 연산 완료된 YYYY-MM-DD 날짜 문자열
 */
export function addDays(dateString, offsetDays) {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + offsetDays);
  return formatToDateKey(date);
}

/**
 * 기준 날짜가 포함된 주(Week)의 월요일부터 일요일까지 7일간의 날짜 문자열 리스트를 연산합니다.
 * 월요일이 주의 첫 날이 되도록 보장합니다.
 * @param {string} dateString - 기준 YYYY-MM-DD 날짜 문자열
 * @returns {Array<string>} YYYY-MM-DD 형식의 7일간 날짜 문자열 배열
 */
export function getWeekDates(dateString) {
  const targetDate = parseLocalDate(dateString);
  const currentDay = targetDate.getDay(); // 0: 일요일, 1: 월요일, ... 6: 토요일
  
  // 일요일(0)을 7로 치환하여 월요일(1) 기준 오프셋 산출을 간소화
  const dayOffset = currentDay === 0 ? 6 : currentDay - 1;
  
  // 해당 주의 월요일 구하기
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - dayOffset);
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const tempDate = new Date(monday);
    tempDate.setDate(monday.getDate() + i);
    weekDates.push(formatToDateKey(tempDate));
  }
  
  return weekDates;
}
