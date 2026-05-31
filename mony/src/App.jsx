import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/./home/home";
import Onboarding1 from "./page/onboarding/onboarding1";
import Onboarding2 from "./page/onboarding/onboarding2";
import Onboarding3 from "./page/onboarding/onboarding3";
import Cm from "./page/consumption management/cm";
import Ca from "./page/consumption analysis/ca";
import Bg from "./page/budget-goal/bg";
import Cc from "./page/consumption-coach/cc";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/onboarding1" element={<Onboarding1 />} />
        <Route path="/onboarding2" element={<Onboarding2 />} />
        <Route path="/onboarding3" element={<Onboarding3 />} />
        <Route path="/consumption-management" element={<Cm />} />
        <Route path="/consumption-analysis" element={<Ca />} />
        <Route path="/budget-goal" element={<Bg />} />
        <Route path="/consumption-coach" element={<Cc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
