// Date → LocalDateTime 문자열 (KST 고정, UTC 변환 ❌)
export const toLocalDateTimeString = (date) => {
  if (!date) return null;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":00"
  );
};

// LocalDateTime 문자열 → 화면 표시용
export const formatLocalDateTime = (value) => {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
};
