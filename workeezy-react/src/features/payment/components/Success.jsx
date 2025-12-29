import "./Result.css";
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

export function Success({orderId, amount, paymentKey}) {
    const navigate = useNavigate();

    const calledRef = useRef(false);

    useEffect(() => {
        // StrictMode / 재마운트 방지
        if (calledRef.current) return;
        calledRef.current = true;

        // 개발 환경에서는 confirm 생략
        if (import.meta.env.DEV) {
            console.log("DEV MODE - confirm 생략");
            return;
        }

        const requestData = {
            orderId,
            amount,
            paymentKey,
        };

        async function confirm() {
            try {
                const response = await fetch("/api/payments/confirm", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    navigate("/payment/fail?code=CONFIRM_FAILED");
                    return;
                }

                await response.json();

                navigate("/reservation/list", {replace: true});
            } catch {
                navigate("/payment/fail?code=NETWORK_ERROR&message=네트워크 오류");
            }
        }

        confirm();
    }, [navigate, orderId, amount, paymentKey]);

    return (
        <div className="result-wrapper">
            <div className="result-box success">
                <h2 className="result-title">결제가 완료되었어요</h2>

                <div className="result-info">
                    <p><strong>주문번호</strong></p>
                    <p>{orderId}</p>

                    <p style={{marginTop: 12}}><strong>결제 금액</strong></p>
                    <p>{amount.toLocaleString()}원</p>
                </div>

                <button className="btn primary" onClick={() => navigate("/reservation/list")}>
                    예약 현황 조회
                </button>

                <button className="btn secondary" onClick={() => navigate("/")}>
                    홈으로 이동
                </button>
            </div>
        </div>
    );
}