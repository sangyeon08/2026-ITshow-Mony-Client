import React, { useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import Logo from "../assets/menu/Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import "./menu.css";

import HomeIcon from "../assets/menu/Home.svg";
import ConsumptionManagementIcon from "../assets/menu/ConsumptionManagement.svg";
import ConsumptionAnalysisIcon from "../assets/menu/ConsumptionAnalysis.svg";
import BudgetGoalIcon from "../assets/menu/BudgetGoal.svg";
import ConsumptionCoachIcon from "../assets/menu/ConsumptionCoach.svg";

const MENU = [
  { key: "home", label: "홈", icon: HomeIcon, to: "/home" },
  { key: "consumption-management", label: "소비관리", icon: ConsumptionManagementIcon, to: "/consumption-management" },
  { key: "consumption-analysis", label: "소비분석", icon: ConsumptionAnalysisIcon, to: "/consumption-analysis" },
  { key: "budget-goal", label: "예산목표", icon: BudgetGoalIcon, to: "/budget-goal" },
  { key: "consumption-coach", label: "소비코치", icon: ConsumptionCoachIcon, to: "/consumption-coach" },
];

const RESET_KEYS = [
  "joinName", "onboardingCompleted", "onboarding2Form",
  "bucketGoal", "bucketGoals",
  "mony_savings_goal", "mony_saved_amount", "mony_challenge_saved_amount",
  "mony_savings_method", "mony_primary_bucket_id",
  "mony_quick_save_amount", "mony_memories",
];

function guessActiveKey(pathname) {
  if (pathname === "/" || pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/consumption-management")) return "consumption-management";
  if (pathname.startsWith("/consumption-analysis")) return "consumption-analysis";
  if (pathname.startsWith("/budget-goal")) return "budget-goal";
  if (pathname.startsWith("/consumption-coach")) return "consumption-coach";
  return "consumption-management";
}

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const nameFromState = location?.state?.name;
  const [name, setName] = useState(() => nameFromState ?? localStorage.getItem("joinName") ?? "");

  useEffect(() => {
    if (typeof nameFromState === "string" && nameFromState.trim().length > 0) {
      const trimmed = nameFromState.trim();
      setName(trimmed);
      localStorage.setItem("joinName", trimmed);
    }
  }, [nameFromState]);

  const activeKey = useMemo(() => guessActiveKey(location.pathname), [location.pathname]);

  const handleReset = () => {
    RESET_KEYS.forEach((k) => localStorage.removeItem(k));
    navigate("/splash");
  };

  return (
    <aside className="menu" aria-label="사이드 메뉴">
      <nav className="menu-nav" aria-label="메뉴">
        <img className="menu-logo" src={Logo} alt="Mony" />
        <LayoutGroup id="menu-active-group">
          <ul className="menu-list">
            {MENU.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <li key={item.key} className="menu-itemWrap">
                  <button
                    type="button"
                    className={`menu-item ${isActive ? "is-active" : "is-inactive"}`}
                    onClick={() => navigate(item.to)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="menu-active-bg"
                        className="menu-activeIndicator"
                        aria-hidden="true"
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 32,
                          mass: 1,
                        }}
                      />
                    )}
                    <span className="menu-itemContent">
                      <img className="menu-icon" src={item.icon} alt="" aria-hidden="true" />
                      <span className="menu-label">{item.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </nav>

      <div className="menu-bottom">
        <h4>오늘의 이야기</h4>
        <div className="menu-bottom-top-box">
          이해하는 소비를 실천해 볼까요?
        </div>
        <div className="menu-bottom-context">
          <span className="title">ㅤ목적을 잃지 마라 !!</span>
          <span className="lion">ㅤ돈을 아끼는 것이 미덕이지만, ㅤ돈을 아끼는 것이 목적이  ㅤ ㅤ되어서는 안 된다.</span>
        </div>
        <p className="menu-resetBtn" onClick={handleReset}>처음으로 가기</p>
      </div>
    </aside>
  );
}
