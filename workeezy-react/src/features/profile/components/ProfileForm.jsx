import "./ProfileForm.css";
import {useEffect, useState} from "react";
import SectionHeader from "../../../shared/common/SectionHeader.jsx";
import {toast} from "../../../shared/alert/workeezyAlert.js";
import useMyInfo from "../../../hooks/useMyInfo.js";
import useAuth from "../../../hooks/useAuth.js";

export default function ProfileForm() {
    const {myInfo, loading, updatePhone, updatePassword} = useMyInfo();
    const {logout} = useAuth();

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
        if (!myInfo) return;

        setUser({
            email: myInfo.email,
            name: myInfo.name,
            role: myInfo.role,
            birth: myInfo.birth || "",
            phone: myInfo.phone || "",
            company: myInfo.company || "",
        });
    }, [myInfo]);

    const isValidPhone = (value) => {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
        return phoneRegex.test(value);
    };

    const handleUpdate = async () => {
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
            await updatePhone(user.phone);
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
            await updatePassword(
                currentPassword,
                newPassword,
                newPasswordCheck
            );

            await toast.fire({
                icon: "success",
                title: "비밀번호 변경 완료! 다시 로그인해주세요.",
            });
            logout();

        } catch (err) {
            console.error(err);

            const message = err.response?.data || "비밀번호 변경 실패";

            await toast.fire({
                icon: "error",
                title: message,
            })
        }
    };

    const validatePasswordRule = (pwd) => {
        if (!pwd) return "";

        if (pwd.length < 8 || pwd.length > 16)
            return "비밀번호는 8~16자여야 합니다.";
        if (!/[0-9]/.test(pwd))
            return "숫자를 1개 이상 포함해야 합니다.";
        if (!/[A-Z]/.test(pwd))
            return "대문자를 1개 이상 포함해야 합니다.";
        if (!/[a-z]/.test(pwd))
            return "소문자를 1개 이상 포함해야 합니다.";
        if (!/[!@#$%^&*]/.test(pwd))
            return "특수문자(!@#$%^&*)를 포함해야 합니다.";

        return "사용 가능한 비밀번호입니다.";
    };

    const handleNewPasswordChange = (value) => {
        setNewPassword(value);
        setPasswordValidMessage(validatePasswordRule(value));
    }

    const handleNewPasswordCheckChange = (value) => {
        setNewPasswordCheck(value);
        setPasswordMatchMessage(
            value
                ? value === newPassword
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."
                : ""
        );
    };

    if (loading) return null;

    return (
        <>
            <SectionHeader icon="far fa-user" title="개인 정보 조회"/>
            <div className="profile-page">

                {/* 개인정보 수정 */}
                <div className="profile-section">
                    <h3 className="profile-section-title">개인 정보 수정</h3>

                    <div className="profile-form-row">
                        <label>아이디</label>
                        <input className="readonly-profile" readOnly value={user.email}/>
                    </div>

                    <div className="profile-form-row">
                        <label>이름</label>
                        <input className="readonly-profile" readOnly value={user.name}/>
                    </div>

                    <div className="profile-form-row">
                        <label>생년월일</label>
                        <input className="readonly-profile" readOnly value={user.birth}/>
                    </div>

                    <div className="profile-form-row">
                        <label>연락처</label>
                        <input type="text"
                               value={user.phone}
                               onChange={(e) =>
                                   setUser((p) => ({...p, phone: e.target.value}))
                               }/>
                    </div>

                    <div className="profile-form-row">
                        <label>소속 회사</label>
                        <input className="readonly-profile" readOnly value={user.company}/>
                    </div>
                    <button className="primary-btn"
                            onClick={handleUpdate}
                    >개인 정보 수정
                    </button>
                </div>

                {/* 비밀번호 변경 */}
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
                    </p>

                    <div className="profile-form-row">
                        <label>새 비밀번호 확인</label>
                        <input type="password"
                               value={newPasswordCheck}
                               onChange={(e) => handleNewPasswordCheckChange(e.target.value)}/>
                    </div>

                    <p className={`hint ${passwordMatchMessage === "비밀번호가 일치합니다." ? "success" : "error"}`}>
                        {passwordMatchMessage}
                    </p>

                    <button className="primary-btn"
                            onClick={handleChangePassword}>비밀번호 변경
                    </button>
                </div>
            </div>
        </>
    );
}
