import PageLayout from "../../../layout/PageLayout.jsx";
import {Fail} from "../components/Fail.jsx";
import {Success} from "../components/Success.jsx";

export default function PaymentResultPage() {
    const params = new URLSearchParams(window.location.search);

    const status = params.get("status");
    const paymentKey = params.get("paymentKey");

    const isFail = status === "fail";
    const isSuccess = !!paymentKey;

    return (
        <PageLayout>
            {isFail && <Fail/>}
            {isSuccess && <Success/>}
        </PageLayout>
    );
}