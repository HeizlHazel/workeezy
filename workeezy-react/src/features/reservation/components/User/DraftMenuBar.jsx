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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetchDraftList(token).then((res) => {
      setDraftList(res.data || []);
    });
  }, [isOpen]);

  /* ===========
    임시 저장
    ==============*/
  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("로그인이 필요합니다.");

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

    const res = await saveDraft(payload, token);
    Swal.close();

    // 스냅샷 + latest id
    onSnapshotSaved(payload);
    onSaved?.(res.data.id);

    const listRes = await fetchDraftList(token);
    setDraftList(listRes.data || []);
    Swal.fire({
      icon: "success",
      title: "임시저장 완료!",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  /* 불러오기 */
  const handleLoad = async (key) => {
    const token = localStorage.getItem("accessToken");
    // 확인
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
      const res = await fetchDraft(key, token);
      const normalized = normalizeDraftToForm(res.data);

      Swal.close();

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
    const token = localStorage.getItem("accessToken");
    const result = await Swal.fire({
      icon: "warning",
      title: "임시저장을 삭제할까요?",
      text: "삭제한 임시저장은 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    await deleteDraft(key, token);
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
          year: "numeric", // 2025
          month: "2-digit", // 01~02
          day: "2-digit", // 01~31
          hour: "2-digit", // 00~23
          minute: "2-digit", // 00~59
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
