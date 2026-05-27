import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

app.post("/api/gemini", async (req, res) => {
  try {
    // 첫 메시지에 시스템 프롬프트 합치기
    const contents = req.body.contents;
    if (contents && contents.length === 1) {
      contents[0].parts[0].text = req.body.system_prompt + "\n\n" + contents[0].parts[0].text;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      }
    );
    const data = await response.json();
    console.log("Gemini 응답:", JSON.stringify(data).slice(0, 200));
    res.json(data);
  } catch (e) {
    console.error("에러:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log("✅ 프록시 서버 실행중: http://localhost:3001"));