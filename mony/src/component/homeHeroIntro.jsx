import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { buttonMotion, staggerItemVariants } from "./homeMotion.jsx";
import { getShortMonthLabel } from "../utils/date.js";
import bannerBg from "../assets/home/banner_assets/bannerbg.png";
import bannerItems from "../assets/home/banner_assets/banner_items.png";

const defaultCards = [
  {
    no: "01",
    title: "일상 속\n작은 즐거움",
    desc: "간편한 소비의 일면을 담아봤어요",
    tags: "#일상의 #리노 #한정감",
    tone: "stone",
  },
  {
    no: "02",
    title: "페스트\n패션과 쇼핑",
    desc: "충동 구매가 많아 보이네요",
    tags: "#유니크로 #세련미로 #나이스",
    tone: "blue",
  },
  {
    no: "03",
    title: "나를\n위한 소비",
    desc: "취미 소비가 전체를 차지해요",
    tags: "#부수지출 #불균형 #분석",
    tone: "green",
  },
  {
    no: "04",
    title: "벚꽃이 핀\n봄나들이",
    desc: "계절 맞춤 소비가 보이네요",
    tags: "#따뜻함 #보드라움 #한달",
    tone: "pink",
  },
];

const hoverCards = [
  {
    no: "01",
    title: "지난 11월의 버킷리스트 챌린지",
    crop: "left",
  },
  {
    no: "02",
    title: "나고야 여행가기",
    crop: "right",
  },
];

function HeroText({ index, eyebrow, title, description, buttonLabel, onButtonClick }) {
  return (
    <div className="hero-banner-copy">
      <div className="home-heroIndex">{index}</div>
      <p className="hero-banner-eyebrow">{eyebrow}</p>
      <h2 className="hero-banner-title">
        {title.split("\n").map((line, lineIndex, lines) => (
          <span key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </h2>
      <p className="hero-banner-desc">{description}</p>
      <motion.button className="hero-banner-button" type="button" onClick={onButtonClick} {...buttonMotion}>
        {buttonLabel}
        <span aria-hidden="true">↗</span>
      </motion.button>
    </div>
  );
}

function DefaultLayout({ onButtonClick, name }) {
  const currentShortMonthLabel = getShortMonthLabel();

  return (
    <motion.div
      className="hero-banner-layout is-default"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      initial="hidden"
      animate="show"
    >
      <HeroText
        index="01"
        eyebrow={`${name}님의 버킷리스트 챌린지`}
        title={"이번 주의 소비를 한 번\n살펴볼까요?"}
        description={`MONY와 함께한 ${currentShortMonthLabel}의 소비 기록으로 인사이트를 보여드려요`}
        buttonLabel="소비관리 더보기"
        onButtonClick={onButtonClick}
      />

      <div className="hero-banner-defaultCards">
        {defaultCards.map((card) => (
          <motion.article key={card.no} className={`hero-banner-card is-${card.tone}`} variants={staggerItemVariants}>
            <div className="hero-banner-cardNo">{card.no}</div>
            <h3 className="hero-banner-cardTitle">
              {card.title.split("\n").map((line, index, lines) => (
                <span key={`${card.no}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h3>
            <p className="hero-banner-cardDesc">{card.desc}</p>
            <p className="hero-banner-cardTags">{card.tags}</p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

function HoverLayout({ onButtonClick, name }) {
  return (
    <motion.div
      className="hero-banner-layout is-hover"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      initial="hidden"
      animate="show"
    >
      <HeroText
        index="02"
        eyebrow={`${name}님의 버킷리스트 챌린지`}
        title={"작은 소비가 쌓이는\n노력 자체는 의미가 깊어요"}
        description="지속가능성과 성장을 고려하는 절약은 의미있는 경험으로 쌓여, 노력의 양분이 될거예요."
        buttonLabel="예산목표 더보기"
        onButtonClick={onButtonClick}
      />

      <div className="hero-banner-hoverMain">
        <img src={bannerItems} alt="" aria-hidden="true" />
      </div>

      <div className="hero-banner-hoverSide">
        {hoverCards.map((card) => (
          <div key={card.no} className={`hero-banner-hoverCard is-${card.crop}`}>
            <img
              src={bannerItems}
              alt=""
              aria-hidden="true"
              style={{ objectPosition: card.crop === "left" ? "left center" : "right center" }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HomeHeroIntro({ onButtonClick }) {
  const name = localStorage.getItem("joinName")?.trim() || "사용자";
  const [mode, setMode] = useState("default");
  const reduceMotion = useReducedMotion();

  const setHover = () => setMode("hover");
  const setDefault = () => setMode("default");
  const toggleMode = () => setMode((current) => (current === "default" ? "hover" : "default"));

  return (
    <motion.div
      className="hero-banner"
      onMouseEnter={setHover}
      onMouseLeave={setDefault}
      onFocus={setHover}
      onBlur={setDefault}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-banner-shell">
        <div className="hero-banner-bg" aria-hidden="true" style={{ backgroundImage: `url(${bannerBg})` }} />
        <div className="hero-banner-bgOverlay" aria-hidden="true" />

        <button type="button" className="hero-banner-arrow is-left" aria-label="이전 배너" onClick={toggleMode}>
          <span aria-hidden="true">‹</span>
        </button>
        <button type="button" className="hero-banner-arrow is-right" aria-label="다음 배너" onClick={toggleMode}>
          <span aria-hidden="true">›</span>
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "default" ? (
            <DefaultLayout key="default" onButtonClick={onButtonClick} name={name} />
          ) : (
            <HoverLayout key="hover" onButtonClick={onButtonClick} name={name} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
