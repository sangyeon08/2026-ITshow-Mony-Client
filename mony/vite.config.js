import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const fallbackJsonPlan = JSON.stringify({
  category: "여행",
  targetAmount: 3000000,
  monthlySaving: 300000,
  estimatedPeriod: "약 10개월",
  currentSaved: 0,
  steps: [
    {
      step: 1,
      title: "목표 금액 정하기",
      description:
        "버킷리스트 달성을 위한 목표 금액을 약 300만 원으로 정하고 필요한 금액을 먼저 확인해요.",
    },
    {
      step: 2,
      title: "월 저축 금액 정하기",
      description:
        "사회 초년생 기준으로 매월 약 30만 원씩 월급일에 먼저 저축하는 계획을 세워요.",
    },
    {
      step: 3,
      title: "저축 기간과 소비 관리하기",
      description:
        "약 10개월 동안 외식비와 쇼핑비를 월 5만 원씩 줄여 목표 금액에 가까워져요.",
    },
  ],
});

const fallbackText =
  "AI 서버 설정을 확인하지 못해 기본 안내로 답변할게요. 현재 입력한 목표를 기준으로 매월 일정 금액을 먼저 저축하고, 남은 기간 동안 식비와 쇼핑비를 조금씩 줄이면 목표에 더 안정적으로 가까워질 수 있어요.";

const localApiState = {
  goals: [],
  buckets: [],
  nextGoalId: 1,
  nextBucketId: 1,
};

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function createFallbackResponse(body) {
  const wantsJson = String(body?.system_prompt || "").includes("JSON");

  return {
    choices: [
      {
        message: {
          content: wantsJson ? fallbackJsonPlan : fallbackText,
        },
      },
    ],
  };
}

function normalizeBucket(bucket) {
  const monyIng = Number(bucket.mony_ing ?? bucket.targetAmount ?? 0) || 0;
  const monyFinish = Number(bucket.mony_finish ?? 0) || 0;

  return {
    id: bucket.id,
    title: bucket.title || "버킷리스트 목표",
    category: ["여행", "취미", "자기계발"].includes(bucket.category)
      ? bucket.category
      : "여행",
    one: bucket.one || "목표 금액 정하기",
    two: bucket.two || "월 저축 금액 정하기",
    three: bucket.three || "소비 관리하기",
    one_mony: Number(bucket.one_mony ?? Math.round(monyIng / 3)) || 0,
    two_mony: Number(bucket.two_mony ?? Math.round((monyIng / 3) * 2)) || 0,
    three_mony: Number(bucket.three_mony ?? monyIng) || 0,
    mony_ing: monyIng,
    mony_finish: monyFinish,
    probability:
      monyIng > 0 ? Math.min(Math.round((monyFinish / monyIng) * 100), 100) : 0,
    img: bucket.img || "",
    day: bucket.day || new Date().toISOString().slice(0, 10),
    created_at: bucket.created_at || new Date().toISOString(),
  };
}

function getDefaultAnalysis() {
  return {
    total: 326000,
    fixed: 154800,
    variable: 171200,
  };
}

function groqApiPlugin(apiKey) {
  return {
    name: "mony-groq-api",
    configureServer(server) {
      server.middlewares.use("/api/groq", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "POST 요청만 지원해요." });
          return;
        }

        let body;

        try {
          body = await readJsonBody(req);
        } catch {
          sendJson(res, 400, { error: "요청 본문을 읽지 못했어요." });
          return;
        }

        if (!apiKey) {
          sendJson(res, 200, createFallbackResponse(body));
          return;
        }

        try {
          const messages = [
            { role: "system", content: body.system_prompt || "" },
            ...(Array.isArray(body.contents) ? body.contents : []).map(
              (item) => ({
                role: item.role === "model" ? "assistant" : "user",
                content: item.parts?.[0]?.text || "",
              }),
            ),
          ];

          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages,
                temperature: 0.7,
                max_tokens: 400,
              }),
            },
          );

          const data = await response.json().catch(() => null);

          if (!response.ok || !data?.choices) {
            sendJson(res, 200, createFallbackResponse(body));
            return;
          }

          sendJson(res, 200, data);
        } catch {
          sendJson(res, 200, createFallbackResponse(body));
        }
      });
    },
  };
}

function localApiPlugin() {
  return {
    name: "mony-local-api",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        const url = new URL(req.url || "/", "http://localhost");
        const pathname = url.pathname;
        const method = req.method || "GET";

        if (pathname === "/groq") {
          next();
          return;
        }

        let body = {};

        if (["POST", "PATCH", "PUT"].includes(method)) {
          try {
            body = await readJsonBody(req);
          } catch {
            sendJson(res, 400, {
              success: false,
              message: "요청 본문을 읽지 못했어요.",
            });
            return;
          }
        }

        if (pathname === "/runtime" && method === "GET") {
          sendJson(res, 200, { serverStartedAt: Date.now() });
          return;
        }

        if (pathname === "/accounts" && method === "GET") {
          sendJson(res, 200, {
            success: true,
            message: "0개의 계좌를 조회했습니다",
            data: [],
            count: 0,
          });
          return;
        }

        if (pathname === "/accounts" && method === "POST") {
          const account = {
            id: Date.now(),
            ...body,
            created_at: new Date().toISOString(),
          };
          sendJson(res, 201, {
            success: true,
            message: "계좌가 생성되었습니다",
            data: account,
          });
          return;
        }

        if (pathname === "/goals" && method === "GET") {
          sendJson(res, 200, {
            success: true,
            message: `${localApiState.goals.length}개의 목표를 조회했습니다`,
            data: localApiState.goals,
            count: localApiState.goals.length,
          });
          return;
        }

        if (pathname === "/goals" && method === "POST") {
          const goal = {
            id: localApiState.nextGoalId++,
            user_id: req.headers["user-id"] || "local-user",
            ...body,
            created_at: new Date().toISOString(),
          };
          localApiState.goals.unshift(goal);
          sendJson(res, 201, {
            success: true,
            message: "목표가 생성되었습니다",
            data: goal,
          });
          return;
        }

        if (pathname.startsWith("/goals/progress") && method === "GET") {
          sendJson(res, 200, {
            success: true,
            data: {
              target_amount: localApiState.goals[0]?.target_amount || 100000,
              spent_amount: 326000,
              progress: 78,
            },
          });
          return;
        }

        if (pathname === "/buckets" && method === "GET") {
          sendJson(res, 200, {
            success: true,
            message: `${localApiState.buckets.length}개의 버킷리스트를 조회했습니다`,
            data: localApiState.buckets,
            count: localApiState.buckets.length,
          });
          return;
        }

        if (pathname === "/buckets" && method === "POST") {
          const bucket = normalizeBucket({
            id: localApiState.nextBucketId++,
            ...body,
          });
          localApiState.buckets.unshift(bucket);
          sendJson(res, 201, {
            success: true,
            message: "버킷리스트가 생성되었습니다",
            data: bucket,
          });
          return;
        }

        if (pathname === "/buckets/status/all" && method === "GET") {
          const done = localApiState.buckets.filter(
            (bucket) => bucket.probability >= 100,
          );
          const doing = localApiState.buckets.filter(
            (bucket) => bucket.probability < 100,
          );
          sendJson(res, 200, {
            success: true,
            done,
            doing,
            doneCount: done.length,
            doingCount: doing.length,
          });
          return;
        }

        const bucketMatch = pathname.match(/^\/buckets\/([^/]+)(?:\/([^/]+))?$/);

        if (bucketMatch) {
          const id = String(bucketMatch[1]);
          const action = bucketMatch[2];
          const bucketIndex = localApiState.buckets.findIndex(
            (bucket) => String(bucket.id) === id,
          );
          const bucket = localApiState.buckets[bucketIndex];

          if (!bucket) {
            sendJson(res, 404, {
              success: false,
              message: "버킷을 찾을 수 없습니다",
            });
            return;
          }

          if (!action && method === "GET") {
            sendJson(res, 200, { success: true, data: bucket });
            return;
          }

          if (action === "deposit" && method === "PATCH") {
            const amount = Number(body.amount) || 0;
            const updated = normalizeBucket({
              ...bucket,
              mony_finish: bucket.mony_finish + Math.max(amount, 0),
            });
            localApiState.buckets[bucketIndex] = updated;
            sendJson(res, 200, {
              success: true,
              message: "저축 금액이 업데이트되었습니다",
              data: updated,
            });
            return;
          }

          if (action === "money" && method === "PATCH") {
            const updated = normalizeBucket({
              ...bucket,
              mony_finish: Number(body.mony_finish) || 0,
            });
            localApiState.buckets[bucketIndex] = updated;
            sendJson(res, 200, {
              success: true,
              message: "버킷 금액이 업데이트되었습니다",
              data: updated,
            });
            return;
          }

          if (action === "probability" && method === "PATCH") {
            const updated = {
              ...bucket,
              probability: Math.min(Number(body.probability) || 0, 100),
            };
            localApiState.buckets[bucketIndex] = updated;
            sendJson(res, 200, {
              success: true,
              message: "달성률이 업데이트되었습니다",
              data: updated,
            });
            return;
          }

          if (action === "doing" && method === "POST") {
            sendJson(res, 200, {
              success: true,
              message: "진행 중 버킷으로 설정되었습니다",
              data: bucket,
            });
            return;
          }
        }

        if (pathname.startsWith("/analysis/summary/") && method === "GET") {
          sendJson(res, 200, {
            success: true,
            data: getDefaultAnalysis(),
          });
          return;
        }

        if (pathname.startsWith("/analysis/category/") && method === "GET") {
          sendJson(res, 200, {
            success: true,
            data: [
              { category: "식비", total: 180000 },
              { category: "쇼핑", total: 120000 },
              { category: "교통", total: 26000 },
            ],
          });
          return;
        }

        if (pathname.startsWith("/analysis/goal-category/") && method === "GET") {
          sendJson(res, 200, {
            success: true,
            categories: [
              { category: "식비", total: 180000 },
              { category: "쇼핑", total: 120000 },
            ],
          });
          return;
        }

        if (pathname.startsWith("/analysis/daily/") && method === "GET") {
          sendJson(res, 200, {
            success: true,
            data: [],
          });
          return;
        }

        if (pathname.startsWith("/analysis/uncategorized/") && method === "GET") {
          sendJson(res, 200, {
            success: true,
            data: [],
          });
          return;
        }

        sendJson(res, 404, {
          success: false,
          message: `Route ${method} /api${pathname} not found`,
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), groqApiPlugin(env.VITE_GROQ_API_KEY), localApiPlugin()],
  };
});
