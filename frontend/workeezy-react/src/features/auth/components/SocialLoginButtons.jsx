import "./SocialLoginButtons.css";

export default function SocialLoginButtons() {
    return (
        <div className="social-login-container">
            <button className="social-btn" type="button">
                <img className="social-icon" src="/kakaoIcon.png" alt="kakao"/>
            </button>
            <button className="social-btn" type="button">
                <img className="social-icon" src="/naverIcon.png" alt="naver"/>
            </button>
        </div>
    );
}