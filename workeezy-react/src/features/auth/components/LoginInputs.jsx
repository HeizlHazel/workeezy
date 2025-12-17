import "./LoginInputs.css";

export default function LoginInputs({email, setEmail, password, setPassword}) {
  return (
    <div className="login-inputs">
      <div className="login-form-row">
        <label className="login-label">아이디</label>
        <input
          type="text"
          name="email"
          placeholder="아이디를 입력하세요"
          className="line-input"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="login-form-row">
        <label className="login-label">비밀번호</label>
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          className="line-input"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
    </div>
  );
}
