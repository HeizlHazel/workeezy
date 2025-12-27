export const normalizeDraftToForm = (draft) => ({
  ...draft,
  startDate: draft.startDate ? new Date(draft.startDate) : null,
  endDate: draft.endDate ? new Date(draft.endDate) : null,
  officeName: draft.officeName ?? draft.placeName ?? "",
  roomType: draft.roomType ?? draft.roomName ?? "",
  officeId: draft.officeId ?? draft.placeId ?? "",
  roomId: draft.roomId ?? "",
  stayId: draft.stayId ?? "",
  stayName: draft.stayName ?? draft.hotelName ?? "",
});

// Redis에서 온 raw draft 구조 정리
export const normalizeDraft = (draft) => {
  if (!draft) return null;

  // Redis 직렬화 구조 제거
  const data = Array.isArray(draft.data) ? draft.data[1] : draft.data;

  return {
    ...draft,
    data,
  };
};
