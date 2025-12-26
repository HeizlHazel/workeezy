import PageLayout from "../../../layout/PageLayout.jsx";
import {Fail} from "../components/Fail.jsx";
import {Success} from "../components/Success.jsx";

export default function PaymentResultPage() {
    const params = new URLSearchParams(window.location.search);

    const status = params.get("status");
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = Number(params.get("amount"));

    let content = <Fail/>;

    if (status === "fail") {
        content = <Fail/>;
    } else if (paymentKey && orderId && amount) {
        content = <Success/>;
    }

    return <PageLayout>{content}</PageLayout>;
}