import "./ProgramInfo.css";

export default function ProgramInfo({ info }) {
    return (
        <section className="pd-section">
            <h3>프로그램 정보</h3>
            <p style={{ whiteSpace: "pre-line" }}>
                {info}
            </p>
        </section>
    );
}

