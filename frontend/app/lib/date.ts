const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

// Date를 로컬 타임존 기준 YYYY-MM-DD 문자열로 변환합니다.
// toISOString()은 UTC 기준이라 한국 시간 자정 근처에서 날짜가 밀릴 수 있어 직접 조립합니다.
export function toDateKey(date: Date) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

export function getTodayDateKey() {
  return toDateKey(new Date());
}

// YYYY-MM-DD 문자열을 로컬 타임존의 Date로 파싱합니다.
// new Date("2026-06-22")는 브라우저/런타임에서 UTC 해석이 섞일 수 있어 명시적으로 생성합니다.
export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function isDateKey(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = parseDateKey(value);

  return parsedDate !== null && toDateKey(parsedDate) === value;
}

export function addDays(dateKey: string, offsetDays: number) {
  const parsedDate = parseDateKey(dateKey) ?? new Date();

  parsedDate.setDate(parsedDate.getDate() + offsetDays);

  return toDateKey(parsedDate);
}

export function getWeekStartDate(dateKey: string) {
  const parsedDate = parseDateKey(dateKey) ?? new Date();
  const day = parsedDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  parsedDate.setDate(parsedDate.getDate() + mondayOffset);

  return toDateKey(parsedDate);
}

export function getWeekDates(weekStartDate: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDate, index));
}

export function formatKoreanDate(dateKey: string) {
  const parsedDate = parseDateKey(dateKey);

  if (!parsedDate) {
    return dateKey;
  }

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1;
  const date = parsedDate.getDate();
  const dayLabel = DAY_LABELS[parsedDate.getDay()];

  return `${year}년 ${month}월 ${date}일 (${dayLabel})`;
}

export function formatShortDate(dateKey: string) {
  const parsedDate = parseDateKey(dateKey);

  if (!parsedDate) {
    return {
      dayLabel: "",
      dateLabel: dateKey,
    };
  }

  return {
    dayLabel: DAY_LABELS[parsedDate.getDay()],
    dateLabel: String(parsedDate.getDate()),
  };
}

