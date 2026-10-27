export const ONBOARDING_STORAGE_KEYS = {
  name: "joinName",
  stepTwoForm: "onboarding2Form",
  bucketGoal: "bucketGoal",
  quickSaveAmount: "mony_quick_save_amount",
  savingsGoal: "mony_savings_goal",
  savedAmount: "mony_saved_amount",
  savingsMethod: "mony_savings_method",
  primaryBucketId: "mony_primary_bucket_id",
  completed: "onboardingCompleted",
};

export const readJsonFromStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJsonToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing or when quota is exceeded.
  }
};

export const parseNumericInput = (value) =>
  Number(String(value).replace(/\D/g, "")) || 0;

export const formatNumericInput = (value) => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";

  const amount = Number(digits);
  return Number.isFinite(amount) ? amount.toLocaleString() : "";
};

export const getOnboardingUserName = (routeName) => {
  const storedName = localStorage.getItem(ONBOARDING_STORAGE_KEYS.name);
  return (routeName || storedName || "회원").trim();
};
