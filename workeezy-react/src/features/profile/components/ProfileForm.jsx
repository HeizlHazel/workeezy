import "./ProfileForm.css";
import {useEffect, useState} from "react";
import SectionHeader from "../../../shared/common/SectionHeader.jsx"; // axios 인스턴스
import {toast} from "../../../shared/alert/workeezyAlert.js";
import {getMyInfoApi, updatePasswordApi, updatePhoneApi} from "../../../api/userApi.js";

export default function ProfileForm() {
    const [user, setUser] = useState({
        email: "",
        name: "",
        birth: "",
        phone: "",
        company: "",
        role: "",
    });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");

    // 새 비밀번호 규칙 충족 여부
    const [passwordValidMessage, setPasswordValidMessage] = useState("");
    // 비밀번호 확인 일치 여부
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");

    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const {data} = await getMyInfoApi();
                console.log("내 정보:", data);

                setUser((prev) => ({
                    ...prev,
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    birth: data.birth || "",
                    phone: data.phone || "",
                    company: data.company || "",
                }));
            } catch (err) {
                console.error("내 정보 불러오기 실패", err);
            }
        };

        fetchMyInfo();
    }, []);

    const isValidPhone = (value) => {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
        return phoneRegex.test(value);
    };

    const handleUpdate = async () => {
        console.log("업데이트 함수 실행됨!");
        console.log("user.phone:", user.phone);
        if (!isValidPhone(user.phone)) {
            await toast.fire({
                icon: "error",
                position: "top",
                title: "연락처 형식 오류",
                text: "하이픈(-) 포함 13자리 형식으로 입력해주세요.",
            });
            return;
        }

        try {
            await updatePhoneApi(user.phone);
            await toast.fire({
                icon: "success",
                title: "연락처가 성공적으로 변경되었습니다!",
            });

        } catch (err) {
            console.error("수정 실패: ", err);
            await toast.fire({
                icon: "error",
                title: "수정에 실패했습니다. 다시 시도해주세요.",
            });
        }
    };

    // 비밀번호 변경
    const handleChangePassword = async () => {

        console.log({currentPassword, newPassword, newPasswordCheck});

        if (!currentPassword || !newPassword || !newPasswordCheck) {
            await toast.fire({
                icon: "error",
                title: "모든 필드를 입력해주세요.",
            });
            return;
        }

        if (newPassword !== newPasswordCheck) {
            await toast.fire({
                icon: "error",
                title: "새 비밀번호가 일치하지 않습니다.",
            })
            return;
        }

        try {
            await updatePasswordApi(currentPassword, newPassword, newPasswordCheck);
            await toast.fire({
                icon: "success",
                title: "비밀번호 변경 완료! 다시 로그인해주세요.",
            })
            window.location.href = "/login";

        } catch (err) {
            console.error(err);

            const message = err.response?.data || "비밀번호 변경 실패";

            await toast.fire({
                icon: "error",
                title: message,
            })
        }
        console.log("token:", localStorage.getItem("accessToken"));
    }

    const validatePasswordRule = (pwd) => {
        const lengthOk = pwd.length >= 8 && pwd.length <= 16;
        const numberOk = /[0-9]/.test(pwd);
        const upperOk = /[A-Z]/.test(pwd);
        const lowerOk = /[a-z]/.test(pwd);
        const specialOk = /[!@#$%^&*]/.test(pwd);

        if (!pwd) return "";

        if (!lengthOk) return "비밀번호는 8~16자여야 합니다.";
        if (!numberOk) return "비밀번호에는 숫자가 1개 이상 포함되어야 합니다.";
        if (!upperOk) return "비밀번호에는 영어 대문자가 1개 이상 포함되어야 합니다.";
        if (!lowerOk) return "비밀번호에는 영어 소문자가 1개 이상 포함되어야 합니다.";
        if (!specialOk) return "비밀번호에는 특수문자가 1개 이상 포함되어야 합니다.(가능 문자: !@#$%^&*)";

        return "사용 가능한 비밀번호입니다.";
    }

    const handleNewPasswordChange = (value) => {
        setNewPassword(value);
        setPasswordValidMessage(validatePasswordRule(value));
    }

    const handleNewPasswordCheckChange = (value) => {
        setNewPasswordCheck(value);

        if (!value) {
            setPasswordMatchMessage("");
            return;
        }

        if (value === newPassword) {
            setPasswordMatchMessage("비밀번호가 일치합니다.");
        } else {
            setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
        }
    }

    return (
        <>
            <SectionHeader icon="far fa-user" title="개인 정보 조회"/>
            <div className="profile-page">


                {/* ----- 개인정보 수정 섹션 ----- */}
                <div className="profile-section">
                    <h3 className="profile-section-title">개인 정보 수정</h3>

                    <div className="profile-form-row">
                        <label>아이디</label>
                        <input className="readonly-profile" type="text" readOnly value={user.email}/>
                    </div>

                    <div className="profile-form-row">
                        <label>이름</label>
                        <input className="readonly-profile" type="text" readOnly value={user.name}/>
                    </div>

                    <div className="profile-form-row">
                        <label>생년월일</label>
                        <input className="readonly-profile" type="text" readOnly value={user.birth}/>
                    </div>

                    <div className="profile-form-row">
                        <label>연락처</label>
                        <input type="text"
                               value={user.phone}
                               onChange={(e) =>
                                   setUser((prev) => ({...prev, phone: e.target.value}))
                               }/>
                    </div>

                    <div className="profile-form-row">
                        <label>소속 회사</label>
                        <input className="readonly-profile" type="text" readOnly value={user.company}/>
                    </div>
                    <button className="primary-btn"
                            onClick={handleUpdate}
                    >개인 정보 수정
                    </button>
                </div>

                {/* ----- 비밀번호 변경 섹션 ----- */}
                <div className="profile-section">
                    <h3 className="profile-section-title">비밀번호 변경</h3>

                    <div className="profile-form-row">
                        <label>기존 비밀번호</label>
                        <input type="password"
                               value={currentPassword}
                               onChange={(e) => setCurrentPassword(e.target.value)}/>
                    </div>

                    <div className="profile-form-row">
                        <label>새 비밀번호</label>
                        <input type="password"
                               value={newPassword}
                               onChange={(e) => handleNewPasswordChange(e.target.value)}/>
                    </div>

                    <p className={`hint ${passwordValidMessage.includes("사용 가능한 비밀번호입니다.") ? "success" : "error"}`}>
                        {passwordValidMessage}
                        {/*비밀번호는 공백없는 8~16자의 영문/숫자 등 두 가지 이상 조합으로 입력해주세요.*/}
                    </p>

                    <div className="profile-form-row">
                        <label>새 비밀번호 확인</label>
                        <input type="password"
                               value={newPasswordCheck}
                               onChange={(e) => handleNewPasswordCheckChange(e.target.value)}/>
                    </div>

                    <p className={`hint ${passwordMatchMessage === "비밀번호가 일치합니다." ? "success" : "error"}`}>
                        {passwordMatchMessage}
                        {/*비밀번호 확인을 위해 한 번 더 입력해주세요.*/}
                    </p>

                    <button className="primary-btn"
                            onClick={handleChangePassword}>비밀번호 변경
                    </button>
                </div>
            </div>
        </>
    );
}
