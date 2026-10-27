const GROQ_URL = "/api/groq";

const DEFAULT_TARGET_AMOUNT = 3_000_000;
const DEFAULT_MONTHLY_SAVING = 300_000;
const DEFAULT_PERIOD = "약 10개월";
const DEFAULT_BUCKET_CATEGORY = "여행";
const BUCKET_CATEGORIES = ["여행", "취미", "자기계발"];

export const DEFAULT_QUICK_SAVE_AMOUNT = 5_000;

const SAVINGS_PLAN_PROMPT = `당신은 MONY 앱의 저축 플래너입니다.
사용자가 입력한 버킷리스트를 검토하고, 적합한 경우 저축 계획을 만들어줘.
반드시 아래 중 하나의 JSON 형식으로만 응답해. 설명 문장이나 마크다운 없이 JSON만 반환해.

[입력 검토 기준 — 먼저 판단하세요]
다음 중 하나에 해당하면 즉시 오류 JSON으로 응답하세요:
- 욕설·비속어·성적 표현·혐오 표현이 포함된 경우 (언어 불문)
- 의미를 알 수 없는 무작위 문자·숫자 나열인 경우 (예: "ㅁㄴㅇㄹ", "1234", "asdf")
- 여행, 취미, 자기계발 세 카테고리 어디에도 해석할 수 없는 내용인 경우
  - 여행: 국내외 여행, 배낭여행, 항공, 숙소, 관광, 워케이션 등
  - 취미: 악기, 운동, 독서, 요리, 게임, 반려동물, 공연·전시 관람, 수집, 물건 구매, 무언가를 사기 등
  - 자기계발: 자격증, 어학, 학습, 창업, 건강 관리, 재테크 공부 등
- 저축·목표와 전혀 관계없는 단순 감탄사·낙서인 경우

오류 응답 형식:
{"error": true, "message": "버킷리스트 목표로 적합하지 않은 내용이에요. 여행·취미·자기계발과 관련된 목표를 입력해주세요."}

[정상 응답 형식]
입력이 적합하면 아래 JSON으로만 응답하세요:
{
  "category": "여행" | "취미" | "자기계발",
  "targetAmount": 숫자,
  "monthlySaving": 숫자,
  "estimatedPeriod": "문자열",
  "currentSaved": 숫자,
  "steps": [
    { "step": 1, "title": "문자열", "description": "문자열" },
    { "step": 2, "title": "문자열", "description": "문자열" },
    { "step": 3, "title": "문자열", "description": "문자열" }
  ]
}

기준:
- 사용자는 사회 초년생입니다.
- 평균 월급은 약 240만 원 ~ 300만 원으로 가정하세요.
- 월 저축 금액은 너무 과하지 않게 약 30만 원 ~ 100만 원 범위에서 현실적으로 잡으세요.
- 버킷리스트에 맞는 목표 금액, 월 저축 금액, 예상 기간을 AI가 자연스럽게 추정해서 포함하세요.
- currentSaved는 0 또는 현실적인 초기 저축액 숫자로 작성하세요.

규칙:
1. 한국어로만 답변하세요. 다른 언어 단어도 한국어로 해석해서 작성하세요.
2. 저축 방법, 소비 줄이기, 목표 금액 달성 계획 중심으로 작성하세요.
3. 정확히 3단계만 작성하세요.
4. 각 단계는 짧은 제목과 1~2문장 설명으로 작성하세요.
5. 반드시 JSON 객체만 응답하세요. 다른 말은 하지 마세요.
6. 각 description에는 목표 금액, 월 저축 금액, 예상 기간 중 적어도 하나 이상의 구체적인 정보를 포함하세요.
7. targetAmount와 monthlySaving은 숫자 타입 원 단위로 작성하세요.
8. category는 반드시 "여행", "취미", "자기계발" 중 하나로만 작성하세요.
9. 답변을 한국어로 한번 더 번역하세요. 절대 영어, 한자, 일어, 외국어로 된 단어는 포함하지 마세요.`;

const FALLBACK_STEPS = [
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
];

export const createFallbackBucketGoal = () => ({
  category: DEFAULT_BUCKET_CATEGORY,
  targetAmount: DEFAULT_TARGET_AMOUNT,
  monthlySaving: DEFAULT_MONTHLY_SAVING,
  estimatedPeriod: DEFAULT_PERIOD,
  currentSaved: 0,
  steps: FALLBACK_STEPS.map((step) => ({ ...step })),
});

export const normalizeBucketCategory = (value) => {
  const category = String(value || "").trim();
  return BUCKET_CATEGORIES.includes(category)
    ? category
    : DEFAULT_BUCKET_CATEGORY;
};

const containsMoneyOrPeriod = (text) =>
  /(만\s*원|원|개월|년|월\s*\d|매월|월별|기간|저축)/.test(text);

const extractJson = (text) =>
  text.match(/\{[\s\S]*\}/)?.[0] ??
  text.match(/\[[\s\S]*\]/)?.[0] ??
  text;

const parseSavingsPlan = (text) => {
  try {
    const parsed = JSON.parse(extractJson(text));

    if (parsed.error === true) {
      const validationError = new Error(
        parsed.message || "적합하지 않은 버킷리스트 입력이에요.",
      );
      validationError.isValidationError = true;
      throw validationError;
    }

    const rawSteps = Array.isArray(parsed) ? parsed : parsed.steps;
    if (!Array.isArray(rawSteps)) return createFallbackBucketGoal();

    const steps = rawSteps
      .slice(0, 3)
      .map((item, index) => ({
        step: Number(item.step) || index + 1,
        title: String(item.title || `${index + 1}단계`)
          .replace(/^\d+단계:\s*/, "")
          .trim(),
        description: String(item.description || "").trim(),
      }))
      .filter(
        ({ title, description }) =>
          title && description && containsMoneyOrPeriod(description),
      );

    if (steps.length !== 3) return createFallbackBucketGoal();

    return {
      category: normalizeBucketCategory(parsed.category),
      targetAmount: Number(parsed.targetAmount) || DEFAULT_TARGET_AMOUNT,
      monthlySaving: Number(parsed.monthlySaving) || DEFAULT_MONTHLY_SAVING,
      estimatedPeriod: String(
        parsed.estimatedPeriod || DEFAULT_PERIOD,
      ).trim(),
      currentSaved: Number(parsed.currentSaved) || 0,
      steps,
    };
  } catch (error) {
    if (error?.isValidationError) throw error;
    return createFallbackBucketGoal();
  }
};

export const generateSavingsPlan = async (bucketList) => {
  const response = await fetch(GROQ_URL, {
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

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error || `AI 서버 연결에 실패했어요. (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI 응답을 받지 못했어요.");

  return parseSavingsPlan(content);
};
