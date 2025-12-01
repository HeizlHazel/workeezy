import "./LoginOptions.css";

export default function LoginOptions() {
  return (
    <div className="login-options">
      <div className="checkbox-field">
        <label className="checkbox">
          <input type="checkbox" className="check-input" />
          <span className="check-label">아이디 저장</span>
        </label>
      </div>

      <div className="checkbox-field2">
        <label className="checkbox">
          <input type="checkbox" className="check-input" />
          <span className="check-label">자동 로그인</span>
        </label>
      </div>
    </div>
  );
}
