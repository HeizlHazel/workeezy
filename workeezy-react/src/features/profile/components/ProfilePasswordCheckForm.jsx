import "./ProfilePasswordCheckForm.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../../api/axios.js";

export default function ProfilePasswordCheckForm() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleCheck = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/auth/check-password", {password: password,});

            if (res.data.success) {
                localStorage.setItem("profileVerified", "true");
                navigate("/profile", {replace: true});
            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("오류 발생");
        }
    };

    return (
        <div className="profile-check-wrapper">
            <form onSubmit={handleCheck} className="profile-check-form">

                <h2 className="profile-check-title">개인 정보 조회</h2>

                <div className="form-row">
                    <label className="label">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호를 입력하세요"
                        className="line-input"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <p className="profile-check-info">
                    회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인합니다.
                </p>

                <div className="reauth-button-wrap">
                    <button type="submit" className="reauth-button">
                        비밀번호 확인
                    </button>
                </div>

            </form>
        </div>
    );
}
