from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

SPRING_BASE = os.getenv("SPRING_BASE", "http://127.0.0.1:8080")

@app.route("/", methods=["GET"])
def index():
    return "OK"

@app.route("/health", methods=["GET"])
def health():
    return "OK"

@app.route("/skill", methods=["POST"])
def skill():
    body = request.get_json(force=True)
    utterance = body.get("userRequest", {}).get("utterance", "").strip()

    # 아주 단순하게: "검색 <키워드>"면 검색 호출
    keyword = utterance
    if utterance.startswith("검색 "):
        keyword = utterance.replace("검색 ", "", 1).strip()

    # Spring 챗봇 검색 호출
    try:
        r = requests.get(
            f"{SPRING_BASE}/api/chat/search",
            params={"keyword": keyword},
            timeout=3
        )
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        return jsonify({
            "version": "2.0",
            "template": {
                "outputs": [{
                    "simpleText": {
                        "text": f"서버 검색 중 오류가 났어 😢\n({type(e).__name__})"
                    }
                }]
            }
        })

    # ✅ 여기부터는 SearchResultDto 구조에 맞춰 꺼내야 함
    # 일단 흔한 형태를 가정해서 안전하게 처리 (키 이름이 다르면 아래 매핑만 바꾸면 됨)
    programs = (
            data.get("programs")
            or data.get("results")
            or data.get("items")
            or []
    )

    if not programs:
        text = f"'{keyword}' 검색 결과가 없어."
    else:
        # 상위 3개만 텍스트로
        lines = []
        for p in programs[:3]:
            title = p.get("programTitle") or p.get("title") or "제목없음"
            price = p.get("programPrice") or p.get("price")
            region = p.get("region")
            one = f"- {title}"
            if region:
                one += f" ({region})"
            if price is not None:
                one += f" / {price}원"
            lines.append(one)

        text = "검색 결과야 👇\n" + "\n".join(lines)

    return jsonify({
        "version": "2.0",
        "template": {
            "outputs": [{
                "simpleText": {"text": text}
            }]
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
