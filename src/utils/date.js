// 날짜 계산을 담당하는 순수 유틸 함수 모음입니다.
// 컴포넌트나 service에서 날짜 문자열을 직접 계산하지 않도록 이 파일에 모아둡니다.

// YYYY-MM-DD 문자열을 Date 객체로 변환합니다.
// new Date('2026-06-09')처럼 문자열을 바로 넣으면 타임존에 따라 날짜가 밀릴 수 있으므로,
// 연/월/일을 직접 분리해 로컬 시간 기준 Date 객체를 만듭니다.
export function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day)
}

// Date 객체를 앱에서 사용할 날짜 key 형식인 YYYY-MM-DD 문자열로 변환합니다.
// todosByDate 객체의 key로 사용하기 때문에 항상 같은 형식을 유지해야 합니다.
export function formatToDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


// 브라우저의 현재 로컬 날짜를 YYYY-MM-DD 문자열로 반환합니다.
// 앱이 처음 열렸을 때 selectedDate의 기본값으로 사용합니다.
export function getTodayDateKey() {
    return formatToDateKey(new Date());
}


// 기준 날짜에서 offsetDays만큼 이동한 날짜를 YYYY-MM-DD 문자열로 반환합니다.
// -1은 이전 날짜, 1은 다음 날짜, 7은 다음 주 이동처럼 사용할 수 있습니다.
export function addDays(dateString, offsetDays) {
    const date = parseLocalDate(dateString);
    date.setDate(date.getDate() + offsetDays);

    return formatToDateKey(date);
}


// YYYY-MM-DD 날짜를 화면에 보여줄 한국어 문장으로 변환합니다.
// 예: 2026-06-09 -> 2026년 6월 9일 (화요일)
export function formatDateToKorean(dateString) {
    const date = parseLocalDate(dateString);
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 특정 날짜가 포함된 주의 시작일을 구해 YYYY-MM-DD 문자열로 반환합니다.
// 이 앱의 주간 뷰는 월요일부터 일요일까지를 한 주로 봅니다.
export function getWeekStartDate(dateString) {
    const date = parseLocalDate(dateString);
    const day = date.getDay();

    // 일요일이 0을 반환.
    // 월요일 시작을 위해서 일요일이면 6일 전, 그 외에는 월요일까지의 차이를 계산.
    const mondayOffset = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + mondayOffset);

    return formatToDateKey(date);
}

// 월요일 날짜를 기준으로 월~일 7일 날짜 배열을 생성합니다.
// WeeklyView에서 날짜 카드 7개를 렌더링할 때 사용합니다.
export function getWeekDates(weekStartDate) {
    return Array.from({ length: 7}, (_, index) => addDays(weekStartDate, index));
}
