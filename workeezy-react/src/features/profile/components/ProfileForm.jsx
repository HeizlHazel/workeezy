import "./ProfileForm.css";
import {useEffect, useState} from "react";
import api from "../../../api/axios.js";
import SectionHeader from "../../../shared/common/SectionHeader.jsx"; // axios 인스턴스
import {toast} from "../../../shared/alert/workeezyAlert.js";

export default function ProfileForm() {
    const [user, setUser] = useState({
        email: "",
        name: "",
        birth: "",
        phone: "",
        company: "",
        role: "",
    });

    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const {data} = await api.get("/api/user/me");
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
            await api.put("/api/user/phone", {phone: user.phone});
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

    return (
        <div className="profile-page">
            <SectionHeader icon="far fa-user" title="개인 정보 조회"/>

            {/* ----- 개인정보 수정 섹션 ----- */}
            <div className="section">
                <h3 className="section-title">개인 정보 수정</h3>

                <div className="form-row">
                    <label>아이디</label>
                    <input className="readonly-profile" type="text" readOnly value={user.email}/>
                </div>

                <div className="form-row">
                    <label>이름</label>
                    <input className="readonly-profile" type="text" readOnly value={user.name}/>
                </div>

                <div className="form-row">
                    <label>생년월일</label>
                    <input className="readonly-profile" type="text" readOnly value={user.birth}/>
                </div>

                <div className="form-row">
                    <label>연락처</label>
                    <input type="text"
                           value={user.phone}
                           onChange={(e) =>
                               setUser((prev) => ({...prev, phone: e.target.value}))
                           }/>
                </div>

                <div className="form-row">
                    <label>소속 회사</label>
                    <input className="readonly-profile" type="text" readOnly value={user.company}/>
                </div>
                <button className="primary-btn"
                        onClick={handleUpdate}
                >개인 정보 수정
                </button>
            </div>

            {/* ----- 비밀번호 변경 섹션 ----- */}
            <div className="section">
                <h3 className="section-title">비밀번호 변경</h3>

                <div className="form-row">
                    <label>기존 비밀번호</label>
                    <input type="password"/>
                </div>

                <div className="form-row">
                    <label>새 비밀번호</label>
                    <input type="password"/>
                </div>

                <p className="hint">
                    비밀번호는 공백없는 8~16자의 영문/숫자 등 두 가지 이상 조합으로 입력해주세요.
                </p>

                <div className="form-row">
                    <label>새 비밀번호 확인</label>
                    <input type="password"/>
                </div>

                <p className="hint">비밀번호 확인을 위해 한 번 더 입력해주세요.</p>

                <button className="primary-btn">비밀번호 변경</button>
            </div>
        </div>
    );
}
