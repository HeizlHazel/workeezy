const express = require("express");
const app = express();

app.use(express.json());

// 카카오 스킬 서버 엔드포인트
app.post("/skill", (req, res) => {
    const userInput = req.body.userRequest?.utterance || "입력값 없음";

    res.json({
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: { text: `당신의 입력: ${userInput}` }
                }
            ]
        }
    });
});

// 서버 실행
app.listen(3000, () => console.log("Kakao Skill Server Running on port 3000"));
