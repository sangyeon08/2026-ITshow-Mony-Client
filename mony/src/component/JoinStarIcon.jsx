import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./JoinStarIcon.css";

const STAR_PATH =
  "M37.0073 0.923103C37.1023 -0.307632 38.9064 -0.307638 39.0014 0.923097L41.1056 28.1873C41.1685 29.0033 42.1316 29.4022 42.7532 28.8697L63.5198 11.0789C64.4572 10.2758 65.7329 11.5515 64.9298 12.489L47.139 33.2555C46.6065 33.8771 47.0054 34.8402 47.8215 34.9032L75.0856 37.0074C76.3164 37.1023 76.3164 38.9064 75.0856 39.0014L47.8215 41.1056C47.0054 41.1686 46.6065 42.1317 47.139 42.7532L64.9298 63.5198C65.7329 64.4573 64.4572 65.7329 63.5198 64.9299L42.7532 47.139C42.1316 46.6066 41.1685 47.0055 41.1056 47.8215L39.0014 75.0857C38.9064 76.3164 37.1023 76.3164 37.0073 75.0857L34.9031 47.8215C34.8401 47.0055 33.877 46.6066 33.2555 47.139L12.4889 64.9298C11.5515 65.7329 10.2758 64.4573 11.0789 63.5198L28.8697 42.7532C29.4022 42.1317 29.0032 41.1686 28.1872 41.1056L0.923042 39.0014C-0.307693 38.9064 -0.307699 37.1023 0.923036 37.0074L28.1872 34.9032C29.0032 34.8402 29.4022 33.8771 28.8697 33.2555L11.0789 12.489C10.2758 11.5515 11.5515 10.2758 12.4889 11.0789L33.2555 28.8697C33.877 29.4022 34.8401 29.0033 34.9031 28.1873L37.0073 0.923103Z";

function HingeHalf({
  clipId,
  direction,
  phaseDelay = 0,
  edgeOrigin,
}) {
  const reducedMotion = useReducedMotion();

  const commonStyle = {
    transformBox: "fill-box",
    transformOrigin: edgeOrigin,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
  };

  if (reducedMotion) {
    return (
      <g clipPath={`url(#${clipId})`} style={commonStyle}>
        <path d={STAR_PATH} fill="#D9D9D9" />
      </g>
    );
  }

  const openAngle = direction === "left" ? -17 : 17;
  const settleAngle = direction === "left" ? -6 : 6;

  return (
    <motion.g
      clipPath={`url(#${clipId})`}
      style={commonStyle}
      animate={{
        rotateY: [0, openAngle, settleAngle, openAngle, 0],
        scaleX: [1, 0.992, 0.997, 0.992, 1],
      }}
      transition={{
        duration: 8.8,
        repeat: Infinity,
        repeatType: "loop",
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.22, 0.5, 0.74, 1],
        delay: phaseDelay,
      }}
    >
      <path d={STAR_PATH} fill="#D9D9D9" />
    </motion.g>
  );
}

export default function JoinStarIcon({ className = "join1-icon" }) {
  const uid = useId();
  const leftClipId = `${uid}-join-star-left`;
  const rightClipId = `${uid}-join-star-right`;
  const resolvedClassName = className.includes("join1-icon")
    ? className
    : `join1-icon ${className}`.trim();

  return (
    <>
      <style>{`
        .join1-iconWrap {
          perspective: 1400px;
          perspective-origin: center center;
          transform-origin: center center;
          transform-style: preserve-3d;
          animation: rotateRight3D 3.0s linear infinite;
        }
        @keyframes rotateRight3D {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
        }
      `}</style>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="76"
        height="76"
        viewBox="0 0 76 76"
        fill="none"
        className={resolvedClassName}
        aria-hidden="true"
        initial={false}
        style={{
          display: "block",
          transformBox: "fill-box",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform, opacity",
        }}
      >
        <defs>
          <clipPath id={leftClipId} clipPathUnits="userSpaceOnUse">
            <rect x="0" y="0" width="38" height="76" />
          </clipPath>
          <clipPath id={rightClipId} clipPathUnits="userSpaceOnUse">
            <rect x="38" y="0" width="38" height="76" />
          </clipPath>
        </defs>

        <path d={STAR_PATH} fill="#D9D9D9" />

        <HingeHalf
          clipId={leftClipId}
          direction="left"
          edgeOrigin="100% 50%"
          phaseDelay={0}
        />
        <HingeHalf
          clipId={rightClipId}
          direction="right"
          edgeOrigin="0% 50%"
          phaseDelay={0.15}
        />
      </motion.svg>
    </>
  );
}
