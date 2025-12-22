from flask import Flask, request, jsonify
from db import get_conn

app = Flask(__name__)

def kakao_text(text: str):
    return {
        "version": "2.0",
        "template": {"outputs": [{"simpleText": {"text": text}}]},
    }

@app.get("/")
def health():
    return "OK"

@app.get("/debug/db")
def debug_db():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 AS ok")
            row = cur.fetchone()
    return row

@app.post("/skill/search_program")
def search_program():
    req = request.get_json(silent=True) or {}
    params = (req.get("action") or {}).get("detailParams") or {}
    keyword = (params.get("keyword") or {}).get("value")

    if not keyword:
        return jsonify(kakao_text("검색어를 입력해주세요. 예: 제주, 강릉, 오피스"))

    return jsonify(kakao_text(f"검색어: {keyword}"))

if __name__ == "__main__":
    # 도커에서는 gunicorn이 실행하니까 보통 안 타지만, 로컬 개발용
    app.run(host="0.0.0.0", port=8000, debug=True)
