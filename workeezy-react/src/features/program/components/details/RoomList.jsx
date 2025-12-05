import "./RoomList.css";

export default function RoomList({ rooms = [] }) {
    if (rooms.length === 0) return null;

    return (
        <div className="pd-rooms">
            {rooms.map((r) => (
                <div key={r.id} className="pd-room-item">
                    <img src={r.photo1} className="pd-room-img" />

                    <div className="pd-room-info">
                        <div className="pd-room-name">
                            {r.name}
                        </div>

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

