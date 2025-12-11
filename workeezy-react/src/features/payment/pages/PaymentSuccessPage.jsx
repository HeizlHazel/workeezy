import PageLayout from "../../../layout/PageLayout.jsx";
import {useSearchParams} from "react-router-dom";
import api from "../../api/api"; // 인증 붙어있는 axios 인스턴스

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = Number(searchParams.get("amount"));

    // useEffect(() => {
    //     // 1. reservationId 를 어떻게 가져올지 결정
    //     //    - orderId 안에 encoding 해두거나
    //     //    - localStorage / 상태로 들고오기
    //     api.post("/api/payments/confirm", {
    //         paymentKey,
    //         orderId,
    //         amount,
    //         reservationId,
    //     })
    //         .then(...)
    //         .catch(...);
    // }, []);

    return (
        <PageLayout>

        </PageLayout>
    );
}
