import "./ProfilePasswordCheckForm.css";
import {useNavigate} from "react-router-dom";
import {toast} from "../../../shared/alert/workeezyAlert.js";
import {checkPasswordApi} from "../../../api/authApi.js";
import {useState} from "react";

export default function ProfilePasswordCheckForm() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheck = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const res = await checkPasswordApi(password);

            if (res.data.success) {
                await toast.fire({
                    icon: "success",
                    title: "비밀번호 확인이 완료되었습니다.",
                });

                // 서버가 재인증 상태 기억
                navigate("/profile", {replace: true});
                return;
            }

            await toast.fire({
                icon: "error",
                title: "비밀번호가 일치하지 않습니다.",
            });

        } catch (err) {
            await toast.fire({
                icon: "error",
                title: "오류가 발생했습니다.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-check-wrapper">
            <form onSubmit={handleCheck} className="profile-check-form">

                <h2 className="profile-check-title">개인 정보 조회</h2>

                <div className="profile-check-form-row">
                    <label className="profile-check-label">비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        className="profile-check-line-input"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <p className="profile-check-info">
                    회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인합니다.
                </p>

                <div className="reauth-button-wrap">
                    <button type="submit" className="reauth-button" disabled={loading}>
                        비밀번호 확인
                    </button>
                </div>

            </form>
        </div>
    );
}