import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./onboarding2.css";
import Check from "../../component/check";
import Navigate from "../../component/navigate";
import JoinStarIcon from "../../component/JoinStarIcon";

const buildGoals = () => [
  { key: "impulse", title: "충동구매 줄이기",    desc: "필요한 것만 사고, 즉흥 구매는 줄일래요" },
  { key: "fix",     title: "소소한 지출 관리",   desc: "배달 음식 등 작은 소비를 줄이고 싶어요" },
  { key: "balance", title: "균형 있는 소비",     desc: "소비와 저축의 균형을 맞추고 싶어요" },
  { key: "plan",    title: "계획적인 소비",      desc: "소비 기준을 정해두고 쓰고 싶어요" },
  { key: "saving",  title: "저축 습관 만들기",   desc: "꾸준한 저축으로 금융 습관을 만들고 싶어요" },
  { key: "low_fix", title: "고정 지출 관리",     desc: "매달 나가는 돈부터 정리해보고 싶어요" },
];

const GROQ_URL = "/api/groq";

const SAVINGS_PLAN_PROMPT = `당신은 MONY 앱의 저축 플래너입니다.
사용자의 버킷리스트를 이루기 위한 사회 초년생 기준의 돈 모으기 계획을 만들어줘.
반드시 아래 JSON 형식으로만 응답해.
설명 문장이나 마크다운 없이 JSON만 반환해.

{
  "category": "여행" | "취미" | "자기계발",
  "targetAmount": 숫자,
  "monthlySaving": 숫자,
  "estimatedPeriod": "문자열",
  "currentSaved": 숫자,
  "steps": [
    {
      "step": 1,
      "title": "문자열",
      "description": "문자열"
    },
    {
      "step": 2,
      "title": "문자열",
      "description": "문자열"
    },
    {
      "step": 3,
      "title": "문자열",
      "description": "문자열"
    }
  ]
}

기준:
- 사용자는 사회 초년생입니다.
- 평균 월급은 약 240만 원 ~ 300만 원으로 가정하세요.
- 월 저축 금액은 너무 과하지 않게 약 30만 원 ~ 100만 원 범위에서 현실적으로 잡으세요.
- 버킷리스트에 맞는 목표 금액, 월 저축 금액, 예상 기간을 AI가 자연스럽게 추정해서 포함하세요.
- 버킷리스트 내용을 보고 category를 반드시 여행, 취미, 자기계발 중 하나로 분류하세요.
- currentSaved는 0 또는 현실적인 초기 저축액 숫자로 작성하세요.
- 예: 집 사기라면 초기 자금 약 3,000만 원 ~ 5,000만 원, 월 50만 원 ~ 100만 원, 약 3년 ~ 5년처럼 작성하세요.

규칙:
1. 한국어로만 답변하세요. 한문, 일본어, 영어등 다른 언어는 절대 사용하지 마세요.
2. 버킷리스트 준비 과정이 아니라 저축 방법, 소비 줄이기, 목표 금액 달성 계획 중심으로 작성하세요.
3. 정확히 3단계만 작성하세요.
4. 각 단계는 짧은 제목과 1~2문장 설명으로 작성하세요.
5. 반드시 JSON 객체만 응답하세요. 다른 말은 하지 마세요.
6. 각 description에는 목표 금액, 월 저축 금액, 예상 기간 중 적어도 하나 이상의 구체적인 금액 또는 기간 정보를 포함하세요.
7. targetAmount와 monthlySaving은 숫자 타입 원 단위로 작성하세요.
8. category는 반드시 "여행", "취미", "자기계발" 중 하나의 문자열로만 작성하세요.
9. 금액은 사회 초년생 기준으로 현실적인 범위에서 임의로 추정하세요.`;

const DEFAULT_TARGET_AMOUNT = 3000000;
const DEFAULT_MONTHLY_SAVING = 300000;
const DEFAULT_PERIOD = "약 10개월";
const DEFAULT_QUICK_SAVE_AMOUNT = 5000;
const DEFAULT_BUCKET_CATEGORY = "여행";
const BUCKET_CATEGORIES = ["여행", "취미", "자기계발"];

const fallbackSavingsPlan = [
  {
    title: "1단계: 목표 금액 정하기",
    description: "버킷리스트 달성을 위한 목표 금액을 약 300만 원으로 정하고 필요한 금액을 먼저 확인해요.",
  },
  {
    title: "2단계: 월 저축 금액 정하기",
    description: "사회 초년생 기준으로 매월 약 30만 원씩 월급일에 먼저 저축하는 계획을 세워요.",
  },
  {
    title: "3단계: 저축 기간과 소비 관리하기",
    description: "약 10개월 동안 외식비와 쇼핑비를 월 5만 원씩 줄여 목표 금액에 가까워져요.",
  },
];

const fallbackBucketGoal = {
  category: DEFAULT_BUCKET_CATEGORY,
  targetAmount: DEFAULT_TARGET_AMOUNT,
  monthlySaving: DEFAULT_MONTHLY_SAVING,
  estimatedPeriod: DEFAULT_PERIOD,
  currentSaved: 0,
  steps: fallbackSavingsPlan.map((step, index) => ({
    step: index + 1,
    title: step.title.replace(/^\d+단계:\s*/, ""),
    description: step.description,
  })),
};

const buildFallbackBucketGoal = () => ({
  ...fallbackBucketGoal,
  steps: fallbackBucketGoal.steps.map((step) => ({ ...step })),
});

const hasConcreteMoneyInfo = (text) =>
  /(만\s*원|원|개월|년|월\s*\d|매월|월별|기간|저축)/.test(text);

const normalizeBucketCategory = (value) => {
  const category = String(value || "").trim();
  return BUCKET_CATEGORIES.includes(category) ? category : DEFAULT_BUCKET_CATEGORY;
};

const parseSavingsPlan = (text) => {
  try {
    const jsonText = text.match(/\{[\s\S]*\}/)?.[0] ?? text.match(/\[[\s\S]*\]/)?.[0] ?? text;
    const parsed = JSON.parse(jsonText);
    const parsedSteps = Array.isArray(parsed) ? parsed : parsed.steps;
    if (!Array.isArray(parsedSteps)) return fallbackBucketGoal;
    const steps = parsedSteps
      .slice(0, 3)
      .map((item, index) => ({
        step: Number(item.step) || index + 1,
        title: String(item.title || `${index + 1}단계`).replace(/^\d+단계:\s*/, "").trim(),
        description: String(item.description || "").trim(),
      }))
      .filter(
        (item) =>
          item.title && item.description && hasConcreteMoneyInfo(item.description)
      );
    if (steps.length !== 3) return fallbackBucketGoal;

    return {
      category: normalizeBucketCategory(parsed.category),
      targetAmount: Number(parsed.targetAmount) || DEFAULT_TARGET_AMOUNT,
      monthlySaving: Number(parsed.monthlySaving) || DEFAULT_MONTHLY_SAVING,
      estimatedPeriod: String(parsed.estimatedPeriod || DEFAULT_PERIOD).trim(),
      currentSaved: Number(parsed.currentSaved) || 0,
      steps,
    };
  } catch {
    return fallbackBucketGoal;
  }
};

const generateSavingsPlan = async (bucketList) => {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_prompt: SAVINGS_PLAN_PROMPT,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `버킷리스트: ${bucketList}
사회 초년생 기준으로 현실적인 목표 금액, 월 저축 금액, 예상 기간을 추정해서 이 목표를 이루기 위한 돈 모으기 3단계 저축 계획을 만들어줘.
버킷리스트 카테고리를 여행, 취미, 자기계발 중 하나로 분류해서 category에 넣어줘.
각 단계 설명에는 구체적인 금액 또는 기간 정보를 반드시 넣어줘.
응답은 JSON 객체만 반환해줘.`,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error || `AI 서버 연결에 실패했어요. (${res.status})`
    );
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI 응답을 받지 못했어요.");
  return parseSavingsPlan(content);
};

export default function Onboarding2() {
  const location = useLocation();
  const navigate = useNavigate();

  const routeName = location?.state?.name;
  const storedName =
    typeof window !== "undefined" ? localStorage.getItem("joinName") : "";
  const userName = (routeName || storedName || "회원").trim();

  const GOALS = useMemo(() => buildGoals(), []);

  const STORAGE_KEY = "onboarding2Form";

  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const [selectedGoals, setSelectedGoals] = useState(() => {
    const v = initial.selectedGoals ?? initial.selectedGoal ?? [];
    if (Array.isArray(v)) return v;
    return v ? [v] : [];
  });
  const [bucketList, setBucketList] = useState(initial.bucketList ?? "");
  const [quickSaveAmount, setQuickSaveAmount] = useState(() => {
    const n = Number(initial.quickSaveAmount ?? DEFAULT_QUICK_SAVE_AMOUNT);
    return n > 0 ? n.toLocaleString() : "";
  });
  const [savingsPlan, setSavingsPlan] = useState(
    Array.isArray(initial.savingsPlan) ? initial.savingsPlan : []
  );
  const [generatedPlan, setGeneratedPlan] = useState(initial.generatedPlan ?? null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState("");

  // ✅ 페이지 이동해도 값 유지
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          selectedGoals,
          bucketList,
          quickSaveAmount: Number(quickSaveAmount.replace(/[^0-9]/g, "")) || 0,
          savingsPlan,
          generatedPlan,
        })
      );
    } catch {
      // ignore
    }
  }, [selectedGoals, bucketList, quickSaveAmount, savingsPlan, generatedPlan]);

  const quickSaveAmountNumber = useMemo(
    () => Number(quickSaveAmount.replace(/[^0-9]/g, "")) || 0,
    [quickSaveAmount]
  );

  const isValid = useMemo(() => {
    return (
      selectedGoals.length > 0 &&
      bucketList.trim().length > 0 &&
      quickSaveAmountNumber > 0 &&
      savingsPlan.length === 3 &&
      generatedPlan?.steps?.length === 3
    );
  }, [selectedGoals, bucketList, quickSaveAmountNumber, savingsPlan, generatedPlan]);

  const toggleGoal = (key) => {
    setSelectedGoals((prev) => {
      const on = prev.includes(key);
      if (on) return prev.filter((x) => x !== key);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, key];
    });
  };

  const handleGeneratePlan = async () => {
    const bucket = bucketList.trim();
    if (!bucket || isGeneratingPlan) return;
    setPlanError("");
    setSavingsPlan([]);
    setGeneratedPlan(null);
    setIsGeneratingPlan(true);

    try {
      const goal = await generateSavingsPlan(bucket);
      const goalData = {
        bucketList: bucket,
        category: goal.category,
        targetAmount: goal.targetAmount,
        monthlySaving: goal.monthlySaving,
        estimatedPeriod: goal.estimatedPeriod,
        currentSaved: Number(goal.currentSaved) || 0,
        quickSaveAmount: quickSaveAmountNumber || DEFAULT_QUICK_SAVE_AMOUNT,
        steps: goal.steps,
      };

      setGeneratedPlan(goalData);
      setSavingsPlan(goal.steps);
    } catch (error) {
      const fallbackGoal = buildFallbackBucketGoal();
      const goalData = {
        bucketList: bucket,
        category: fallbackGoal.category,
        targetAmount: fallbackGoal.targetAmount,
        monthlySaving: fallbackGoal.monthlySaving,
        estimatedPeriod: fallbackGoal.estimatedPeriod,
        currentSaved: Number(fallbackGoal.currentSaved) || 0,
        quickSaveAmount: quickSaveAmountNumber || DEFAULT_QUICK_SAVE_AMOUNT,
        steps: fallbackGoal.steps,
      };

      setGeneratedPlan(goalData);
      setSavingsPlan(fallbackGoal.steps);
      setPlanError(
        error?.message
          ? `${error.message} 기본 저축 계획으로 대신 채워뒀어요.`
          : "AI 서버에 연결하지 못해 기본 저축 계획으로 대신 채워뒀어요."
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <main className="join1-page">
      <div className="join1-iconWrap" aria-hidden="true">
        <JoinStarIcon />
      </div>

      <section className="join1-card join2-card" aria-label="회원가입 2단계">
        <div className="join1-progressRow">
          <span className="join1-progressNow">02</span>
          <span className="join1-progressSlash">/</span>
          <span className="join1-progressTotal">03</span>
        </div>

        <div className="join1-titleBlock">
          <p className="join1-kicker">{userName} 님의 소비관리를 위한 두 번째 단계</p>
          <h1 className="join1-title">어떤 목표를 설정해 볼까요?</h1>
        </div>

        <div className="join2-block1">
          <p className="join2-subtitle1">만들고 싶은 목표를 선택해 주세요</p>
          <p className="join2-subhelp">최대 2개 까지 선택 할 수 있어요</p>

          <div className="goalGrid" role="list">
            {GOALS.map((g) => (
              <div key={g.key} role="listitem" className="goalItem">
                <Check
                  title={g.title}
                  description={g.desc}
                  selected={selectedGoals.includes(g.key)}
                  onClick={() => toggleGoal(g.key)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="join2-block">
          <p className="join2-subtitle">이루고 싶은 버킷리스트를 알려주세요</p>
          <p className="join2-subhelp">MONY가 목표 달성을 위한 돈 모으기 3단계를 만들어드릴게요</p>
          <input
            className="join2-amount"
            placeholder="이루고 싶은 버킷리스트를 입력하세요"
            value={bucketList}
            onChange={(e) => {
              setBucketList(e.target.value);
              setSavingsPlan([]);
              setGeneratedPlan(null);
              setPlanError("");
            }}
          />
          <button
            type="button"
            className="join2-aiButton"
            disabled={!bucketList.trim() || isGeneratingPlan}
            onClick={handleGeneratePlan}
          >
            저축 계획 생성하기
          </button>

          {isGeneratingPlan && (
            <p className="join2-loading">저축 계획을 생성하는 중...</p>
          )}

          {planError && <p className="join2-error">{planError}</p>}

          {generatedPlan && (
            <div className="join2-category" aria-label="AI가 분류한 버킷리스트 카테고리">
              <span>AI 추천 카테고리</span>
              <strong>{normalizeBucketCategory(generatedPlan.category)}</strong>
            </div>
          )}

          {savingsPlan.length > 0 && (
            <div className="join2-planList" aria-label="AI가 생성한 저축 계획">
              {savingsPlan.map((step, index) => (
                <div key={`${step.title}-${index}`} className="join2-planCard">
                  <span>{index + 1}단계</span>
                  <strong>{step.title.replace(/^\d+단계:\s*/, "")}</strong>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="join2-block">
          <p className="join2-subtitle">한 번에 얼마씩 저축할까요?</p>
          <p className="join2-subhelp">홈 저축 저금통의 적립 버튼에 표시될 금액이에요</p>
          <input
            className="join2-amount"
            inputMode="numeric"
            placeholder="예) 5,000"
            value={quickSaveAmount}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              if (digits === "") return setQuickSaveAmount("");
              const n = Number(digits);
              setQuickSaveAmount(Number.isFinite(n) ? n.toLocaleString() : "");
            }}
          />
        </div>

        <button
          type="button"
          disabled={!isValid}
          className={`join1-button ${isValid ? "is-enabled" : "is-disabled"}`}
          onClick={() => {
            if (!isValid) return;
            const goalData = {
              bucketList,
              category: normalizeBucketCategory(generatedPlan.category),
              targetAmount: generatedPlan.targetAmount,
              monthlySaving: generatedPlan.monthlySaving,
              estimatedPeriod: generatedPlan.estimatedPeriod,
              currentSaved: generatedPlan.currentSaved || 0,
              quickSaveAmount: quickSaveAmountNumber,
              steps: generatedPlan.steps,
            };

            localStorage.setItem("bucketGoal", JSON.stringify(goalData));
            localStorage.setItem("mony_quick_save_amount", String(quickSaveAmountNumber));
            navigate("/onboarding3", {
              state: {
                name: userName,
                selectedGoals,
                bucketList,
                quickSaveAmount: quickSaveAmountNumber,
                savingsPlan,
              },
            });
          }}
        >
          확인
        </button>
      </section>

      <Navigate />
    </main>
  );
}
