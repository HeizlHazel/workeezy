import {useEffect, useState} from "react";
import {loadTossPayments} from "@tosspayments/tosspayments-sdk";

export default function TossPaymentWidget({orderId, orderName, amount}) {
    const [widgets, setWidgets] = useState(null);

    // 테스트 결제 전용 customerKey
    const customerKey = "workeezy";

    useEffect(() => {
        async function init() {
            const toss = await loadTossPayments(
                import.meta.env.VITE_TOSS_CLIENT_KEY
            );
            const w = toss.widgets({customerKey});
            setWidgets(w);
        }

        init();
    }, []);

    useEffect(() => {
        if (!widgets) return;

        widgets.setAmount({
            currency: "KRW",
            value: amount,
        });

        widgets.renderPaymentMethods({
            selector: "#payment-method",
        });

        widgets.renderAgreement({
            selector: "#agreement",
        });
    }, [widgets, amount]);

    const handlePayment = async () => {
        if (!widgets) return;

        try {
            await widgets.requestPayment({
                orderId: orderId,
                orderName: orderName,

                successUrl: `${window.location.origin}/payment/result`,
                failUrl: `${window.location.origin}/payment/result?status=fail&orderId=${orderId}`,

                customerName: "테스트 사용자",
                customerEmail: "test@workeezy.com",
            });
        } catch (error) {
            console.error("결제 요청 실패", error);
        }
    };

    return (
        <>
            <div id="payment-method"/>
            <div id="agreement"/>

            <button
                onClick={handlePayment}
                disabled={!widgets}
                style={{
                    marginTop: "20px",
                    padding: "14px",
                    width: "100%",
                    backgroundColor: "#007aff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: widgets ? "pointer" : "not-allowed",
                    opacity: widgets ? 1 : 0.6,
                }}
            >
                결제하기
            </button>
        </>
    );
}