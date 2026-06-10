import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;

app.post("/api/groq", async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: "VITE_GROQ_API_KEY가 설정되지 않았어요.",
      });
    }

    if (!Array.isArray(req.body.contents)) {
      return res.status(400).json({
        error: "contents 배열이 필요해요.",
      });
    }

    const messages = [
      {
        role: "system",
        content: req.body.system_prompt,
      },

      ...req.body.contents.map((item) => ({
        role:
          item.role === "model"
            ? "assistant"
            : "user",

        content: item.parts[0].text,
      })),
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${GROQ_API_KEY}`,
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages,

          temperature: 0.7,

          max_tokens: 400,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Groq 응답:",
      JSON.stringify(data).slice(0, 200)
    );

    res.status(response.status).json(data);

  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: e.message,
    });
  }
});

app.listen(3001, () => {
  console.log(
    "✅ Groq 서버 실행중: http://localhost:3001"
  );
});
