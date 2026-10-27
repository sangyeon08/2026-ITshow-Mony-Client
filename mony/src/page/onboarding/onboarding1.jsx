import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MonyAlert from "../../component/MonyAlert";
import OnboardingLayout from "./OnboardingLayout";
import { ONBOARDING_STORAGE_KEYS } from "./onboarding.utils";
import "./onboarding1.css";

const MAX_NAME_LENGTH = 6;
const SPLASH_NAVIGATION_DELAY = 420;

export default function Onboarding1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(
    () => localStorage.getItem(ONBOARDING_STORAGE_KEYS.name) ?? "",
  );
  const [alertMessage, setAlertMessage] = useState(null);
  const [isReturningToSplash, setIsReturningToSplash] = useState(false);
  const isNavigatingRef = useRef(false);
  const touchStartYRef = useRef(null);
  const navigateTimerRef = useRef(null);

  const isValid = useMemo(() => {
    const trimmedName = name.trim();
    return trimmedName.length > 0 && trimmedName.length <= MAX_NAME_LENGTH;
  }, [name]);

  useEffect(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEYS.name, name);
  }, [name]);

  useEffect(
    () => () => {
      if (navigateTimerRef.current !== null) {
        window.clearTimeout(navigateTimerRef.current);
      }
    },
    [],
  );

  const continueOnboarding = useCallback(() => {
    if (!isValid) return;

    const trimmedName = name.trim();
    localStorage.setItem(ONBOARDING_STORAGE_KEYS.name, trimmedName);
    navigate("/onboarding2", { state: { name: trimmedName } });
  }, [isValid, name, navigate]);

  const returnToSplash = useCallback(() => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    setIsReturningToSplash(true);
    navigateTimerRef.current = window.setTimeout(() => {
      navigate("/splash", { state: { fromOnboardingScroll: true } });
    }, SPLASH_NAVIGATION_DELAY);
  }, [navigate]);

  const handleNameChange = (event) => {
    const nextName = event.target.value;
    if (nextName.length > MAX_NAME_LENGTH) {
      setAlertMessage(`이름은 최대 ${MAX_NAME_LENGTH}글자까지 입력할 수 있어요.`);
      return;
    }
    setName(nextName);
  };

  const handleWheel = (event) => {
    if (event.deltaY < -12) returnToSplash();
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event) => {
    if (touchStartYRef.current === null) return;

    const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
    if (currentY - touchStartYRef.current > 28) returnToSplash();
  };

  const pageClassName = [
    location.state?.fromSplashScroll && "join1-page-enter",
    isReturningToSplash && "join1-page-return",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <OnboardingLayout
      step={1}
      kicker="MONY와 함께할 첫 번째 단계"
      title="회원님을 어떻게 불러 드릴까요?"
      overlay={
        <MonyAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      }
      pageClassName={pageClassName}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="join1-formBlock">
        <label htmlFor="join-name" className="join1-label">
          사용할 이름이나 닉네임을 알려주세요
        </label>

        <input
          id="join-name"
          name="join-name"
          value={name}
          onChange={handleNameChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") continueOnboarding();
          }}
          placeholder={`최대 ${MAX_NAME_LENGTH}자`}
          autoComplete="nickname"
          className="join1-input"
        />

        <p className="join1-helper">
          입력한 이름 · 닉네임으로 기록이 저장돼요
        </p>

        <button
          type="button"
          disabled={!isValid}
          className={`join1-button ${isValid ? "is-enabled" : "is-disabled"}`}
          onClick={continueOnboarding}
        >
          확인
        </button>
      </div>
    </OnboardingLayout>
  );
}
