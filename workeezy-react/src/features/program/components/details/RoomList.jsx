import "./RoomList.css";

export default function RoomList({ rooms = [], photos }) {
    if (!rooms || rooms.length === 0) return null;

    const safePhotos = photos ?? {};

    const getImage = (url) => {
        if (!url) return null;   // ⬅ null 반환으로 수정
        return url.startsWith("public/")
            ? "/" + url.replace("public/", "")
            : url;
    };

    const photoList = [
        safePhotos.photo2,
        safePhotos.photo3
    ];


    return (
        <div className="pd-rooms">
            {rooms.map((r, index) => {
                const imgSrc = getImage(photoList[index]);

                return (
                    <div key={r.id} className="pd-room-item">

                        {/* 이미지가 존재할 때만 렌더 */}
                        {imgSrc && (
                            <img
                                src={imgSrc}
                                className="pd-room-img"
                            />
                        )}

                        <div className="pd-room-info">
                            <div className="pd-room-type">
                                {r.roomType}
                            </div>

                            <div className="pd-room-items">
                                <i className="fa-solid fa-wifi"></i>
                                <i className="fa-solid fa-tv"></i>
                                <i className="fa-solid fa-print"></i>
                                <i className="fa-solid fa-phone"></i>
                            </div>

                            <div className="pd-room-desc">
                                {r.roomService}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
