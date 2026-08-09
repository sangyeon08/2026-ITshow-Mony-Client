import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Check from "../../component/check";
import MonyAlert from "../../component/MonyAlert";
import OnboardingLayout from "./OnboardingLayout";
import {
  formatNumericInput,
  getOnboardingUserName,
  ONBOARDING_STORAGE_KEYS,
  parseNumericInput,
  readJsonFromStorage,
  writeJsonToStorage,
} from "./onboarding.utils";
import {
  createFallbackBucketGoal,
  DEFAULT_QUICK_SAVE_AMOUNT,
  generateSavingsPlan,
  normalizeBucketCategory,
} from "./savingsPlan";
import "./onboarding2.css";

const MAX_SELECTED_GOALS = 2;

const GOALS = [
  {
    key: "impulse",
    title: "충동구매 줄이기",
    desc: "필요한 것만 사고, 즉흥 구매는 줄일래요",
  },
  {
    key: "fix",
    title: "소소한 지출 관리",
    desc: "배달 음식 등 작은 소비를 줄이고 싶어요",
  },
  {
    key: "balance",
    title: "균형 있는 소비",
    desc: "소비와 저축의 균형을 맞추고 싶어요",
  },
  {
    key: "plan",
    title: "계획적인 소비",
    desc: "소비 기준을 정해두고 쓰고 싶어요",
  },
  {
    key: "saving",
    title: "저축 습관 만들기",
    desc: "꾸준한 저축으로 금융 습관을 만들고 싶어요",
  },
  {
    key: "low_fix",
    title: "고정 지출 관리",
    desc: "매달 나가는 돈부터 정리해보고 싶어요",
  },
];

const normalizeSelectedGoals = (form) => {
  const value = form.selectedGoals ?? form.selectedGoal ?? [];
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

const buildGoalData = (bucketList, plan, quickSaveAmount) => ({
  bucketList: bucketList.trim(),
  category: normalizeBucketCategory(plan.category),
  targetAmount: plan.targetAmount,
  monthlySaving: plan.monthlySaving,
  estimatedPeriod: plan.estimatedPeriod,
  currentSaved: Number(plan.currentSaved) || 0,
  quickSaveAmount: quickSaveAmount || DEFAULT_QUICK_SAVE_AMOUNT,
  steps: plan.steps,
});

function GoalSelection({ selectedGoals, onToggle }) {
  return (
    <div className="join2-block1">
      <p className="join2-subtitle1">만들고 싶은 목표를 선택해 주세요</p>
      <p className="join2-subhelp">최대 2개까지 선택할 수 있어요</p>

      <div className="goalGrid" role="list">
        {GOALS.map((goal) => (
          <div key={goal.key} role="listitem" className="goalItem">
            <Check
              title={goal.title}
              description={goal.desc}
              selected={selectedGoals.includes(goal.key)}
              onClick={() => onToggle(goal.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsPlanSection({
  bucketList,
  generatedPlan,
  savingsPlan,
  isGenerating,
  error,
  onBucketListChange,
  onGenerate,
}) {
  return (
    <div className="join2-block">
      <p className="join2-subtitle">이루고 싶은 버킷리스트를 알려주세요</p>
      <p className="join2-subhelp">
        MONY가 목표 달성을 위한 돈 모으기 3단계를 만들어드릴게요
      </p>

      <input
        className="join2-amount"
        placeholder="이루고 싶은 버킷리스트를 입력하세요"
        value={bucketList}
        onChange={(event) => onBucketListChange(event.target.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            bucketList.trim() &&
            !isGenerating
          ) {
            onGenerate();
          }
        }}
      />

      <button
        type="button"
        className="join2-aiButton"
        disabled={!bucketList.trim() || isGenerating}
        onClick={onGenerate}
      >
        {isGenerating ? "생성 중..." : "저축 계획 생성하기"}
      </button>

      {isGenerating && (
        <p className="join2-loading">저축 계획을 생성하는 중...</p>
      )}
      {error && <p className="join2-error">{error}</p>}

      {generatedPlan && (
        <div
          className="join2-category"
          aria-label="AI가 분류한 버킷리스트 카테고리"
        >
          <span>AI 추천 카테고리</span>
          <strong>{normalizeBucketCategory(generatedPlan.category)}</strong>
        </div>
      )}

      {savingsPlan.length > 0 && (
        <div className="join2-planList" aria-label="AI가 생성한 저축 계획">
          {savingsPlan.map((step, index) => (
            <div key={step.step ?? index} className="join2-planCard">
              <span>{index + 1}단계</span>
              <strong>{step.title.replace(/^\d+단계:\s*/, "")}</strong>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickSaveSection({ value, onChange }) {
  return (
    <div className="join2-block">
      <p className="join2-subtitle">한 번에 얼마씩 저축할까요?</p>
      <p className="join2-subhelp">
        홈 저축 저금통의 적립 버튼에 표시될 금액이에요
      </p>
      <input
        className="join2-amount"
        inputMode="numeric"
        placeholder="예) 5,000"
        value={value}
        onChange={(event) => onChange(formatNumericInput(event.target.value))}
      />
    </div>
  );
}

export default function Onboarding2() {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = getOnboardingUserName(location.state?.name);
  const initialForm = useMemo(
    () => readJsonFromStorage(ONBOARDING_STORAGE_KEYS.stepTwoForm, {}),
    [],
  );

  const [selectedGoals, setSelectedGoals] = useState(() =>
    normalizeSelectedGoals(initialForm),
  );
  const [bucketList, setBucketList] = useState(initialForm.bucketList ?? "");
  const [quickSaveAmount, setQuickSaveAmount] = useState(() =>
    formatNumericInput(

      initialForm.quickSaveAmount ?? DEFAULT_QUICK_SAVE_AMOUNT,
    ),
  );
  const [savingsPlan, setSavingsPlan] = useState(() =>
    Array.isArray(initialForm.savingsPlan) ? initialForm.savingsPlan : [],
  );
  const [generatedPlan, setGeneratedPlan] = useState(
    initialForm.generatedPlan ?? null,
  );
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  const quickSaveAmountNumber = useMemo(
    () => parseNumericInput(quickSaveAmount),
    [quickSaveAmount],
  );

  const isValid =
    selectedGoals.length > 0 &&
    bucketList.trim().length > 0 &&
    quickSaveAmountNumber > 0 &&
    savingsPlan.length === 3 &&
    generatedPlan?.steps?.length === 3;

  useEffect(() => {
    writeJsonToStorage(ONBOARDING_STORAGE_KEYS.stepTwoForm, {
      selectedGoals,
      bucketList,
      quickSaveAmount: quickSaveAmountNumber,
      savingsPlan,
      generatedPlan,
    });
  }, [
    selectedGoals,
    bucketList,
    quickSaveAmountNumber,
    savingsPlan,
    generatedPlan,
  ]);

  const toggleGoal = (key) => {
    setSelectedGoals((currentGoals) => {
      if (currentGoals.includes(key)) {
        return currentGoals.filter((goal) => goal !== key);
      }
      if (currentGoals.length >= MAX_SELECTED_GOALS) return currentGoals;
      return [...currentGoals, key];
    });
  };

  const resetGeneratedPlan = () => {
    setSavingsPlan([]);
    setGeneratedPlan(null);
    setPlanError("");
  };

  const handleBucketListChange = (value) => {
    setBucketList(value);
    resetGeneratedPlan();
  };

  const handleGeneratePlan = async () => {
    const trimmedBucketList = bucketList.trim();
    if (!trimmedBucketList || isGeneratingPlan) return;

    resetGeneratedPlan();
    setIsGeneratingPlan(true);

    try {
      const plan = await generateSavingsPlan(trimmedBucketList);
      const goalData = buildGoalData(
        trimmedBucketList,
        plan,
        quickSaveAmountNumber,
      );
      setGeneratedPlan(goalData);
      setSavingsPlan(goalData.steps);
    } catch (error) {
      if (error?.isValidationError) {
        setAlertMessage(error.message);
        return;
      }

      const fallbackPlan = createFallbackBucketGoal();
      const goalData = buildGoalData(
        trimmedBucketList,
        fallbackPlan,
        quickSaveAmountNumber,
      );
      setGeneratedPlan(goalData);
      setSavingsPlan(goalData.steps);
      setPlanError(
        error?.message
          ? `${error.message} 기본 저축 계획으로 대신 채워뒀어요.`
          : "AI 서버에 연결하지 못해 기본 저축 계획으로 대신 채워뒀어요.",
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleContinue = () => {
    if (!isValid) return;

    const goalData = buildGoalData(
      bucketList,
      generatedPlan,
      quickSaveAmountNumber,
    );
    writeJsonToStorage(ONBOARDING_STORAGE_KEYS.bucketGoal, goalData);
    localStorage.setItem(
      ONBOARDING_STORAGE_KEYS.quickSaveAmount,
      String(quickSaveAmountNumber),
    );

    navigate("/onboarding3", {
      state: {
        name: userName,
        selectedGoals,
        bucketList,
        quickSaveAmount: quickSaveAmountNumber,
        savingsPlan,
      },
    });
  };

  return (
    <OnboardingLayout
      step={2}
      kicker={`${userName} 님의 소비관리를 위한 두 번째 단계`}
      title="어떤 목표를 설정해 볼까요?"
      overlay={
        <MonyAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      }
      cardClassName="join2-card"
    >
      <GoalSelection
        selectedGoals={selectedGoals}
        onToggle={toggleGoal}
      />
      <SavingsPlanSection
        bucketList={bucketList}
        generatedPlan={generatedPlan}
        savingsPlan={savingsPlan}
        isGenerating={isGeneratingPlan}
        error={planError}
        onBucketListChange={handleBucketListChange}
        onGenerate={handleGeneratePlan}
      />
      <QuickSaveSection
        value={quickSaveAmount}
        onChange={setQuickSaveAmount}
      />

      <button
        type="button"
        disabled={!isValid}
        className={`join1-button ${isValid ? "is-enabled" : "is-disabled"}`}
        onClick={handleContinue}
      >
        확인
      </button>
    </OnboardingLayout>
  );
}
