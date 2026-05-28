import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import {
  CountUp,
  ProgressFill,
  cardMotion,
  revealVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../../component/homeMotion.jsx";
import "./bg.css";

const bgCh1 = "/src/assets/home/bg_ch1.png";
const bgCh2 = "/src/assets/home/bg_ch2.png";

const goalStats = [
  { label: "3월 예산", value: 550000, suffix: "원" },
  { label: "3월 사용금액", value: 428000, suffix: "원", extra: "(78%)" },
  { label: "남은 예산 금액", value: 122000, suffix: "원" },
  { label: "평균 횟수", value: 62, suffix: "건" },
];

const monthlyCategories = [
  { name: "식비", used: 250000, budget: 180000, note: "초과 70,000원" },
  { name: "쇼핑", used: 116700, budget: 120000, note: "여유" },
];

const milestoneItems = [
  {
    title: "충동 구매 줄이기",
    progress: 0.23,
    period: "3월~",
    desc: "필요한 것만 사고 충동 구매는 줄일래요",
  },
  {
    title: "천천히 소비하기",
    progress: 0.48,
    period: "2월~",
    desc: "생각하면서 여유롭게 소비하고 싶어요",
  },
];

const challengeCards = [
  { title: "열심히 묵돈 만들기", amount: 15000, goal: 100000, progress: 0.45 },
  {
    title: "태국 여행 자금 만들기",
    amount: 300000,
    goal: 1500000,
    progress: 0.08,
  },
  {
    title: "건강관리 비용 모으기",
    amount: 20000,
    goal: 200000,
    progress: 0.12,
  },
];

// 이번 달 저축 목표
const SAVINGS_GOAL = 100000;
const SAVINGS_CURRENT = 62000;

const savingsMilestones = [
  { label: "25%", value: 25000 },
  { label: "50%", value: 50000 },
  { label: "75%", value: 75000 },
  { label: "100%", value: 100000 },
];

// 예산 절약 요약
const budgetGuide = {
  remainDays: 1,
  remainAmount: 122200,
  tips: [
    "식비를 20% 줄이면 예산 내 유지 가능",
    "쇼핑 지출을 절반으로 줄이면 안정",
  ],
};

export default function Bg() {
  const [savingsAmount, setSavingsAmount] = useState(SAVINGS_CURRENT);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [depositInput, setDepositInput] = useState("");
  const [toastMsg, setToastMsg] = useState(null);

  const savingsProgress = Math.min(savingsAmount / SAVINGS_GOAL, 1);
  const isGoalReached = savingsAmount >= SAVINGS_GOAL;

  const handleDeposit = (amount) => {
    const num = Number(amount);
    if (!num || num <= 0) return;
    const newTotal = Math.min(savingsAmount + num, SAVINGS_GOAL);
    setSavingsAmount(newTotal);
    setShowSavingsModal(false);
    setDepositInput("");
    const reached = newTotal >= SAVINGS_GOAL;
    setToastMsg(
      reached
        ? `🎉 이번 달 저축 목표 달성! 훌륭해요!`
        : `🪙 ${num.toLocaleString()}원 저축 완료!`,
    );
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <main className="bg-page">
      <div className="bg-shell">
        <Menu />

        <section className="bg-main">
          <HomeHeader />

          <motion.section
            className="bg-board"
            variants={revealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="bg-gridTop"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* ── 월간 예산 ── */}
              <motion.article
                className="bg-card bg-card--budget"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="bg-cardHead">
                  <h3>월간 예산</h3>
                  <span aria-hidden="true">›</span>
                </div>
                <div className="bg-budgetPanel2">
                  <div className="bg-budgetSummary">
                    {goalStats.map((item) => (
                      <div key={item.label} className="bg-budgetStat">
                        <span>{item.label}</span>
                        <strong>
                          <CountUp value={item.value} suffix={item.suffix} />
                          {item.extra ? <small>{item.extra}</small> : null}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-budgetPanels">
                  <div className="bg-budgetPanel">
                    <div className="bg-budgetPanelHead">
                      <strong>카테고리 예산</strong>
                    </div>
                    <div className="bg-budgetRows">
                      {monthlyCategories.map((item) => (
                        <div key={item.name} className="bg-budgetRow">
                          <div>
                            <strong>{item.name}</strong>
                            <span>
                              <CountUp value={item.used} suffix="원" /> /{" "}
                              <CountUp value={item.budget} suffix="원" />
                            </span>
                          </div>
                          <small>{item.note}</small>
                        </div>
                      ))}
                    </div>
                    <p className="bg-budgetHint">
                      <strong>소비 지출의 35% 증가</strong>
                      외식 소비 증가
                    </p>
                  </div>

                  <div className="bg-budgetPanel bg-budgetPanel--progress">
                    <div className="bg-progressHero">
                      <div className="bg-progressPercent">
                        <p>시간 진행률</p>
                        <strong>50%</strong>
                      </div>
                      <div className="bg-progressPercent">
                        <p>소비 진행률</p>
                        <strong>78%</strong>
                      </div>
                    </div>
                    {/* 캐릭터 이미지 */}
                    <div className="bg-progressCharacter">
                      <img src={bgCh1} alt="캐릭터" />
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* ── 이번달 예산목표 ── */}
              <motion.article
                className="bg-card bg-card--goal"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <h3 className="test11">이번달의 예산목표</h3>

                {/* 이미지 레이아웃: 좌측 아바타 고정 + 우측 카드 세로 스택 */}
                <div className="bg-goalLayout">
                  <div className="bg-goalAvatarWrap">
                    <div className="bg-goalAvatar">
                      <img src={bgCh2} alt="프로필" />
                    </div>
                    <span className="bg-goalName">김수한무</span>
                  </div>

                  <div className="bg-goalCardList">
                    {milestoneItems.map((item, index) => (
                      <div key={item.title} className="bg-goalCard">
                        <span className="bg-goalTag">
                          진행중인 목표 {index + 1}
                        </span>
                        <p>{item.desc}</p>
                        <strong>{item.title}</strong>
                        <div className="bg-goalMeta">
                          <span>진행률</span>
                          <strong>{Math.round(item.progress * 100)}%</strong>
                          <span>기간</span>
                          <strong>{item.period}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            </motion.div>

            <motion.div
              className="bg-gridBottom"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.18 }}
            >
              {/* ── 예산 가이드 + 이번 달 저축 목표 ── */}
              <motion.article
                className="bg-card bg-card--guide"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="bg-cardHead">
                  <h3>예산 가이드</h3>
                  <span aria-hidden="true">›</span>
                </div>

                <div className="bg-guideGrid">
                  <div className="bg-guideSummary">
                    <div>
                      <strong>3월 30일 | 남은 기간 1일</strong>
                      <p>4월이 되기 전 예산을 정리해요</p>
                    </div>
                    <strong className="bg-guideAmount">
                      <CountUp value={122200} suffix="원" />
                    </strong>
                  </div>

                  <div className="bg-guidePlan">
                    <strong>예산 제안</strong>
                    <p>! 식비를 20% 줄이면 예산 내 유지 가능</p>
                    <p>! 쇼핑 지출을 절반으로 줄이면 안정</p>
                  </div>
                </div>

                {/* ── 이번 달 저축 목표 ── */}
                <div className="bg-savingsGoal">
                  <div className="bg-savingsGoalHeader">
                    <div>
                      <span className="bg-savingsGoalLabel">
                        이번 달 저축 목표
                      </span>
                      <strong className="bg-savingsGoalTitle">
                        <CountUp value={savingsAmount} suffix="원" />
                        <em> / {SAVINGS_GOAL.toLocaleString()}원</em>
                      </strong>
                    </div>
                    <span className="bg-savingsGoalPct">
                      {Math.round(savingsProgress * 100)}%
                    </span>
                  </div>

                  {/* 마일스톤 트랙 */}
                  <div className="bg-savingsTrackWrap">
                    <div className="bg-savingsTrack">
                      <ProgressFill
                        className="bg-progressFill is-lime"
                        value={savingsProgress}
                      />
                    </div>
                    <div className="bg-savingsMilestones">
                      {savingsMilestones.map((m) => {
                        const reached = savingsAmount >= m.value;
                        return (
                          <div
                            key={m.label}
                            className={`bg-savingsDot ${reached ? "is-reached" : ""}`}
                            style={{
                              left: `${(m.value / SAVINGS_GOAL) * 100}%`,
                            }}
                          >
                            <span>{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {isGoalReached ? (
                    <div className="bg-savingsComplete">
                      🎉 이번 달 저축 목표 달성!
                    </div>
                  ) : (
                    <button
                      className="bg-savingsBtn"
                      onClick={() => setShowSavingsModal(true)}
                    >
                      + 저축 적립하기
                    </button>
                  )}
                </div>
              </motion.article>

              {/* ── 버킷리스트 챌린지 ── */}
              <motion.article
                className="bg-card bg-card--challenge"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="bg-cardHead">
                  <h3>버킷리스트 챌린지</h3>
                  <span aria-hidden="true">›</span>
                </div>

                <div className="bg-challengeGrid">
                  {challengeCards.map((item) => (
                    <div key={item.title} className="bg-challengeCard">
                      <strong>{item.title}</strong>
                      <span>버킷리스트 진행중</span>
                      <div className="bg-challengeAmount">
                        <CountUp value={item.amount} suffix="원" />
                      </div>
                      <div className="bg-challengeBar">
                        <ProgressFill
                          className="bg-progressFill is-lime"
                          value={item.progress}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            </motion.div>
          </motion.section>
        </section>
      </div>

      {/* 저축 모달 */}
      <AnimatePresence>
        {showSavingsModal && (
          <motion.div
            className="bg-modalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSavingsModal(false)}
          >
            <motion.div
              className="bg-modal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>이번 달 저축 적립</h4>
              <p>
                목표까지{" "}
                <strong style={{ color: "#d7ff47" }}>
                  {(SAVINGS_GOAL - savingsAmount).toLocaleString()}원
                </strong>{" "}
                남았어요
              </p>

              <div className="bg-modalQuick">
                {[5000, 10000, 30000, 50000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDepositInput(String(amt))}
                  >
                    {amt.toLocaleString()}원
                  </button>
                ))}
              </div>

              <div className="bg-modalInput">
                <input
                  type="number"
                  placeholder="직접 입력"
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                />
                <span>원</span>
              </div>

              <button
                className="bg-modalConfirm"
                onClick={() => handleDeposit(depositInput)}
                disabled={!depositInput || Number(depositInput) <= 0}
              >
                {depositInput
                  ? `${Number(depositInput).toLocaleString()}원 저축하기`
                  : "금액을 입력해주세요"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 토스트 */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="bg-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}