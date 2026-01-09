import axios from "../../../api/axios";

// 목록
export const fetchDraftList = () => axios.get("/api/reservations/draft/me");

// 단건
export const fetchDraft = (draftKey) =>
  axios.get(`/api/reservations/draft/${draftKey}`);

// 저장
export const saveDraft = (draftData) =>
  axios.post("/api/reservations/draft/me", draftData);

// 삭제
export const deleteDraft = (draftKey) =>
  axios.delete(`/api/reservations/draft/${encodeURIComponent(draftKey)}`);
