import PageLayout from "../../../layout/PageLayout.jsx";

export default function PaymentResultPage() {
    const params = new URLSearchParams(window.location.search);

    const status = params.get("status");
    const orderId = params.get("orderId");

    return (
        <PageLayout>
            <>
                {/*{status === "success" ? (*/}
                {/*    <Success />*/}
                {/*) : (*/}
                {/*    <Fail />*/}
                {/*)}*/}
            </>
        </PageLayout>
    );
}