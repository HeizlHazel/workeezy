import "./SubmitButton.css";

export default function SubmitButton() {
  return (
    //  form의 onSubmit을 자동으로 실행
    <div className="submit-button">
      <button type="submit" className="button2">
        <div className="div2">신청하기</div>
      </button>
    </div>
  );
}
