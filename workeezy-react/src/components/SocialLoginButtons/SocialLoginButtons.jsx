import "./SocialLoginButtons.css";

export default function SocialLoginButtons() {
  return (
    <div class="social-login-button">
      <button className="naver-button" type="button">
        <img class="naver-icon" src="/naverIcon.png" />
      </button>
      <button className="kakao-button" type="button">
        <img class="kakao-icon" src="/kakaoIcon.png" />
      </button>
    </div>
  );
}
