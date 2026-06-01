import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import { goals as goalsApi, buckets as bucketsApi } from "../../api/index.js";
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

//버킷리스트 도장 이미지 배열
const stampImages = [
  "/src/assets/home/trip.png",
  "/src/assets/home/hobby.png",
  "/src/assets/home/improvement.png",
];

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
  {
    id: "default-saving",
    title: "열심히 묵돈 만들기",
    targetAmount: 100000,
    currentAmount: 45000,
    status: "progress",
    completedAt: "",
  },
  {
    id: "default-travel",
    title: "태국 여행 자금 만들기",
    targetAmount: 1500000,
    currentAmount: 300000,
    status: "progress",
    completedAt: "",
  },
  {
    id: "default-completed-jeju",
    title: "제주도 여행가기",
    targetAmount: 320000,
    currentAmount: 320000,
    status: "completed",
    completedAt: "2026. 3. 18.",
  },
];

const challengeTabs = [
  { key: "all", label: "전체" },
  { key: "progress", label: "진행 중" },
  { key: "completed", label: "완료됨" },
];

const completedMessages = [
  "잘했어요! 목표를 끝까지 달성했어요.",
  "이번 목표도 멋지게 성공했어요.",
  "작은 저축이 큰 성취가 되었어요.",
];

function readBucketGoals() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  try {
    const savedGoals = JSON.parse(localStorage.getItem("bucketGoals") || "[]");
    const savedGoal = JSON.parse(localStorage.getItem("bucketGoal") || "null");
    const goals = Array.isArray(savedGoals) ? savedGoals : [];

    if (savedGoal?.bucketList) {
      goals.unshift({
        id: `bucket-${savedGoal.bucketList}`,
        title: savedGoal.bucketList,
        targetAmount: Number(savedGoal.targetAmount) || 0,
        currentAmount: Number(savedGoal.currentSaved) || 0,
        status: savedGoal.status,
        completedAt: savedGoal.completedAt,
      });
    }

    return goals.map((goal, index) => {
      const targetAmount = Number(goal.targetAmount) || 0;
      const currentAmount = Number(goal.currentAmount) || 0;
      const isCompleted = targetAmount > 0 && currentAmount >= targetAmount;

      return {
        id: goal.id || `bucket-goal-${index}`,
        title: goal.title || goal.bucketList || "버킷리스트 목표",
        targetAmount,
        currentAmount,
        status: isCompleted
          ? "completed"
          : goal.status === "completed"
            ? "completed"
            : "progress",
        completedAt: isCompleted
          ? goal.completedAt || today
          : goal.completedAt || "",
      };
    });
  } catch {
    return [];
  }
}

const DEFAULT_savingsGoal = 100000;

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
  const [savingsGoal, setSavingsGoal] = useState(DEFAULT_savingsGoal);
  const [savingsAmount, setSavingsAmount] = useState(() => {
    const stored = localStorage.getItem("mony_saved_amount");
    return stored ? Number(stored) : 0;
  });
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [depositInput, setDepositInput] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [challengeTab, setChallengeTab] = useState("all");
  const [bucketChallenges, setBucketChallenges] = useState([]);

  const savingsProgress = savingsGoal > 0 ? Math.min(savingsAmount / savingsGoal, 1) : 0;
  const isGoalReached = savingsGoal > 0 && savingsAmount >= savingsGoal;
  const savingsMilestones = useMemo(() => [
    { label: "25%", value: Math.round(savingsGoal * 0.25) },
    { label: "50%", value: Math.round(savingsGoal * 0.5) },
    { label: "75%", value: Math.round(savingsGoal * 0.75) },
    { label: "100%", value: savingsGoal },
  ], [savingsGoal]);
  const allChallenges = [...bucketChallenges, ...challengeCards].map((item) => {
    const targetAmount = Number(item.targetAmount) || 0;
    const currentAmount = Number(item.currentAmount) || 0;
    const progress = targetAmount
      ? Math.min(currentAmount / targetAmount, 1)
      : 0;
    const status =
      currentAmount >= targetAmount && targetAmount > 0
        ? "completed"
        : item.status;

    return {
      ...item,
      targetAmount,
      currentAmount,
      progress,
      status,
    };
  });
  const progressChallenges = allChallenges.filter(
    (item) => item.status !== "completed",
  );
  const completedChallenges = allChallenges.filter(
    (item) => item.status === "completed",
  );
  const filteredChallenges =
    challengeTab === "all"
      ? allChallenges
      : allChallenges.filter((item) => item.status === challengeTab);
  const totalCompletedAmount = completedChallenges.reduce(
    (sum, item) => sum + item.targetAmount,
    0,
  );

  const handleDeposit = (amount) => {
    const num = Number(amount);
    if (!num || num <= 0) return;
    const newTotal = Math.min(savingsAmount + num, savingsGoal);
    setSavingsAmount(newTotal);
    localStorage.setItem("mony_saved_amount", String(newTotal));
    setShowSavingsModal(false);
    setDepositInput("");

    // 진행 중인 첫 번째 버킷의 저축 금액을 DB에 반영
    const primary = bucketChallenges.find((b) => b.status !== "completed");
    if (primary?.id) {
      const newMonyFinish = Math.min(primary.currentAmount + num, primary.targetAmount);
      bucketsApi.updateMoney(primary.id, newMonyFinish)
        .then(() => {
          setBucketChallenges((prev) =>
            prev.map((b) =>
              b.id === primary.id
                ? {
                    ...b,
                    currentAmount: newMonyFinish,
                    progress: primary.targetAmount ? newMonyFinish / primary.targetAmount : 0,
                    status: newMonyFinish >= primary.targetAmount && primary.targetAmount > 0 ? "completed" : "progress",
                  }
                : b,
            ),
          );
        })
        .catch(() => {});
    }

    const reached = newTotal >= savingsGoal;
    setToastMsg(
      reached
        ? `🎉 이번 달 저축 목표 달성! 훌륭해요!`
        : `🪙 ${num.toLocaleString()}원 저축 완료!`,
    );
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    // 이번 달 저축 목표 로드
    goalsApi.getAll()
      .then((res) => {
        const periodDetail = new Date().toISOString().slice(0, 7);
        const monthly = res.data?.find(
          (g) => g.period_type === "monthly" && g.period_detail === periodDetail,
        ) ?? res.data?.[0];
        if (monthly?.target_amount) setSavingsGoal(monthly.target_amount);
      })
      .catch(() => {});

    // 버킷리스트 챌린지 로드
    bucketsApi.getAll()
      .then((res) => {
        if (res.data?.length > 0) {
          const today = new Date().toLocaleDateString("ko-KR", {
            year: "numeric", month: "numeric", day: "numeric",
          });
          setBucketChallenges(
            res.data.map((b) => ({
              id: String(b.id),
              title: b.title,
              targetAmount: b.mony_ing || 0,
              currentAmount: b.mony_finish || 0,
              status: (b.probability ?? 0) >= 100 ? "completed" : "progress",
              completedAt: (b.probability ?? 0) >= 100 ? today : "",
            })),
          );
        } else {
          setBucketChallenges(readBucketGoals());
        }
      })
      .catch(() => {
        setBucketChallenges(readBucketGoals());
      });
  }, []);

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
                      <strong>외식 소비 증가</strong>
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
                        <div className="bg-goalRow">
                          <div className="bg-goalLeft">
                            <p>{item.desc}</p>
                            <strong className="bg-goalTitle">
                              {item.title}
                            </strong>
                          </div>
                          <div className="bg-goalRight">
                            <div className="bg-goalMeta">
                              <span>진행률</span>
                              <span>기간</span>
                            </div>
                            <div className="bg-goalMetaValues">
                              <strong>
                                {Math.round(item.progress * 100)}%
                              </strong>
                              <strong>{item.period}</strong>
                            </div>
                          </div>
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
                        <em> / {savingsGoal.toLocaleString()}원</em>
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
                              left: `${(m.value / savingsGoal) * 100}%`,
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

                <div className="bg-challengeSummary">
                  <div>
                    <span>완료한 버킷리스트</span>
                    <strong>{completedChallenges.length}개</strong>
                  </div>
                  <div>
                    <span>진행 중인 버킷리스트</span>
                    <strong>{progressChallenges.length}개</strong>
                  </div>
                  <div>
                    <span>총 달성 금액</span>
                    <strong>{totalCompletedAmount.toLocaleString()}원</strong>
                  </div>
                </div>

                <div
                  className="bg-challengeTabs"
                  role="tablist"
                  aria-label="버킷리스트 상태"
                >
                  {challengeTabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={challengeTab === tab.key}
                      className={challengeTab === tab.key ? "is-active" : ""}
                      onClick={() => setChallengeTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-challengeGrid">
                  {filteredChallenges.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`bg-challengeCard ${
                        item.status === "completed"
                          ? "is-completed"
                          : "is-progress"
                      }`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.26, delay: index * 0.04 }}
                    >
                      {item.status === "completed" ? (
                        <>
                          <motion.div
                            className="bg-challengeStamp"
                            initial={{ scale: 1.8, rotate: -18, opacity: 0 }}
                            animate={{ scale: 1, rotate: -12, opacity: 0.42 }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 15,
                              delay: 0.16,
                            }}
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              translateX: "-50%",
                              translateY: "-50%",
                            }}
                          >
                            <img src={stampImages[0]} />
                          </motion.div>
                          <span className="bg-challengeBadge">
                            칭찬도장 쾅!
                          </span>
                          <strong>{item.title}</strong>
                          <p>
                            {
                              completedMessages[
                                index % completedMessages.length
                              ]
                            }
                          </p>
                          <div className="bg-challengeCompleteMeta">
                            <span>완료 금액</span>
                            <strong>
                              {item.targetAmount.toLocaleString()}원
                            </strong>
                            <span>달성 날짜</span>
                            <strong>
                              {item.completedAt || "2026. 3. 30."}
                            </strong>
                          </div>
                        </>
                      ) : (
                        <>
                          <strong>{item.title}</strong>
                          <span>버킷리스트 진행 중</span>
                          <div className="bg-challengeAmount">
                            <CountUp value={item.currentAmount} suffix="원" />
                            <small>
                              {" "}
                              / {item.targetAmount.toLocaleString()}원
                            </small>
                          </div>
                          <div className="bg-challengeBar">
                            <motion.div
                              className="bg-progressFill is-lime"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: item.progress }}
                              transition={{
                                duration: 1.2,
                                ease: "easeOut",
                                delay: index * 0.1,
                              }}
                              style={{
                                transformOrigin: "0% 50%",
                                height: "100%",
                                borderRadius: "inherit",
                              }}
                            />
                          </div>
                          <p className="bg-challengeRemain">
                            목표까지{" "}
                            {Math.max(
                              item.targetAmount - item.currentAmount,
                              0,
                            ).toLocaleString()}
                            원 남았어요
                          </p>
                          <span className="bg-challengePct">
                            현재 {Math.round(item.progress * 100)}% 달성 중
                          </span>
                        </>
                      )}
                    </motion.div>
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
                  {(savingsGoal - savingsAmount).toLocaleString()}원
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

      {/* 토스트 d*/}
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
