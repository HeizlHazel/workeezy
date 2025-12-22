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
