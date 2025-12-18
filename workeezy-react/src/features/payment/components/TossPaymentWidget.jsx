import {loadTossPayments} from "@tosspayments/tosspayments-sdk";
import {useEffect, useState} from "react";
import "./TossPaymentWidget.css";

export function TossPaymentWidget({onClose}) {

    const [widgets, setWidgets] = useState(null);

    useEffect(() => {
        let timer;

        async function init() {
            const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
            const customerKey = "Um80kmzhfkS_17JxBHT4l";

            const toss = await loadTossPayments(clientKey);
            const w = toss.widgets({customerKey});

            setWidgets(w);
        }

        // DOM ready 보장
        timer = setTimeout(init, 0);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!widgets) return;

        widgets.setAmount({currency: "KRW", value: 50000});

        widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT"
        });

        widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT"
        });
    }, [widgets]);

    return (
        <div className="toss-overlay">
            <div className="toss-card">
                <span onClick={onClose}>닫기</span>
                {/*위젯 : 결제수단 표기 */}
                <div id="payment-method"></div>

                {/* 위젯 : 결제 약관 */}
                <div id="agreement"></div>

                {/* 이건 Toss 위젯 내부 버튼 누르면 진행됨 → 별도 버튼 필요없음 */}
            </div>
        </div>
    )
        ;
}