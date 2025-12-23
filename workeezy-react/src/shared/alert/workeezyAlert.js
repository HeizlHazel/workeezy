import Swal from "sweetalert2";
import "./workeezyAlert.css";

// 버튼 필요한 alert
export const alert = Swal.mixin({
    toast: false,
    position: "top",
    showConfirmButton: true,
    confirmButtonText: "확인",
    width: 380,
    customClass: {
        popup: "alert-small",
        icon: "alert-icon-small"
    },
});

// 단순 알림
export const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    width: 380,
    padding: "12px 16px",
});
