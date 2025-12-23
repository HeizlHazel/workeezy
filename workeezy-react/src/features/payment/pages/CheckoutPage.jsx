import TossPaymentWidget from "../components/TossPaymentWidget.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function CheckoutPage() {
    const {reservationId} = useParams();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        fetch(`/api/reservations/${reservationId}`, {
            credentials: "include",
        })
            .then(async (res) => {
                const ct = res.headers.get("content-type") || "";
                if (!res.ok) {
                    const text = await res.text();
                    console.error("예약 조회 실패:", text);
                    throw new Error("예약 조회 실패");
                }
                if (!ct.includes("application/json")) {
                    const text = await res.text();
                    console.error("JSON 아닌 응답:", text);
                    throw new Error("예약조회 API가 JSON을 반환하지 않음");
                }
                return res.json();
            })
            .then(setReservation)
            .catch(console.error);
    }, [reservationId]);

    if (!reservation) return null;

    return (
        <div style={{maxWidth: 480, margin: "100px auto"}}>
            <h2>결제 진행</h2>
            <p>주문번호: {reservation.reservationNo}</p>
            <p>금액: {reservation.totalPrice}원</p>

            <TossPaymentWidget
                orderId={reservation.reservationNo}
                orderName={reservation.programTitle}
                amount={reservation.totalPrice}
            />
        </div>
    );
}