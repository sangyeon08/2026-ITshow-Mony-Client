import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/./home/home";
import OnBording from "./page/onbording/onbording1";
import OnBording2 from "./page/onbording/onbording2";
import OnBording3 from "./page/onbording/onbording3";
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
        <Route path="/onbording1" element={<OnBording />} />
        <Route path="/onbording2" element={<OnBording2 />} />
        <Route path="/onbording3" element={<OnBording3 />} />
        <Route path="/consumption-management" element={<Cm />} />
        <Route path="/consumption-analysis" element={<Ca />} />
        <Route path="/budget-goal" element={<Bg />} />
        <Route path="/consumption-coach" element={<Cc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
