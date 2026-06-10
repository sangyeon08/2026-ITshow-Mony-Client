const JOIN_DATE = new Date("2025-12-22T00:00:00");
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function getToday() {
  return new Date();
}

export function getMonthLabel(date = getToday()) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function getShortMonthLabel(date = getToday()) {
  return `${date.getMonth() + 1}월`;
}

export function getTodayLabel(date = getToday()) {
  return `오늘 · ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEK_DAYS[date.getDay()]})`;
}

export function getKoreanDateLabel(date = getToday()) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function getDotDateLabel(date = getToday()) {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

export function getCompactDotDateLabel(date = getToday()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

export function getDaysWithMony(date = getToday()) {
  return Math.max(1, Math.floor((date - JOIN_DATE) / MS_PER_DAY) + 1);
}

export function getDaysLeftInMonth(date = getToday()) {
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return Math.max(0, lastDate.getDate() - date.getDate());
}

export function getWeekDateNumbers(date = getToday()) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return String(day.getDate());
  });
}

export function getWeekRangeLabel(date = getToday()) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (target) =>
    `${target.getMonth() + 1}/${target.getDate()}(${WEEK_DAYS[target.getDay()]})`;

  return `${format(start)} - ${format(end)}`;
}
