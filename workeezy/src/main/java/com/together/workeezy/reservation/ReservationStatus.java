package com.together.workeezy.reservation;

public enum ReservationStatus {

    waiting_payment,  // 결제대기 - 예약 신청 직후(관리자 승인전)
    approved,          // 승인 완료 - 관리자 승인 (아직 결제 안 함)
    rejected,          // 관리자 반송
    confirmed,		  // 결제 완료(예약 확정)
    cancel_requested, // 취소 신청(취소 3일전까지는 바로 취소, 당일은 불가, 전날/전전날은 승인)
    cancelled;		  // 취소 완료
}
