import "./LoginInputs.css";

export default function LoginInputs() {
  return (
    <div className="component-5">
      <div className="input-field">
        <div className="label">아이디</div>
        <div className="input">
          <input
            className="value"
            type="text"
            name="email"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>
      </div>
      <div className="input-field2">
        <div className="label">비밀번호</div>
        <div className="input2">
          <input
            className="value"
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
      </div>
    </div>
  );
}
