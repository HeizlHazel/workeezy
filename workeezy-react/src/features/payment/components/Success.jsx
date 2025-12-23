import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const requestData = {
            orderId: searchParams.get("orderId"),
            amount: Number(searchParams.get("amount")),
            paymentKey: searchParams.get("paymentKey"),
        };

        async function confirm() {
            const response = await fetch("/api/payments/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                // JSON 파싱 전에 상태 체크
                const text = await response.text();
                console.error("결제 confirm 실패 응답:", text);
                navigate("/payment/result?status=fail");
                return;
            }

            const json = await response.json();
            console.log("결제 성공");
        }

        confirm();
    }, []);

    return (
        <div className="result wrapper">
            <div className="box_section">
                <h2>
                    결제 성공
                </h2>
                <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
                <p>결제 금액:{" "}
                    {Number(searchParams.get("amount")).toLocaleString()}원</p>
            </div>
            <button onClick={() => navigate("/reservation/list")}>예약 현황 조회</button>
            <button onClick={() => navigate("/")}>Home</button>
        </div>

    );
}