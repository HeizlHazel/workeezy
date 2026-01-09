import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";

// ✅ 경로 확인해서 맞춰!
import ReservationCard from "../../features/reservation/components/User/ReservationCard.jsx";
import ReviewPage from "../../features/review/pages/ReviewPage.jsx";

vi.mock("../../api/axios.js", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));
import api from "../../api/axios.js";

function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location">{location.pathname}</div>;
}

describe("예약 카드의 리뷰 작성 흐름", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, "alert").mockImplementation(() => {});
    });

    it("리뷰 작성 → 해당 programId로 등록 → /reviews 이동 → 리뷰 목록 로드", async () => {
        const user = userEvent.setup();

        const reservation = {
            id: 999,
            status: "confirmed",
            startDate: "2000-01-01T09:00:00",
            endDate: "2000-01-02T11:00:00",

            programId: 123,
            programTitle: "테스트 예약 프로그램",
            stayName: "테스트 숙소",
            roomType: "standard",
            reservationNo: "R-0001",
            officeName: "테스트 오피스",
            totalPrice: 100000,
            peopleCount: 2,
            placePhoto1: "/a.jpg",
            placePhoto2: null,
            placePhoto3: null,
        };

        api.post.mockResolvedValueOnce({ data: { ok: true } });

        api.get.mockResolvedValueOnce({
            data: [
                {
                    reviewId: 1,
                    programId: 123,
                    programName: "테스트 예약 프로그램",
                    rating: 5,
                    reviewText: "예약에서 쓴 리뷰!",
                    region: "서울",
                    image: null,
                },
            ],
        });

        render(
            <MemoryRouter initialEntries={["/reservations"]}>
                <LocationDisplay />
                <Routes>
                    <Route
                        path="/reservations"
                        element={<ReservationCard data={reservation} isSelected onSelect={() => {}} />}
                    />
                    <Route path="/reviews" element={<ReviewPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId("location")).toHaveTextContent("/reservations");

        // 1) 리뷰작성 버튼 클릭
        await user.click(await screen.findByRole("button", { name: "리뷰작성" }));

        // ✅ 2) 모달 textarea가 렌더될 때까지 기다렸다가 입력
        const textarea = await screen.findByPlaceholderText("리뷰를 입력해주세요");
        await user.type(textarea, "예약에서 쓴 리뷰!");

        // ✅ 3) 별점 5점 (렌더된 후 DOM에서 찾기)
        const stars = document.querySelectorAll(".rating-row .star");
        expect(stars.length).toBeGreaterThanOrEqual(5);
        await user.click(stars[4]);

        // 4) 등록
        await user.click(screen.getByRole("button", { name: "리뷰 등록하기" }));

        // 5) POST 검증
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/reviews", {
                programId: 123,
                rating: 5,
                reviewText: "예약에서 쓴 리뷰!",
            });
        });

        // 6) /reviews 이동 확인
        await waitFor(() => {
            expect(screen.getByTestId("location")).toHaveTextContent("/reviews");
        });

        // 7) GET 호출 확인 (ReviewPage가 get("/api/reviews")라면 이걸로)
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/reviews");
        });

        // 8) 화면 표시 확인
        expect(await screen.findByText("예약에서 쓴 리뷰!")).toBeInTheDocument();
    });
});
