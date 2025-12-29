import { useEffect, useRef, useState } from "react";
import "./DraftMenuBar.css";
import DraftMenuCard from "./DraftMenuCard";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  fetchDraftList,
  fetchDraft,
  saveDraft,
  deleteDraft,
} from "../../api/draft.api";
// import { normalizeDarft } from "../../utils/draftNormalize.js";

import { isSameDraft } from "../../utils/draftCompare.js";
import { normalizeDraftToForm } from "../../utils/draftNormalize";

export default function DraftMenuBar({
  isOpen,
  onClose,
  latestDraftId,
  form,
  onSaved,
  onSnapshotSaved,
  lastSavedSnapshot,
}) {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [draftList, setDraftList] = useState([]);
  const [openKey, setOpenKey] = useState(null);

  /* ===========
    바깥 클릭 닫기
    ==============*/
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  /* ==========
    목록 불러오기
    =============*/
  useEffect(() => {
    if (!isOpen) return;

    fetchDraftList().then((res) => {
      setDraftList(res.data || []);
    });
  }, [isOpen]);

  /* ===========
      임시 저장
      ==============*/
  const handleSave = async () => {
    const payload = {
      ...form,
      startDate: form.startDate?.toISOString(),
      endDate: form.endDate?.toISOString(),
    };

    if (isSameDraft(lastSavedSnapshot, payload)) {
      await Swal.fire({
        icon: "info",
        title: "변경된 내용이 없습니다.",
        text: "저장할 새로운 변경사항이 없습니다.",
      });
      return;
    }

    Swal.fire({
      title: "임시저장 중...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const res = await saveDraft(payload);

      Swal.close();

      onSnapshotSaved(payload);
      onSaved?.(res.data.id);

      const listRes = await fetchDraftList();
      setDraftList(listRes.data || []);

      Swal.fire({
        icon: "success",
        title: "임시저장 완료!",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.close();

      if (e.response?.status === 400) {
        Swal.fire({
          icon: "warning",
          title: "임시저장 제한",
          html: e.response.data,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "임시저장 실패",
          text: "임시저장 중 오류가 발생했습니다.",
        });
      }
    }
  };

  /* 불러오기 */
  const handleLoad = async (key) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "임시저장을 불러올까요?",
      text: "현재 작성 중인 내용은 사라집니다.",
      showCancelButton: true,
      confirmButtonText: "불러오기",
      cancelButtonText: "취소",
    });
    if (!confirm.isConfirmed) return;

    // 로딩 (await ❌)
    Swal.fire({
      title: "임시저장 불러오는 중...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetchDraft(key);
      const normalized = normalizeDraftToForm(res.data);

      // 이동
      navigate("/reservation/new", {
        state: { ...normalized, draftKey: key },
      });
    } catch (e) {
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "불러오기 실패",
        text: "임시저장을 불러오는 중 오류가 발생했습니다.",
      });
    }
  };

  /* 삭제 */
  const handleDelete = async (key) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "임시저장을 삭제할까요?",
      text: "삭제한 임시저장은 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    await deleteDraft(key);
    setDraftList((prev) => prev.filter((d) => d.key !== key));

    Swal.fire({
      icon: "success",
      title: "삭제되었습니다",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const formatDateTime = (value) =>
    value
      ? new Date(value).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  return (
    <div ref={menuRef} className={`draft-menu-bar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>✕</button>
      <button onClick={handleSave}>현재 내용 임시저장</button>

      {draftList.map((draft) => (
        <DraftMenuCard
          key={draft.key}
          draft={draft}
          isOpen={openKey === draft.key}
          isNew={draft.key === latestDraftId}
          onToggle={() => setOpenKey(openKey === draft.key ? null : draft.key)}
          onLoad={() => handleLoad(draft.key)}
          onDelete={() => handleDelete(draft.key)}
          formatDateTime={formatDateTime}
        />
      ))}
    </div>
  );
}
