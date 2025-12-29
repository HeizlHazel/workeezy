import PageLayout from "../../../layout/PageLayout.jsx";
import {Fail} from "../components/Fail.jsx";
import {Success} from "../components/Success.jsx";

export default function PaymentResultPage() {
    console.log("🔥 RESULT URL =", window.location.href);

    const params = new URLSearchParams(window.location.search);

    const status = params.get("status");
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = Number(params.get("amount"));

    console.log({orderId, paymentKey, amount});

    return (
        <PageLayout>
            {status === "fail" ? <Fail/> : <Success paymentKey={paymentKey}
                                                    orderId={orderId}
                                                    amount={amount}/>}
        </PageLayout>
    );
}