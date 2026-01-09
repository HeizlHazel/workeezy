import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewModal from "../../features/review/components/ReviewModal.jsx";

vi.mock("../../api/axios.js", () => ({
    default: {
        post: vi.fn(),
    },
}));
import api from "../../api/axios.js";

describe("ReviewModal - 예약 programId로 리뷰 등록", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, "alert").mockImplementation(() => {});
    });

    it("별점/내용 입력 후 등록하면 해당 programId로 POST되고 onSubmitted가 호출된다", async () => {
        const user = userEvent.setup();
        api.post.mockResolvedValueOnce({ data: { ok: true } });

        const onSubmitted = vi.fn();

        render(
            <ReviewModal
                open={true}
                onClose={() => {}}
                programId={123}          // ✅ “그 예약”의 programId
                onSubmitted={onSubmitted}
            />
        );

        // ⭐ 별점 클릭 (★ 5개 중 마지막)
        const stars = document.querySelectorAll(".rating-row .star");
        expect(stars.length).toBeGreaterThanOrEqual(5);
        await user.click(stars[4]);

        // ✍️ 텍스트 입력
        await user.type(
            screen.getByPlaceholderText("리뷰를 입력해주세요"),
            "예약에서 쓴 리뷰!"
        );

        // ✅ 등록
        await user.click(screen.getByRole("button", { name: "리뷰 등록하기" }));

        // ✅ POST 검증
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/reviews", {
                programId: 123,
                rating: 5,
                reviewText: "예약에서 쓴 리뷰!",
            });
        });

        // ✅ 성공 콜백 확인
        expect(onSubmitted).toHaveBeenCalledTimes(1);
    });
});
