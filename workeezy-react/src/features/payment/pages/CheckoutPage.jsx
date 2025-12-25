import TossPaymentWidget from "../components/TossPaymentWidget.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../../api/axios.js";

export default function CheckoutPage() {
    const {reservationId} = useParams();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        api.get(`/api/payments/${reservationId}`)
            .then(res => setReservation(res.data))
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