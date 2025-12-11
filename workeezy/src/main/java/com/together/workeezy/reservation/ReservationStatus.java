package com.together.workeezy.reservation;

public enum ReservationStatus {
//    waiting, confirm,cancel;

    waiting_payment,  // 결제 전
    confirmed,		  // 결제 완료 -> 예약 확정
    cancel_requested, // 취소 신청(취소 3일전까지는 바로 취소, 당일은 불가, 전날/전전날은 승인받는걸로 하면 어때요 나중에 이거 보면 얘기해봐요 ㅋ)
    cancelled;		  // 취소 완료
}
