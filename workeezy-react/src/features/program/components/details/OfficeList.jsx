import "./OfficeList.css";

export default function OfficeList({ offices = [] }) {
    if (offices.length === 0) return null;

    return (
        <section className="OfficeList">
            <h3>오피스 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br />

            {offices.map((o) => (
                <div key={o.id} className="pd-office-card">
                    <img src={o.photo1} className="pd-office-img" />
                    <div className="pd-office-info">
                        <div className="pd-office-title">{o.name}</div>
                        <div className="pd-office-address">{o.address}</div>
                        <div className="pd-office-desc">{o.equipment}</div>
                    </div>
                </div>
            ))}
        </section>
    );
}

