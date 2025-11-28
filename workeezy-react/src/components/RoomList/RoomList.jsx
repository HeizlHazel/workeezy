import "./RoomList.css";
export default function RoomList(){
  const rooms=[
    {name:"스탠다드",img:"/room1.jpg"},
    {name:"패밀리",img:"/room2.jpg"}
  ];
  return (
    <div className="pd-rooms">
      {rooms.map((r,i)=>(
        <div key={i} className="pd-room-item">
          <img src={r.img} className="pd-room-img"/>
          <div className="pd-room-name">{r.name}</div>
        </div>
      ))}
    </div>
  );
}
