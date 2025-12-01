import "./RoomList.css";
export default function RoomList(){
  const rooms=[
    {name:"스탠다드",img:"/public/a161ab83-1b52-4475-b7e3-f75afb932943.png"},
    {name:"패밀리",img:"/public/ac95ce1d-57d6-4862-9e4e-fabfadd1e5a2.png"}
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
