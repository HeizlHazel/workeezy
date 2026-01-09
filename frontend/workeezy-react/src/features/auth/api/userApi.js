import api from "../../../api/axios.js";

// 내 정보 조회
export const getMyInfoApi = (config = {}) =>
    api.get("/api/user/me", config);


// 연락처 수정
export const updatePhoneApi = (phone) => {
    return api.put("/api/user/phone", {phone});
}

// 비밀번호 변경
export const updatePasswordApi = (currentPassword, newPassword, newPasswordCheck) => {
    return api.put("/api/user/password", {
        currentPassword,
        newPassword,
        newPasswordCheck
    });
}