import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/./home/home";
import Onboarding1 from "./page/onboarding/onboarding1";
import Onboarding2 from "./page/onboarding/onboarding2";
import Onboarding3 from "./page/onboarding/onboarding3";
import Cm from "./page/consumption management/cm";
import Ca from "./page/consumption analysis/ca";
import Bg from "./page/budget-goal/bg";
import Cc from "./page/consumption-coach/cc";
import { useInactivityReset } from "./hooks/useInactivityReset";
import Splash from "./page/splash/splash";

function InactivityGuard({ children }) {
  useInactivityReset();
  return children;
}

function App() {
  const onboardingDone = localStorage.getItem("onboardingCompleted") === "true";

  return (
    <BrowserRouter>
      <InactivityGuard>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={onboardingDone ? "/home" : "/splash"} replace />}
          />
          <Route path="/splash" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/onboarding1" element={<Onboarding1 />} />
          <Route path="/onboarding2" element={<Onboarding2 />} />
          <Route path="/onboarding3" element={<Onboarding3 />} />
          <Route path="/consumption-management" element={<Cm />} />
          <Route path="/consumption-analysis" element={<Ca />} />
          <Route path="/budget-goal" element={<Bg />} />
          <Route path="/consumption-coach" element={<Cc />} />
        </Routes>
      </InactivityGuard>
    </BrowserRouter>
  );
}

export default App;
