import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./onboarding1.css";
import Navigate from "../../component/navigate";
import JoinStarIcon from "../../component/JoinStarIcon";

export default function Onboarding1() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromSplashScroll = location.state?.fromSplashScroll === true;
  const [isReturningToSplash, setIsReturningToSplash] = useState(false);
  const isNavigatingRef = useRef(false);
  const touchStartYRef = useRef(null);
  const navigateTimerRef = useRef(null);
  const [name, setName] = useState(
    () => localStorage.getItem("joinName") ?? "",
  );

  const isValid = useMemo(() => {
    const trimmed = name.trim();
    return trimmed.length > 0 && trimmed.length <= 20;
  }, [name]);

  useEffect(() => {
    localStorage.setItem("joinName", name);
  }, [name]);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current !== null) {
        window.clearTimeout(navigateTimerRef.current);
      }
    };
  }, []);

  const goToSplash = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsReturningToSplash(true);

    navigateTimerRef.current = window.setTimeout(() => {
      navigate("/splash", { state: { fromOnboardingScroll: true } });
    }, 420);
  }, [navigate]);

  const handleWheel = (event) => {
    if (event.deltaY < -12) {
      goToSplash();
    }
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event) => {
    if (touchStartYRef.current === null) return;

    const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
    if (currentY - touchStartYRef.current > 28) {
      goToSplash();
    }
  };

  return (
    <main
      className={`join1-page ${fromSplashScroll ? "join1-page-enter" : ""} ${isReturningToSplash ? "join1-page-return" : ""}`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Top Icon */}
      <div className="join1-iconWrap" aria-hidden="true">
        <JoinStarIcon />
      </div>

      {/* Card */}
      <section className="join1-card" aria-label="회원가입 1단계">
        <div className="join1-progressRow">
          <span className="join1-progressNow">01</span>
          <span className="join1-progressSlash">/</span>
          <span className="join1-progressTotal">03</span>
        </div>

        <div className="join1-titleBlock">
          <p className="join1-kicker">MONY와 함께할 첫 번째 단계</p>
          <h1 className="join1-title">회원님을 어떻게 불러 드릴까요?</h1>
        </div>

        <div className="join1-formBlock">
          <label htmlFor="join-name" className="join1-label">
            사용할 이름이나 닉네임을 알려주세요
          </label>

          <input
            id="join-name"
            name="join-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) {
                const trimmed = name.trim();
                localStorage.setItem("joinName", trimmed);
                navigate("/onboarding2", { state: { name: trimmed } });
              }
            }}
            placeholder="최대 20자"
            maxLength={20}
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
            onClick={() => {
              if (!isValid) return;
              const trimmed = name.trim();
              localStorage.setItem("joinName", trimmed);
              navigate("/onboarding2", { state: { name: trimmed } });
            }}
          >
            확인
          </button>
        </div>
      </section>

      {/* Bottom Nav */}
      <Navigate />
    </main>
  );
}
