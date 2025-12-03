import "./Profile.css";

export default function Profile() {
  return (
    <div className="profile-page">
      <h2 className="page-title">개인 정보 조회</h2>

      {/* ----- 개인정보 수정 섹션 ----- */}
      <div className="section">
        <h3 className="section-title">개인 정보 수정</h3>

        <div className="form-row">
          <label>아이디</label>
          <input type="text" readOnly />
        </div>

        <div className="form-row">
          <label>이름</label>
          <input type="text" readOnly />
        </div>

        <div className="form-row">
          <label>생년월일</label>
          <input type="text" readOnly />
        </div>

        <div className="form-row">
          <label>연락처</label>
          <input type="text" />
        </div>

        <div className="form-row">
          <label>소셜 로그인 관리</label>

          <div className="social-list">
            {/* Kakao */}
            <div className="social-item">
              <div className="social-left">
                <img className="social-icon" src="/kakaoIcon.png" alt="kakao" />
                <span>Kakao</span>
              </div>
              <button className="social-btn">연동하기</button>
            </div>

            {/* Naver */}
            <div className="social-item">
              <div className="social-left">
                <img className="social-icon" src="/naverIcon.png" alt="naver" />
                <span>Naver</span>
              </div>
              <button className="social-btn">연동하기</button>
            </div>
          </div>
        </div>

        <button className="primary-btn">개인 정보 수정</button>
      </div>

      {/* ----- 비밀번호 변경 섹션 ----- */}
      <div className="section">
        <h3 className="section-title">비밀번호 변경</h3>

        <div className="form-row">
          <label>기존 비밀번호</label>
          <input type="password" placeholder="" />
        </div>

        <div className="form-row">
          <label>새 비밀번호</label>
          <input type="password" placeholder="" />
        </div>

        <p className="hint">
          비밀번호는 공백없는 8~16자의 영문/숫자 등 두 가지 이상 조합으로
          입력해주세요.
        </p>

        <div className="form-row">
          <label>새 비밀번호 확인</label>
          <input type="password" placeholder="" />
        </div>

        <p className="hint">비밀번호 확인을 위해 한 번 더 입력해주세요.</p>

        <button className="primary-btn">비밀번호 변경</button>
      </div>
    </div>
  );
}
