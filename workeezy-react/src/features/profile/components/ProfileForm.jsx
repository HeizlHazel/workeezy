import "./ProfileForm.css";
import { useEffect, useState } from "react";
import api from "../../../api/axios.js"; // axios 인스턴스

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
                const { data } = await api.get("/api/user/me");
                console.log("내 정보:", data);

                setUser((prev) => ({
                    ...prev,
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    // 백엔드에서 넘겨주면 추가
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

    return (
        <div className="profile-page">
            <h2 className="page-title">개인 정보 조회</h2>

            {/* ----- 개인정보 수정 섹션 ----- */}
            <div className="section">
                <h3 className="section-title">개인 정보 수정</h3>

                <div className="form-row">
                    <label>아이디</label>
                    <input type="text" readOnly value={user.email} />
                </div>

                <div className="form-row">
                    <label>이름</label>
                    <input type="text" readOnly value={user.name} />
                </div>

                <div className="form-row">
                    <label>생년월일</label>
                    <input type="text" readOnly value={user.birth} />
                </div>

                <div className="form-row">
                    <label>연락처</label>
                    <input type="text" value={user.phone} readOnly />
                </div>

                <div className="form-row">
                    <label>소속 회사</label>
                    <input type="text" readOnly value={user.company} />
                </div>

                <button className="primary-btn">개인 정보 수정</button>
            </div>

            {/* ----- 비밀번호 변경 섹션 ----- */}
            <div className="section">
                <h3 className="section-title">비밀번호 변경</h3>

                <div className="form-row">
                    <label>기존 비밀번호</label>
                    <input type="password" />
                </div>

                <div className="form-row">
                    <label>새 비밀번호</label>
                    <input type="password" />
                </div>

                <p className="hint">
                    비밀번호는 공백없는 8~16자의 영문/숫자 등 두 가지 이상 조합으로 입력해주세요.
                </p>

                <div className="form-row">
                    <label>새 비밀번호 확인</label>
                    <input type="password" />
                </div>

                <p className="hint">비밀번호 확인을 위해 한 번 더 입력해주세요.</p>

                <button className="primary-btn">비밀번호 변경</button>
            </div>
        </div>
    );
}
