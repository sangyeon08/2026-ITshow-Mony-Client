import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import homeicon from "../assets/home/homeicon.svg";
import "./homeheader.css";
import homeheaderimg from "../assets/home/homeheaderimg.png";
import { revealVariants } from "./homeMotion.jsx";
import { getDaysWithMony } from "../utils/date.js";

export default function HomeHeader() {
  const name = localStorage.getItem("joinName")?.trim() || "김수한무";
  const days = useMemo(() => getDaysWithMony(), []);

  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (reduceMotion) {
      setCount(days);
      return;
    }

    let frameId = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(days * easeOutCubic));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [days]);

  return (
    <motion.header
      className="homeheader"
      aria-label="홈 헤더"
      variants={revealVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      transition={{ duration: reduceMotion ? 0 : 0.72 }}
    >
      <div className="homeheader-left">
        <span className="homeheader-badge" aria-hidden="true">
          <img src={homeicon} alt="" className="homeicon" />
        </span>
        <h1 className="homeheader-title">{name} 님의 홈</h1>
      </div>

      <div className="homeheader-right">
        <div className="homeheader-pill" aria-label={`Mony와 함께한 지 ${days}일`}>
          <span className="homeheader-pillText">
            MONY 와 함께한지 <strong>{count}일</strong>
          </span>
        </div>

        <div className="homeheader-avatarWrap" aria-hidden="true">
          <img src={homeheaderimg} alt="" className="homeheader-avatar" />
        </div>
      </div>
    </motion.header>
  );
}
