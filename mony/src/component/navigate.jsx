import "./navigate.css";
import { useNavigate } from "react-router-dom";

export default function Navigate() {
  const navigate = useNavigate();

  const handleGoFirst = () => {
    navigate("/onboarding1");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <footer className="join1-bottomNav">
      <button
        type="button"
        className="join1-bottomLink"
        onClick={handleGoFirst}
      >
        처음으로
      </button>
      <span className="join1-bottomDivider">|</span>
      <button
        type="button"
        className="join1-bottomLink"
        onClick={handleGoBack}
      >
        이전으로
      </button>
    </footer>
  );
}