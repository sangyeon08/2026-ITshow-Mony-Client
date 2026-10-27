import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buckets, goals, stats } from "../../api/index.js";
import MonyAlert from "../../component/MonyAlert";
import OnboardingLayout from "./OnboardingLayout";
import {
  formatNumericInput,
  getOnboardingUserName,
  ONBOARDING_STORAGE_KEYS,
  parseNumericInput,
  readJsonFromStorage,
} from "./onboarding.utils";
import "./onboarding3.css";

const CUSTOM_PRESET = "custom";
const MINIMUM_GOAL_AMOUNT = 1_000;
const MAXIMUM_GOAL_AMOUNT = 1_000_000_000;

const GOAL_PRESETS = [
  { label: "100,000원", value: 100_000 },
  { label: "300,000원", value: 300_000 },
  { label: "500,000원", value: 500_000 },
];

const SAVINGS_METHODS = [
  {
    key: "save",
    label: "절약한 금액 넣기",
    desc: "소비를 줄인 만큼 저금통에",
  },
  {
    key: "direct",
    label: "직접 저축하기",
    desc: "원하는 금액을 직접 적립",
  },
];

const persistSavingsSettings = (goalAmount, savingsMethod) => {
  localStorage.setItem(
    ONBOARDING_STORAGE_KEYS.savingsGoal,
    String(goalAmount),
  );
  localStorage.setItem(ONBOARDING_STORAGE_KEYS.savedAmount, "0");
  localStorage.setItem(
    ONBOARDING_STORAGE_KEYS.savingsMethod,
    savingsMethod,
  );
};

const createMonthlyGoal = async (goalAmount, selectedGoals) => {
  try {
    await goals.create({
      goal_type: selectedGoals.join(",") || "impulse",
      period_type: "monthly",
      period_detail: new Date().toISOString().slice(0, 7),
      salary_timing: null,
      target_amount: goalAmount,
    });
  } catch (error) {
    console.warn("[onboarding] goals.create 실패:", error.message);
  }
};

const createBucketGoal = async (bucketGoal) => {
  const hasValidSteps =
    bucketGoal?.bucketList &&
    Array.isArray(bucketGoal.steps) &&
    bucketGoal.steps.length === 3;

  if (!hasValidSteps) return;

  try {
    const targetAmount = Number(bucketGoal.targetAmount) || 0;
    const response = await buckets.create({
      title: bucketGoal.bucketList,
      category: bucketGoal.category,
      one: bucketGoal.steps[0].title,
      two: bucketGoal.steps[1].title,
      three: bucketGoal.steps[2].title,
      one_mony: Math.round(targetAmount / 3),
      two_mony: Math.round((targetAmount / 3) * 2),
      three_mony: targetAmount,
      mony_ing: targetAmount,
    });

    if (response?.data?.id) {
      localStorage.setItem(
        ONBOARDING_STORAGE_KEYS.primaryBucketId,
        String(response.data.id),
      );
    }
  } catch (error) {
    console.warn("[onboarding] buckets.create 실패:", error.message);
  }
};

export default function Onboarding3() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = getOnboardingUserName(location.state?.name);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [savingsMethod, setSavingsMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const goalAmount = useMemo(
    () =>
      selectedPreset === CUSTOM_PRESET
        ? parseNumericInput(customAmount)
        : selectedPreset || 0,
    [selectedPreset, customAmount],
  );

  const isValid =
    goalAmount >= MINIMUM_GOAL_AMOUNT && savingsMethod !== null;

  const selectPreset = (preset) => {
    setSelectedPreset(preset);
    if (preset !== CUSTOM_PRESET) setCustomAmount("");
  };

  const handleCustomAmountChange = (event) => {
    const nextAmount = parseNumericInput(event.target.value);
    if (nextAmount >= MAXIMUM_GOAL_AMOUNT) {
      setAlertMessage("10억 미만의 금액을 입력해주세요.");
      return;
    }
    setCustomAmount(formatNumericInput(event.target.value));
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    persistSavingsSettings(goalAmount, savingsMethod);

    const stepTwoForm = readJsonFromStorage(
      ONBOARDING_STORAGE_KEYS.stepTwoForm,
      {},
    );
    const bucketGoal = readJsonFromStorage(
      ONBOARDING_STORAGE_KEYS.bucketGoal,
      null,
    );

    await createMonthlyGoal(goalAmount, stepTwoForm.selectedGoals || []);
    await createBucketGoal(bucketGoal);
    stats.increment().catch(() => {});

    localStorage.setItem(ONBOARDING_STORAGE_KEYS.completed, "true");
    navigate("/home", { state: { name: userName } });
  };

  return (
    <OnboardingLayout
      step={3}
      kicker="저축 챌린지를 설정하는 세 번째 단계"
      title="저축 저금통을 만들어볼까요?"
      description={
        <p className="ob3-desc">
          아낀 금액이 저금통에 쌓이고, 목표에 가까워질수록 채워져요.
        </p>
      }
      overlay={
        <MonyAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      }
    >
      <div className="ob3-section">
        <p className="ob3-sectionLabel">이번 달 저축 목표</p>
        <div className="ob3-presetGrid">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`ob3-presetBtn ${
                selectedPreset === preset.value ? "is-on" : ""
              }`}
              onClick={() => selectPreset(preset.value)}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className={`ob3-presetBtn ${
              selectedPreset === CUSTOM_PRESET ? "is-on" : ""
            }`}
            onClick={() => selectPreset(CUSTOM_PRESET)}
          >
            직접 입력
          </button>
        </div>

        {selectedPreset === CUSTOM_PRESET && (
          <input
            className="join1-input ob3-customInput"
            inputMode="numeric"
            placeholder="예) 200,000"
            value={customAmount}
            autoFocus
            onChange={handleCustomAmountChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
        )}
      </div>

      <div className="ob3-section">
        <p className="ob3-sectionLabel">저축 방식</p>
        <div className="ob3-methodRow">
          {SAVINGS_METHODS.map((method) => (
            <button
              key={method.key}
              type="button"
              className={`ob3-methodBtn ${
                savingsMethod === method.key ? "is-on" : ""
              }`}
              onClick={() => setSavingsMethod(method.key)}
            >
              <span className="ob3-methodLabel">{method.label}</span>
              <span className="ob3-methodDesc">{method.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!isValid || isSubmitting}
        className={`join1-button ob3-confirmButton ${
          isValid && !isSubmitting ? "is-enabled" : "is-disabled"
        }`}
        onClick={handleSubmit}
      >
        {isSubmitting ? "저장 중..." : "확인"}
      </button>
    </OnboardingLayout>
  );
}
