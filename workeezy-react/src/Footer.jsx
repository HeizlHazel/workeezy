import "./Frame1.css";

export const Frame1 = ({ className, ...props }) => {
  return (
    <div className={"frame-1 " + className}>
      <div className="workeezy">Workeezy </div>
      <div className="_123-87-26531-1578-9846-email-workeezy-3333-gmail-com-workeezy-corp">
        (주)워키지
        <br />
        <br />
        사업자등록번호: 123-87-26531
        <br />
        <br />
        전화번호: 1578-9846
        <br />
        <br />
        Email: workeezy3333@gmail.com
        <br />
        <br />
        <br />
        워키지소개 | 이용약관 | 개인정보처리방침 | 이메일무단수집금지 | 고객센터
        | ⓒ Workeezy Corp.{" "}
      </div>
    </div>
  );
};
