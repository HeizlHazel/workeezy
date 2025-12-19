import {loadTossPayments} from "@tosspayments/tosspayments-sdk";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";


export default function CheckoutPage() {
    const {reservationId} = useParams();

    const [widgets, setWidgets] = useState(null);
    const [reservation, setReservation] = useState({
        reservationNo: "TEST-ORDER-0001",
        totalPrice: 50000,
        programTitle: "Workation 테스트 상품"
    });

    useEffect(() => {
        async function init() {
            const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
            const customerKey = "Um80kmzhfkS_17JxBHT4l";

            const toss = await loadTossPayments(clientKey);
            const w = toss.widgets({customerKey});
            setWidgets(w);
        }

        init();
    }, []);

    useEffect(() => {
        if (!widgets) return;

        widgets.setAmount({
            currency: "KRW",
            value: 50000,   // 임시 값
            // value: reservation.totalPrice,
        });

        widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
        });

        widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
        });
    }, [widgets]);

    useEffect(() => {
        async function load() {
            const res = await fetch(`/api/reservations/${reservationId}`);
            const json = await res.json();
            setReservation(json);
        }

        load();
    }, [])

    useEffect(() => {
        if (!widgets || !reservation) return;

        widgets.setAmount({
            currency: "KRW",
            value: reservation.totalPrice,
        });
    }, [widgets, reservation]);

    return (
        <>
            <div style={{maxWidth: 480, margin: "100px auto"}}>
                <h2>결제 진행</h2>
                <p>주문번호: {reservation.reservationNo}</p>
                <p>금액: {reservation.totalPrice}원</p>
                <div id="payment-method"></div>
                <div id="agreement"></div>
            </div>
            {widgets && reservation && (
                <button
                    style={{
                        marginTop: "20px",
                        padding: "14px",
                        width: "20%",
                        backgroundColor: "#007aff",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                    onClick={async () => {
                        try {
                            await widgets.requestPayment({
                                orderId: reservation.reservationNo,
                                orderName: reservation.programTitle,
                                successUrl: `${window.location.origin}/payment/result`,
                                failUrl: `${window.location.origin}/payment/result?status=fail&orderId=${reservation.reservationNo}`,
                            });
                        } catch (err) {
                            console.error("결제 실패:", err);
                        }
                    }}
                >
                    결제하기
                </button>
            )
            }
        </>
    );
}
