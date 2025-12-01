import "./RoomList.css";

export default function RoomList() {
    const rooms = [
        {
            name: "스탠다드",
            img: "/public/a161ab83-1b52-4475-b7e3-f75afb932943.png",
            people: 3,
        },
        {
            name: "패밀리",
            img: "/public/ac95ce1d-57d6-4862-9e4e-fabfadd1e5a2.png",
            people: 4,
        }
    ];

    return (
        <div className="pd-rooms">
            {rooms.map((r, i) => (
                <div key={i} className="pd-room-item">
                    <img src={r.img} className="pd-room-img"/>

                    <div className="pd-room-info">
                        <div className="pd-room-name">{r.name} <i className="fa-solid fa-user"></i> {r.people}명</div>

                        <div className="pd-room-items">
                            <i className="fa-solid fa-wifi"></i>
                            <i className="fa-solid fa-tv"></i>
                            <i className="fa-solid fa-print"></i>
                            <i className="fa-solid fa-phone"></i>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
