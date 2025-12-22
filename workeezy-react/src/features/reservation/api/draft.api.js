import axios from "../../../api/axios";

export const fetchDraftList = (token) =>
  axios.get("/api/reservations/draft/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchDraft = (draftKey, token) =>
  axios.get(`/api/reservations/draft/${draftKey}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveDraft = (draftData, token) =>
  axios.post("/api/reservations/draft/me", draftData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteDraft = (draftKey, token) =>
  axios.delete(`/api/reservations/draft/${encodeURIComponent(draftKey)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
