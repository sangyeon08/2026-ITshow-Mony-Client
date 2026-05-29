import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./onbording3.css";
import Navigate from "../../component/navigate";
import JoinStarIcon from "../../component/JoinStarIcon";

const GOAL_PRESETS = [
  { label: "100,000원", value: 100000 },
  { label: "300,000원", value: 300000 },
  { label: "500,000원", value: 500000 },
];

const SAVINGS_METHODS = [
  { key: "save",   label: "절약한 금액 넣기", desc: "소비를 줄인 만큼 저금통에" },
  { key: "direct", label: "직접 저축하기",    desc: "원하는 금액을 직접 적립" },
];

export default function OnBording3() {
  const navigate = useNavigate();
  const location = useLocation();

  const routeName = location?.state?.name;
  const storedName = typeof window !== "undefined" ? localStorage.getItem("joinName") : "";
  const userName = (routeName || storedName || "회원").trim();

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount]     = useState("");
  const [savingsMethod, setSavingsMethod]   = useState(null);

  const goalAmount = useMemo(() => {
    if (selectedPreset === "custom") {
      return Number(customAmount.replace(/[^0-9]/g, "")) || 0;
    }
    return selectedPreset ?? 0;
  }, [selectedPreset, customAmount]);

  const isValid = goalAmount >= 1000 && savingsMethod !== null;

  function handleNext() {
    if (!isValid) return;
    localStorage.setItem("mony_savings_goal",   String(goalAmount));
    localStorage.setItem("mony_saved_amount",    "0");
    localStorage.setItem("mony_savings_method",  savingsMethod);
    navigate("/home", { state: { name: userName } });
  }

  return (
    <main className="join1-page">
      <div className="join1-iconWrap" aria-hidden="true">
        <JoinStarIcon />
      </div>

      <section className="join1-card" aria-label="회원가입 3단계">
        <div className="join1-progressRow">
          <span className="join1-progressNow">03</span>
          <span className="join1-progressSlash">/</span>
          <span className="join1-progressTotal">03</span>
        </div>

        <div className="join1-titleBlock">
          <p className="join1-kicker">저축 챌린지를 설정하는 세 번째 단계</p>
          <h1 className="join1-title">저축 저금통을 만들어볼까요?</h1>
          <p className="ob3-desc">아낀 금액이 저금통에 쌓이고, 목표에 가까워질수록 채워져요.</p>
        </div>

        {/* ── 섹션 1: 이번 달 저축 목표 ── */}
        <div className="ob3-section">
          <p className="ob3-sectionLabel">이번 달 저축 목표</p>
          <div className="ob3-presetGrid">
            {GOAL_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`ob3-presetBtn ${selectedPreset === preset.value ? "is-on" : ""}`}
                onClick={() => {
                  setSelectedPreset(preset.value);
                  setCustomAmount("");
                }}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              className={`ob3-presetBtn ${selectedPreset === "custom" ? "is-on" : ""}`}
              onClick={() => setSelectedPreset("custom")}
            >
              직접 입력
            </button>
          </div>

          {selectedPreset === "custom" && (
            <input
              className="join1-input ob3-customInput"
              inputMode="numeric"
              placeholder="예) 200,000"
              value={customAmount}
              autoFocus
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "");
                if (digits === "") return setCustomAmount("");
                const n = Number(digits);
                setCustomAmount(Number.isFinite(n) ? n.toLocaleString() : "");
              }}
            />
          )}
        </div>

        {/* ── 섹션 2: 저축 방식 ── */}
        <div className="ob3-section">
          <p className="ob3-sectionLabel">저축 방식</p>
          <div className="ob3-methodRow">
            {SAVINGS_METHODS.map((method) => (
              <button
                key={method.key}
                type="button"
                className={`ob3-methodBtn ${savingsMethod === method.key ? "is-on" : ""}`}
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
          disabled={!isValid}
          className={`join1-button ${isValid ? "is-enabled" : "is-disabled"}`}
          onClick={handleNext}
        >
          확인
        </button>
      </section>

      <Navigate />
    </main>
  );
}
