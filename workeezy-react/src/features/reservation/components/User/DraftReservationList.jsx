import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/Admin/AdminReservationList.css"; // 기존 관리자 CSS 재사용
import Pagination from "../../../../shared/common/Pagination";
import { fetchDraftList } from "../../api/draft.api.js";
import { normalizeDraft } from "../../utils/draftNormalize.js";

export default function DraftReservationList() {
  const [drafts, setDrafts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchDrafts = async () => {
    try {
      const res = await fetchDraftList({
        page: page - 1,
      });

      console.log("📦 전체 응답 res:", res);
      console.log("📦 res.data:", res.data);

      // 서버 응답 구조 예시:
      // { content: [...], totalPages: 3 }
      setDrafts(res.data.map(normalizeDraft));
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("임시저장 목록 조회 실패", e);
    }
  };

  return (
    <div className="admin-reservation-list">
      <h2 className="list-title">임시 저장 목록</h2>

      <table className="reservation-table">
        <thead>
          <tr>
            <th>프로그램</th>
            <th>숙소</th>
            <th>기간</th>
            <th>인원</th>
            <th>저장일</th>
          </tr>
        </thead>

        <tbody>
          {drafts.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "30px" }}>
                임시 저장된 예약이 없습니다.
              </td>
            </tr>
          )}

          {drafts.map((draft) => {
            const data = draft.data;

            return (
              <tr
                key={draft.key}
                className="clickable-row"
                onClick={() =>
                  navigate("/reservation/new", {
                    state: { draftKey: draft.key },
                  })
                }
              >
                <td>{data.programTitle || "-"}</td>
                <td>{data.stayName || "-"}</td>
                <td>
                  {data.startDate?.slice(0, 10)} ~ {data.endDate?.slice(0, 10)}
                </td>
                <td>{data.peopleCount ? `${data.peopleCount}명` : "-"}</td>
                <td>
                  {data.savedAt
                    ? new Date(data.savedAt).toLocaleDateString()
                    : "-"}
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
