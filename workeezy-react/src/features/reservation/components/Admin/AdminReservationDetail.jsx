import {useEffect, useState} from "react";
import ReservationStatusButton from "../../../../shared/common/ReservationStatusButton";
import axios from "../../../../api/axios";
import {formatLocalDateTime} from "../../../../utils/dateTime";
import "./AdminReservationDetail.css";
import Swal from "sweetalert2";

export default function AdminReservationDetail({reservationId}) {
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        Swal.fire({
            title: "예약 정보를 불러오는 중",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        axios
            .get(`/api/admin/reservations/${reservationId}`)
            .then((res) => {
                setReservation(res.data);
                Swal.close();
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "조회 실패",
                    text: "예약 정보를 불러오지 못했습니다.",
                });
            });
    }, [reservationId]);

    if (!reservation) return null;

    return (
        <div className="admin-detail-card">
            <ReservationStatusButton status={reservation.status}/>

            <dl className="reservation-detail">
                <div>
                    <dt>예약번호</dt>
                    <dd>{reservation.reservationNo}</dd>
                </div>
                <div>
                    <dt>프로그램명</dt>
                    <dd>{reservation.ProgramTitle}</dd>
                </div>

                <div>
                    <dt>기간</dt>
                    <dd>
                        {formatLocalDateTime(reservation.startDate)} ~{" "}
                        {formatLocalDateTime(reservation.endDate)}
                    </dd>
                </div>

                <div>
                    <dt>예약자</dt>
                    <dd>{reservation.userName}</dd>
                </div>

                <div>
                    <dt>숙소</dt>
                    <dd>{reservation.stayName}</dd>
                </div>

                <div>
                    <dt>룸 타입</dt>
                    <dd>{reservation.roomType}</dd>
                </div>

                <div>
                    <dt>인원</dt>
                    <dd>{reservation.peopleCount}명</dd>
                </div>

                <div>
                    <dt>오피스</dt>
                    <dd>{reservation.officeName}</dd>
                </div>
            </dl>
        </div>
    );
}