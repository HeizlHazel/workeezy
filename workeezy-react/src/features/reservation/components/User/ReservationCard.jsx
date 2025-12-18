import "./ReservationCard.css";
import ReservationStatusButton from "./../../../../shared/common/ReservationStatusButton";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {TossPaymentWidget} from "../../../payment/components/TossPaymentWidget.jsx";

export default function ReservationCard({data, isSelected, onSelect}) {
    const navigate = useNavigate();
    const {
        programTitle,
        stayName,
        roomType,
        status,
        startDate,
        endDate,
        totalPrice,
        peopleCount,
        images = [],

        // 상세 정보
        userName,
        company,
        phone,
        reservationNo,
        officeName,
    } = data;

    /* =========================
       날짜 계산 (D-Day 기준)
    ========================= */
    const today = new Date();
    const start = new Date(startDate);
    const diffDays = Math.floor((start - today) / (1000 * 60 * 60 * 24));

    /* =========================
       상태 플래그
    ========================= */
    const isWaitingPayment = status === "waiting_payment";
    const isApproved = status === "approved";
    const isConfirmed = status === "confirmed";

    /* =========================
       버튼 노출 조건
    ========================= */
    const showConfirmDoc = isConfirmed;
    const showPayment = isConfirmed;
    const showChangeRequest = isConfirmed && diffDays >= 1;
    const showChange = isWaitingPayment;
    const showDirectCancel = isWaitingPayment || (isConfirmed && diffDays >= 3);
    const showCancelRequest =
        isApproved || (isConfirmed && diffDays >= 1 && diffDays < 3);
    const showPaymentWidget = isWaitingPayment;

    const handleCancel = async () => {
        const ok = window.confirm("예약을 취소하시겠습니까?");
        if (!ok) return;

        try {
            const token = localStorage.getItem("accessToken");

            await axios.patch(
                `http://localhost:8080/api/reservations/${data.id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("예약이 취소되었습니다.");
            window.location.reload(); // 또는 상위에서 목록 재조회
        } catch (err) {
            console.error("예약 취소 실패", err);
            alert("예약 취소 중 오류가 발생했습니다.");
        }
    };

    return (
        <div
            className={`reservation-card ${isSelected ? "selected" : ""}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {/* === 이미지 섹션 === */}
            {isSelected ? (
                <div className="image-grid">
                    {images.slice(0, 3).map((src, i) => (
                        <img key={i} src={src} alt={`${programTitle}-${i}`}/>
                    ))}
                </div>
            ) : (
                <img className="thumbnail" src={images[0]} alt={programTitle}/>
            )}

            {/* === 정보 섹션 === */}
            <div className="info">
                {/* 상태 버튼 */}
                <div style={{marginRight: "860px", marginBottom: "0px"}}>
                    <ReservationStatusButton status={status}/>
                </div>

                <div className="title">{programTitle}</div>

                {/* === 기본 정보 === */}
                <dl className="details">
                    <div>
                        <dt>기간</dt>
                        <dd>
                            {startDate} ~ {endDate}
                        </dd>
                    </div>

                    <div>
                        <dt>숙소</dt>
                        <dd>{stayName}</dd>
                    </div>

                    <div>
                        <dt>룸타입</dt>
                        <dd>{roomType}</dd>
                    </div>

                    <div>
                        <dt>인원</dt>
                        <dd>{peopleCount}명</dd>
                    </div>

                    <div>
                        <dt>금액</dt>
                        <dd>{totalPrice?.toLocaleString()}원</dd>
                    </div>
                </dl>

                {/* === 선택 시 상세 정보 === */}
                {isSelected && (
                    <dl className="detail-extra">
                        <div>
                            <dt>예약자</dt>
                            <dd>{userName}</dd>
                        </div>

                        <div>
                            <dt>소속</dt>
                            <dd>{company || "-"}</dd>
                        </div>

                        <div>
                            <dt>연락처</dt>
                            <dd>{phone}</dd>
                        </div>

                        <div>
                            <dt>예약번호</dt>
                            <dd>{reservationNo}</dd>
                        </div>

                        <div>
                            <dt>프로그램명</dt>
                            <dd>{programTitle}</dd>
                        </div>

                        <div>
                            <dt>숙소명</dt>
                            <dd>{stayName}</dd>
                        </div>

                        <div>
                            <dt>룸타입</dt>
                            <dd>{roomType}</dd>
                        </div>

                        <div>
                            <dt>인원수</dt>
                            <dd>{peopleCount}명</dd>
                        </div>

                        <div>
                            <dt>오피스명</dt>
                            <dd>{officeName || "없음"}</dd>
                        </div>
                    </dl>
                )}
            </div>

            {/* === 선택됐을 때 버튼 === */}
            {isSelected && (
                <div className="buttons">
                    {showConfirmDoc && <button>예약 확정서</button>}
                    {showPayment && <button>결제 내역</button>}
                    {showChangeRequest && <button>예약 변경 신청</button>}
                    {showChange && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/reservation/edit/${data.id}`);
                            }}
                        >
                            예약 변경
                        </button>
                    )}
                    {showDirectCancel && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancel();
                            }}
                        >
                            예약 취소
                        </button>
                    )}
                    {showCancelRequest && <button>예약 취소 요청</button>}
                    {showPaymentWidget && <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment/${data.id}`);
                        }}>결제하기</button>}
                </div>
            )}
        </div>
    );
}
