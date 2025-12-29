import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DraftReservationList.css";
import Pagination from "../../../../shared/common/Pagination";
import { fetchDraftList, deleteDraft } from "../../api/draft.api.js";
import {
  normalizeDraft,
  normalizeDraftToForm,
} from "../../utils/draftNormalize";
import Swal from "sweetalert2";

export default function DraftReservationList() {
  const [drafts, setDrafts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, [page]);

  const fetchDrafts = async () => {
    const res = await fetchDraftList();

    const normalized = res.data.map((draft) => {
      const normalizedDraft = normalizeDraft(draft);
      return {
        ...normalizedDraft,
        data: normalizeDraftToForm(normalizedDraft.data),
      };
    });

    setDrafts(normalized);
  };

  const handleDelete = async (e, key) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "임시저장 삭제",
      text: "이 임시저장을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    await deleteDraft(key);
    await fetchDrafts();

    Swal.fire("삭제 완료", "임시저장이 삭제되었습니다.", "success");
  };

  const goToProgramDetail = (e, programId) => {
    e.stopPropagation();
    navigate(`/programs/${programId}`);
  };

  const goToWrite = (e, draftKey) => {
    e.stopPropagation();
    navigate("/reservation/new", {
      state: { draftKey },
    });
  };

  return (
    <div className="draft-reservation-list">
      <h2 className="list-title">임시 저장 목록</h2>

      <table className="draft-reservation-table">
        <thead>
          <tr>
            <th>프로그램</th>
            <th>숙소</th>
            <th>기간</th>
            <th>인원</th>
            <th>저장일</th>
            <th>작업</th>
          </tr>
        </thead>

        <tbody>
          {drafts.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>
                임시 저장된 예약이 없습니다.
              </td>
            </tr>
          )}

          {drafts.map((draft) => {
            const data = draft.data;

            return (
              <tr key={draft.key}>
                {/* 프로그램명 클릭 → 상세 페이지 */}
                <td
                  className="clickable-text"
                  onClick={(e) => goToProgramDetail(e, data.programId)}
                >
                  {data.programTitle || "-"}
                </td>

                <td>{data.stayName || "-"}</td>

                <td>
                  {data.startDate?.toLocaleDateString()} ~{" "}
                  {data.endDate?.toLocaleDateString()}
                </td>

                <td>{data.peopleCount ? `${data.peopleCount}명` : "-"}</td>

                <td>
                  {data.savedAt?.toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="action-cell">
                  <button
                    className="btn-detail"
                    onClick={(e) => goToWrite(e, draft.key)}
                  >
                    작성
                  </button>

                  <button
                    className="btn-delete"
                    onClick={(e) => handleDelete(e, draft.key)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
