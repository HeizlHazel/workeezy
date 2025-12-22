import {Success} from "../components/Success.jsx";
import {Fail} from "../components/Fail.jsx";
import PageLayout from "../../../layout/PageLayout.jsx";

export default function PaymentResultPage() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    // if (status === "success") return <Success/>
    // return <Fail/>
    return (
        <PageLayout>
            {status === "success"
                ? <Success/>
                : <Fail/>
            }
        </PageLayout>
    )
}