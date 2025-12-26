package com.together.workeezy.reservation.enums;

public enum ReservationStatus {

    waiting_payment,  // 결제대기 - 예약 신청 직후(관리자 승인전)
    approved,          // 승인 완료 - 관리자 승인 (아직 결제 안 함) -> 취소 바로 가능
    rejected,          // 관리자 반송
    confirmed,		  // 결제 완료(예약 확정)
    cancel_requested, // 취소 신청(취소 3일전까지는 바로 취소, 당일은 불가, 전날/전전날은 승인)
    cancelled;		  // 취소 완료

    // 수정 가능 여부
    public boolean canUpdate() {
        return this == waiting_payment;
    }

    // 직접 취소 가능 여부
    public boolean canDirectCancel(int diffDays){
        if(this == waiting_payment) return true;
        if(this == approved) return true;
        if(this == confirmed && diffDays >= 3)return true;
        return false;
    }

    // 취소 요청 가능 여부
    public boolean canRequestCancel(int diffDays){
        if(this == confirmed &&diffDays >=1 && diffDays <3) return true;
        return false;
    }

    public void validateCancelable(int diffDays) {
        if (!canDirectCancel(diffDays)) {
            throw new IllegalStateException("취소할 수 없습니다.");
        }
    }

}
