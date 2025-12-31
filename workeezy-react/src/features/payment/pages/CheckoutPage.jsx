import TossPaymentWidget from "../components/TossPaymentWidget.jsx";
import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../../api/axios.js";

export default function CheckoutPage() {
    const {reservationId} = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔥 CheckoutPage mounted, reservationId =", reservationId);

        api.get(`/api/payments/${reservationId}`)
            .then((res) => {
                console.log("🔥 payment ready response", res.data);

                if (res.data.status === "CONFIRMED") {
                    navigate("/reservation/list", { replace: true });
                    return;
                }


                setReservation(res.data);
            })
            .catch((e) => {
                console.error("🔥 payment ready error", e);
                navigate("/reservation/list", {replace: true});
            })
            .finally(() => setLoading(false));
    }, [reservationId]);


    // useEffect(() => {
    //     fetch(`/api/payments/${reservationId}`, {
    //         credentials: "include",
    //     })
    //         .then(async (res) => {
    //             if (!res.ok) throw new Error("결제 진입 실패");
    //             return res.json();
    //         })
    //         .then((data) => {
    //             if (data.status === "CONFIRMED") {
    //                 navigate("/payment/result/success", {replace: true});
    //                 return;
    //             }
    //             setReservation(data);
    //         })
    //
    //         .catch((e) => {
    //             console.error(e);
    //             navigate("/reservation/list", {replace: true});
    //         })
    //         .finally(() => setLoading(false));
    // }, [reservationId, navigate]);

    if (loading) {
        return <div style={{textAlign: "center", marginTop: 120}}>결제 정보 불러오는 중...</div>;
    }

    if (!reservation) return null;

    return (
        <div style={{maxWidth: 480, margin: "100px auto"}}>
            <h2>결제 진행</h2>
            <p>주문번호: {reservation.reservationNo}</p>
            <p>금액: {reservation.totalPrice.toLocaleString()}원</p>

            <TossPaymentWidget
                orderId={reservation.reservationNo}
                orderName={reservation.programTitle}
                amount={reservation.totalPrice}
            />
        </div>
    );
}