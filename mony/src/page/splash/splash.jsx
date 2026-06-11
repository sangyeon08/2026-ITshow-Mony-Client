import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/splash/Logo.svg";
import Star1 from "../../assets/splash/Star1.svg";
import Star2 from "../../assets/splash/Star2.svg";
import Star3 from "../../assets/splash/Star3.svg";
import Cards from "../../assets/splash/Cards.svg";
import "./splash.css";

export default function Splash() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReturningFromOnboarding = location.state?.fromOnboardingScroll === true;
  const [isLeaving, setIsLeaving] = useState(false);
  const isNavigatingRef = useRef(false);
  const touchStartYRef = useRef(null);
  const navigateTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current !== null) {
        window.clearTimeout(navigateTimerRef.current);
      }
    };
  }, []);

  const goToOnboarding = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsLeaving(true);

    navigateTimerRef.current = window.setTimeout(() => {
      navigate("/onboarding1", { state: { fromSplashScroll: true } });
    }, 520);
  }, [navigate]);

  const handleWheel = (event) => {
    if (event.deltaY > 12) {
      goToOnboarding();
    }
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event) => {
    if (touchStartYRef.current === null) return;

    const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
    if (touchStartYRef.current - currentY > 28) {
      goToOnboarding();
    }
  };

  return (
    <div
      className={`splash-page ${isReturningFromOnboarding ? "is-returning" : ""} ${isLeaving ? "is-leaving" : ""}`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="splash-page-gradient" />
      <div className="splash">
        <img className="star star-top-left" src={Star2} alt="" />
        <img className="star star-top-right" src={Star1} alt="" />
        <img className="star star-bottom-left" src={Star1} alt="" />
        <img className="star star-bottom-center" src={Star3} alt="" />
        <h1>소비에 더 나은 이유를,</h1>
        <img className="logo" src={Logo} alt="Mony Logo" />
        <p>소비의 흐름을 이해하고, 더 나은 <br />
        소비 일상으로 이어주는 맞춤형 서비스</p>

              <button
                className="scroll-cue"
                type="button"
                onClick={goToOnboarding}
                aria-label="온보딩 시작하기"
            >
                <span className="scroll-cue-text">scroll</span>
                <span className="scroll-cue-arrow" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="17" viewBox="0 0 32 17" fill="none">
                        <path d="M0.365234 0.369141L14.3652 15.3691L30.8652 0.369141" stroke="white"/>
                    </svg>
                </span>
            </button>
      </div>



      <div className="cards-section">
        <div className="marquee-row">
          <div className="marquee-track marquee-ltr">
            {[...Array(6)].map((_, i) => (
              <img key={i} src={Cards} alt="" />
            ))}
          </div>
        </div>
        <div className="marquee-row">
          <div className="marquee-track marquee-rtl">
            {[...Array(6)].map((_, i) => (
              <img key={i} src={Cards} alt="" />
            ))}
          </div>
        </div>
        <div className="marquee-blur-left" />
        <div className="marquee-blur-right" />
      </div>

      <div className="splash-next-panel" aria-hidden="true" />
    </div>
  );
}
