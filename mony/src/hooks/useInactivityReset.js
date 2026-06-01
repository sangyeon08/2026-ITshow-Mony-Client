import { useEffect } from "react";

const TIMEOUT_MS = 2 * 60 * 1000; // 2분

const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

export function useInactivityReset() {
  useEffect(() => {
    let timer;

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.clear();
        window.location.replace("/onboarding1");
      }, TIMEOUT_MS);
    }

    EVENTS.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);
}
