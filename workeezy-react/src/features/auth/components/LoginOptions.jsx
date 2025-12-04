import "./LoginOptions.css";

export default function LoginOptions() {
  return (
    <div className="login-options">
      <label className="option">
        <input type="checkbox" className="check-input" />
        <span>아이디 저장</span>
      </label>

      <label className="option">
        <input type="checkbox" className="check-input" />
        <span>자동 로그인</span>
      </label>
    </div>
  );
}
