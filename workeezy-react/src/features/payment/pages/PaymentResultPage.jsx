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

    if (status === "success") {
        content = <Success/>;
    } else {
        content = <Fail/>;
    }

    console.log({orderId, paymentKey, amount});

    return <PageLayout>{content}</PageLayout>;
}