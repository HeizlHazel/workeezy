export default function TossPaymentButton({ reservationId, amount, orderId }) {
    const handleClick = async () => {
        // 1. 토스 스크립트(window.TossPayments) 가져오기
        // 2. const tossPayments = TossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY)
        // 3. tossPayments.requestPayment("카드", {
        //        amount,
        //        orderId,
        //        orderName: "...",
        //        successUrl: "http://localhost:5173/payment/success",
        //        failUrl: "http://localhost:5173/payment/fail",
        //    })
    };

    return (
        <button onClick={handleClick}>
            결제하기
        </button>
    );
}