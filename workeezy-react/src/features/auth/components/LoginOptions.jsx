import "./LoginOptions.css";

export default function LoginOptions({
                                         rememberEmail,
                                         setRememberEmail,
                                         autoLogin,
                                         setAutoLogin,
                                     }) {
    return (
        <div className="login-options">
            <label className="option">
                <input
                    type="checkbox"
                    className="check-input"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}/>
                <span>아이디 저장</span>
            </label>

            <label className="option">
                <input
                    type="checkbox"
                    className="check-input"
                    checked={autoLogin}
                    onChange={(e) => setAutoLogin(e.target.checked)}/>
                <span>자동 로그인</span>
            </label>
        </div>
    );
}
