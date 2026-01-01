import {useEffect, useState} from "react";
import {loadTossPayments} from "@tosspayments/tosspayments-sdk";

export default function TossPaymentWidget({orderId, orderName, amount}) {
    const [widgets, setWidgets] = useState(null);
    const [loading, setLoading] = useState(false);

    // 테스트 결제 전용 customerKey
    const customerKey = "workeezy";

    useEffect(() => {
        async function init() {
            console.log("🔥 TOSS CLIENT KEY =", import.meta.env.VITE_TOSS_CLIENT_KEY);
            const toss = await loadTossPayments(
                import.meta.env.VITE_TOSS_CLIENT_KEY
            );
            console.log("🔥 toss instance =", toss);

            const w = toss.widgets({customerKey});
            console.log("🔥 widgets =", w);

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
        console.log("🔥 결제 버튼 클릭", {widgets, loading});
        if (!widgets || loading) {
            console.log("❌ widgets 준비 안 됨");
            return;
        }

        try {
            setLoading(true); // 클릭한 순간 잠금

            await widgets.requestPayment({
                orderId,
                orderName,

                successUrl: `${window.location.origin}/payment/result/success`,
                failUrl: `${window.location.origin}/payment/result/fail`,

                customerName: "테스트 사용자",
                customerEmail: "test@workeezy.com",
            });
        } catch (error) {
            console.error("결제 요청 실패", error);
            setLoading(false); // Toss 위젯 뜨기 전에 실패한 경우 대비
        }
    };

    return (
        <>
            <div id="payment-method"/>
            <div id="agreement"/>

            <button
                onClick={handlePayment}
                disabled={!widgets || loading}
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
                    cursor: !widgets || loading ? "not-allowed" : "pointer",
                    opacity: !widgets || loading ? 0.6 : 1,
                }}
            >
                {loading ? "결제 진행 중..." : "결제하기"}
            </button>
        </>
    );
}