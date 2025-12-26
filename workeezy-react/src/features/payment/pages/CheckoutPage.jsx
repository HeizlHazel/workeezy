import TossPaymentWidget from "../components/TossPaymentWidget.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../../api/axios.js";

export default function CheckoutPage() {
    const {reservationId} = useParams();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        fetch(`/api/payments/${reservationId}`, {
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("결제 진입 실패");
                return res.json();
            })
            .then(setReservation)
            .catch(console.error);
    }, [reservationId]);

    // if (!reservation) {
    //     return <div>결제 정보를 불러오는 중...</div>;
    // }

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