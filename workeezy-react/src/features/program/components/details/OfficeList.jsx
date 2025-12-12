import "./OfficeList.css";

export default function OfficeList({ offices = [] }) {
    if (offices.length === 0) return null;

    const getImage = (url) => {
        if (!url) return null;
        return url.startsWith("public/")
            ? "/" + url.replace("public/", "")
            : url;
    };

    return (
        <section className="OfficeList">
            <h3>오피스 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br />

            {offices.map((o) => (
                <div key={o.id} className="pd-office-card">

                    {/* 🔥 여기 수정! 변환된 경로 getImage 적용 */}
                    <img
                        src={getImage(o.photo1)}
                        className="pd-office-img"
                        alt={o.name}
                    />

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
