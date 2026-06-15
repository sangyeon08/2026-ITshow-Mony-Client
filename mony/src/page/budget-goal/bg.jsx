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
import {
  getDaysLeftInMonth,
  getDotDateLabel,
  getKoreanDateLabel,
  getShortMonthLabel,
} from "../../utils/date.js";

import bgCh1 from "../../assets/home/bg_ch1.png";
import bgCh2 from "../../assets/home/bg_ch2.png";
import tripStamp from "../../assets/home/trip.png";
import hobbyStamp from "../../assets/home/hobby.png";
import improvementStamp from "../../assets/home/improvement.png";

const DEFAULT_BUCKET_CATEGORY = "여행";
const currentShortMonthLabel = getShortMonthLabel();
const todayDateLabel = getKoreanDateLabel();
const todayDotLabel = getDotDateLabel();
const daysLeftInMonth = getDaysLeftInMonth();
const bucketCategories = ["자기계발", "취미", "여행"];
const stampImagesByCategory = {
  여행: tripStamp,
  취미: hobbyStamp,
  자기계발: improvementStamp,
};

const goalStats = [
  { label: `${currentShortMonthLabel} 예산`, value: 550000, suffix: "원" },
  { label: `${currentShortMonthLabel} 사용금액`, value: 428000, suffix: "원", extra: "(78%)" },
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
    period: `${currentShortMonthLabel}~`,
    desc: "필요한 것만 사고 충동 구매는 줄일래요",
  },
  {
    title: "천천히 소비하기",
    progress: 0.48,
    period: `${currentShortMonthLabel}~`,
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
    category: "취미",
    completedAt: "",
  },
  {
    id: "default-travel",
    title: "태국 여행 자금 만들기",
    targetAmount: 1500000,
    currentAmount: 300000,
    status: "progress",
    category: "여행",
    completedAt: "",
  },
  {
    id: "default-completed-jeju",
    title: "제주도 여행가기",
    targetAmount: 320000,
    currentAmount: 320000,
    status: "completed",
    category: "여행",
    completedAt: todayDotLabel,
  },
];

const challengeTabs = [
  { key: "all", label: "전체" },
  { key: "progress", label: "진행 중" },
  { key: "completed", label: "완료됨" },
  ...bucketCategories.map((category) => ({ key: category, label: category })),
];

const completedMessages = [
  "잘했어요! 목표를 끝까지 달성했어요.",
  "이번 목표도 멋지게 성공했어요.",
  "작은 저축이 큰 성취가 되었어요.",
];

const normalizeBucketCategory = (category) =>
  bucketCategories.includes(category) ? category : DEFAULT_BUCKET_CATEGORY;

function readPrimaryBucketGoal() {
  try {
    return JSON.parse(localStorage.getItem("bucketGoal") || "null");
  } catch {
    return null;
  }
}

function readBucketGoals() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  try {
    const savedGoals = JSON.parse(localStorage.getItem("bucketGoals") || "[]");
    const savedGoal = readPrimaryBucketGoal();
    const goals = Array.isArray(savedGoals) ? savedGoals : [];

    if (savedGoal?.bucketList) {
      goals.unshift({
        id: `bucket-${savedGoal.bucketList}`,
        title: savedGoal.bucketList,
        targetAmount: Number(savedGoal.targetAmount) || 0,
        currentAmount: Number(savedGoal.currentSaved) || 0,
        status: savedGoal.status,
        category: normalizeBucketCategory(savedGoal.category),
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
        category: normalizeBucketCategory(goal.category),
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
  const name = localStorage.getItem("joinName")?.trim() || "사용자";

  const gridRef = useRef(null);
  const thumbRef = useRef(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const thumbHeightRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = gridRef.current?.scrollTop ?? 0;
  };

  useEffect(() => {
    if (!isDragging) return;
    const el = gridRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const trackHeight = el.clientHeight;
      const scrollableHeight = el.scrollHeight - el.clientHeight;
      const dy = e.clientY - dragStartY.current;
      const scrollDelta = (dy / (trackHeight - thumbHeightRef.current)) * scrollableHeight;
      el.scrollTop = Math.max(0, Math.min(dragStartScrollTop.current + scrollDelta, scrollableHeight));
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const [savingsGoal, setSavingsGoal] = useState(
    () => Number(localStorage.getItem("mony_savings_goal")) || DEFAULT_savingsGoal,
  );
  const [savingsAmount, setSavingsAmount] = useState(() => {
    const stored = localStorage.getItem("mony_saved_amount");
    return stored ? Number(stored) : 0;
  });
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [depositInput, setDepositInput] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [challengeTab, setChallengeTab] = useState("all");
  const [bucketChallenges, setBucketChallenges] = useState([]);

  const savingsProgress =
    savingsGoal > 0 ? Math.min(savingsAmount / savingsGoal, 1) : 0;
  const isGoalReached = savingsGoal > 0 && savingsAmount >= savingsGoal;
  const savingsMilestones = useMemo(
    () => [
      { label: "25%", value: Math.round(savingsGoal * 0.25) },
      { label: "50%", value: Math.round(savingsGoal * 0.5) },
      { label: "75%", value: Math.round(savingsGoal * 0.75) },
      { label: "100%", value: savingsGoal },
    ],
    [savingsGoal],
  );
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
      : bucketCategories.includes(challengeTab)
        ? allChallenges.filter((item) => item.category === challengeTab)
      : allChallenges.filter((item) => item.status === challengeTab);
  const totalCompletedAmount = completedChallenges.reduce(
    (sum, item) => sum + item.targetAmount,
    0,
  );

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => {
      const ratio = el.scrollTop / Math.max(el.scrollHeight - el.clientHeight, 1);
      const thumb = Math.max((el.clientHeight / el.scrollHeight) * el.clientHeight, 28);
      thumbHeightRef.current = thumb;
      setThumbHeight(thumb);
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateY(${ratio * Math.max(el.clientHeight - thumb, 0)}px)`;
      }
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [filteredChallenges]);

  const handleDeposit = (amount) => {
    const num = Number(amount);
    if (!num || num <= 0) return;
    const newTotal = Math.min(savingsAmount + num, savingsGoal);
    setSavingsAmount(newTotal);
    localStorage.setItem("mony_saved_amount", String(newTotal));
    window.dispatchEvent(new StorageEvent("storage", { key: "mony_saved_amount", newValue: String(newTotal) }));
    setShowSavingsModal(false);
    setDepositInput("");

    const reached = newTotal >= savingsGoal;
    setToastMsg(
      reached
        ? `🎉 이번 달 저축 목표 달성! 훌륭해요!`
        : `🪙 ${num.toLocaleString()}원 저축 완료!`,
    );
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    goalsApi
      .getAll()
      .then((res) => {
        const periodDetail = new Date().toISOString().slice(0, 7);
        const monthly =
          res.data?.find(
            (g) =>
              g.period_type === "monthly" && g.period_detail === periodDetail,
          ) ?? res.data?.[0];
        if (monthly?.target_amount) setSavingsGoal(monthly.target_amount);
      })
      .catch(() => {});

    bucketsApi
      .getAll()
      .then((res) => {
        if (res.data?.length > 0) {
          const today = new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          const primaryBucketId = localStorage.getItem("mony_primary_bucket_id");
          const storedBucketGoal = readPrimaryBucketGoal();
          const primaryBucket =
            res.data.find((b) => String(b.id) === primaryBucketId) ?? res.data[0];
          if (primaryBucket) {
            localStorage.setItem("mony_primary_bucket_id", String(primaryBucket.id));
          }
          setBucketChallenges(
            res.data.map((b) => ({
              id: String(b.id),
              title: b.title,
              category: normalizeBucketCategory(
                String(b.id) === primaryBucketId || b.title === storedBucketGoal?.bucketList
                  ? storedBucketGoal?.category
                  : b.category,
              ),
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
              <div className="bg-leftColumn">
              {/* ── 월간 예산 ── */}
              <motion.article
                className="bg-card bg-card--budget"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="bg-cardHead">
                  <h3>월간 예산</h3>
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
                    <div className="bg-progressCharacter">
                      <img src={bgCh1} alt="캐릭터" />
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* ── 예산 가이드 + 이번 달 저축 목표 ── */}
              <motion.article
                className="bg-card bg-card--guide"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="bg-cardHead">
                  <h3>예산 가이드</h3>
                </div>

                <div className="bg-guideGrid">
                  <div className="bg-guideSummary">
                    <div>
                      <strong>{todayDateLabel} | 남은 기간 {daysLeftInMonth}일</strong>
                      <p>이번 달이 끝나기 전 예산을 정리해요</p>
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
              </div>

              {/* ── 버킷리스트 챌린지 ── */}
              <motion.article
                className="bg-card bg-card--challenge"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="bg-cardHead">
                  <h3>버킷리스트 챌린지</h3>
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

                <div className="bg-challengeGridWrap">
                <div className="bg-challengeGrid" ref={gridRef}>
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
                            <img
                              src={
                                stampImagesByCategory[
                                  normalizeBucketCategory(item.category)
                                ]
                              }
                              alt=""
                              aria-hidden="true"
                            />
                          </motion.div>
                          <span className="bg-challengeBadge">
                            칭찬도장 쾅!
                          </span>
                          <span className="bg-challengeCategory">
                            {normalizeBucketCategory(item.category)}
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
                              {item.completedAt || todayDotLabel}
                            </strong>
                          </div>
                        </>
                      ) : (
                        <>
                          <strong>{item.title}</strong>
                          <span className="bg-challengeCategory">
                            {normalizeBucketCategory(item.category)}
                          </span>
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
                {thumbHeight < gridRef.current?.clientHeight && (
                  <div
                    className={`bg-scrollTrack${isDragging ? " is-dragging" : ""}`}
                    aria-hidden="true"
                  >
                    <div
                      className="bg-scrollThumb"
                      ref={thumbRef}
                      style={{ height: thumbHeight }}
                      onMouseDown={handleThumbMouseDown}
                    />
                  </div>
                )}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && depositInput && Number(depositInput) > 0) {
                      handleDeposit(depositInput);
                    }
                  }}
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
