import { useEffect, useMemo, useRef, useState } from "react";
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

import {
  getDaysLeftInMonth,
  getDotDateLabel,
  getKoreanDateLabel,
  getShortMonthLabel,
} from "../../utils/date.js";

import bgCh1 from "../../assets/home/bg_ch1.png";
import tripStamp from "../../assets/home/trip.png";
import hobbyStamp from "../../assets/home/hobby.png";
import improvementStamp from "../../assets/home/improvement.png";

import "./bg.css";

const DEFAULT_BUCKET_CATEGORY = "여행";
const DEFAULT_SAVINGS_GOAL = 100000;

const BUCKET_CATEGORIES = ["자기계발", "취미", "여행"];

const STAMP_IMAGES_BY_CATEGORY = {
  여행: tripStamp,
  취미: hobbyStamp,
  자기계발: improvementStamp,
};

const COMPLETED_MESSAGES = [
  "잘했어요! 목표를 끝까지 달성했어요.",
  "이번 목표도 멋지게 성공했어요.",
  "작은 저축이 큰 성취가 되었어요.",
];

const todayDateLabel = getKoreanDateLabel();
const todayDotLabel = getDotDateLabel();
const currentShortMonthLabel = getShortMonthLabel();
const daysLeftInMonth = getDaysLeftInMonth();

const goalStats = [
  { label: `${currentShortMonthLabel} 예산`, value: 550000, suffix: "원" },
  {
    label: `${currentShortMonthLabel} 사용금액`,
    value: 428000,
    suffix: "원",
    extra: "(78%)",
  },
  { label: "남은 예산 금액", value: 122000, suffix: "원" },
  { label: "평균 횟수", value: 62, suffix: "건" },
];

const monthlyCategories = [
  { name: "식비", used: 250000, budget: 180000, note: "초과 70,000원" },
  { name: "쇼핑", used: 116700, budget: 120000, note: "여유" },
];

const defaultChallengeCards = [
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
  ...BUCKET_CATEGORIES.map((category) => ({
    key: category,
    label: category,
  })),
];

const formatWon = (value) => Number(value).toLocaleString();

const normalizeBucketCategory = (category) =>
  BUCKET_CATEGORIES.includes(category) ? category : DEFAULT_BUCKET_CATEGORY;

const getTodayKoDate = () =>
  new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const getLocalStorageNumber = (key, fallback = 0) => {
  const value = localStorage.getItem(key);
  return value ? Number(value) : fallback;
};

const readPrimaryBucketGoal = () =>
  safeJsonParse(localStorage.getItem("bucketGoal"), null);

const readBucketGoalsFromStorage = () => {
  const today = getTodayKoDate();
  const savedGoals = safeJsonParse(localStorage.getItem("bucketGoals"), []);
  const primaryGoal = readPrimaryBucketGoal();

  const goals = Array.isArray(savedGoals) ? [...savedGoals] : [];

  if (primaryGoal?.bucketList) {
    goals.unshift({
      id: `bucket-${primaryGoal.bucketList}`,
      title: primaryGoal.bucketList,
      targetAmount: Number(primaryGoal.targetAmount) || 0,
      currentAmount: Number(primaryGoal.currentSaved) || 0,
      status: primaryGoal.status,
      category: normalizeBucketCategory(primaryGoal.category),
      completedAt: primaryGoal.completedAt,
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
      status: isCompleted || goal.status === "completed" ? "completed" : "progress",
      completedAt: isCompleted ? goal.completedAt || today : goal.completedAt || "",
    };
  });
};

const normalizeChallenge = (item) => {
  const targetAmount = Number(item.targetAmount) || 0;
  const currentAmount = Number(item.currentAmount) || 0;
  const progress = targetAmount ? Math.min(currentAmount / targetAmount, 1) : 0;
  const isCompleted = targetAmount > 0 && currentAmount >= targetAmount;

  return {
    ...item,
    targetAmount,
    currentAmount,
    progress,
    status: isCompleted ? "completed" : item.status,
    category: normalizeBucketCategory(item.category),
  };
};

function useCustomScrollbar(deps = []) {
  const gridRef = useRef(null);
  const thumbRef = useRef(null);

  const thumbHeightRef = useRef(0);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const [thumbHeight, setThumbHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollbar = () => {
    const el = gridRef.current;
    if (!el) return;

    const scrollableHeight = Math.max(el.scrollHeight - el.clientHeight, 1);
    const ratio = el.scrollTop / scrollableHeight;
    const nextThumbHeight = Math.max(
      (el.clientHeight / el.scrollHeight) * el.clientHeight,
      28,
    );

    thumbHeightRef.current = nextThumbHeight;
    setThumbHeight(nextThumbHeight);

    if (thumbRef.current) {
      const maxThumbY = Math.max(el.clientHeight - nextThumbHeight, 0);
      thumbRef.current.style.transform = `translateY(${ratio * maxThumbY}px)`;
    }
  };

  const handleThumbMouseDown = (e) => {
    e.preventDefault();

    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = gridRef.current?.scrollTop ?? 0;
  };

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    updateScrollbar();

    el.addEventListener("scroll", updateScrollbar, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, deps);

  useEffect(() => {
    if (!isDragging) return;

    const el = gridRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const trackHeight = el.clientHeight;
      const scrollableHeight = el.scrollHeight - el.clientHeight;
      const movableThumbHeight = trackHeight - thumbHeightRef.current;

      if (movableThumbHeight <= 0) return;

      const dy = e.clientY - dragStartY.current;
      const scrollDelta = (dy / movableThumbHeight) * scrollableHeight;
      const nextScrollTop = dragStartScrollTop.current + scrollDelta;

      el.scrollTop = Math.max(0, Math.min(nextScrollTop, scrollableHeight));
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const shouldShowScrollbar =
    thumbHeight > 0 && thumbHeight < (gridRef.current?.clientHeight ?? 0);

  return {
    gridRef,
    thumbRef,
    thumbHeight,
    isDragging,
    shouldShowScrollbar,
    handleThumbMouseDown,
  };
}

function BudgetCard() {
  return (
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
                {item.extra && <small>{item.extra}</small>}
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
  );
}

function GuideCard({
  savingsGoal,
  savingsAmount,
  savingsProgress,
  savingsMilestones,
  isGoalReached,
  onOpenSavingsModal,
}) {
  return (
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
            <strong>
              {todayDateLabel} | 남은 기간 {daysLeftInMonth}일
            </strong>
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

      <div className="bg-savingsGoal">
        <div className="bg-savingsGoalHeader">
          <div>
            <span className="bg-savingsGoalLabel">이번 달 저축 목표</span>
            <strong className="bg-savingsGoalTitle">
              <CountUp value={savingsAmount} suffix="원" />
              <em> / {formatWon(savingsGoal)}원</em>
            </strong>
          </div>

          <span className="bg-savingsGoalPct">
            {Math.round(savingsProgress * 100)}%
          </span>
        </div>

        <div className="bg-savingsTrackWrap">
          <div className="bg-savingsTrack">
            <ProgressFill className="bg-progressFill is-lime" value={savingsProgress} />
          </div>

          <div className="bg-savingsMilestones">
            {savingsMilestones.map((milestone) => {
              const reached = savingsAmount >= milestone.value;
              const left = savingsGoal > 0 ? (milestone.value / savingsGoal) * 100 : 0;

              return (
                <div
                  key={milestone.label}
                  className={`bg-savingsDot ${reached ? "is-reached" : ""}`}
                  style={{ left: `${left}%` }}
                >
                  <span>{milestone.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {isGoalReached ? (
          <div className="bg-savingsComplete">🎉 이번 달 저축 목표 달성!</div>
        ) : (
          <button className="bg-savingsBtn" onClick={onOpenSavingsModal}>
            + 저축 적립하기
          </button>
        )}
      </div>
    </motion.article>
  );
}

function ChallengeCard({ item, index }) {
  const category = normalizeBucketCategory(item.category);
  const remainAmount = Math.max(item.targetAmount - item.currentAmount, 0);

  if (item.status === "completed") {
    return (
      <motion.div
        className="bg-challengeCard is-completed"
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, delay: index * 0.04 }}
      >
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
          <img src={STAMP_IMAGES_BY_CATEGORY[category]} alt="" aria-hidden="true" />
        </motion.div>

        <span className="bg-challengeBadge">칭찬도장 쾅!</span>
        <span className="bg-challengeCategory">{category}</span>

        <strong>{item.title}</strong>
        <p>{COMPLETED_MESSAGES[index % COMPLETED_MESSAGES.length]}</p>

        <div className="bg-challengeCompleteMeta">
          <span>완료 금액</span>
          <strong>{formatWon(item.targetAmount)}원</strong>

          <span>달성 날짜</span>
          <strong>{item.completedAt || todayDotLabel}</strong>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-challengeCard is-progress"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, delay: index * 0.04 }}
    >
      <strong>{item.title}</strong>
      <span className="bg-challengeCategory">{category}</span>
      <span>버킷리스트 진행 중</span>

      <div className="bg-challengeAmount">
        <CountUp value={item.currentAmount} suffix="원" />
        <small> / {formatWon(item.targetAmount)}원</small>
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
        목표까지 {formatWon(remainAmount)}원 남았어요
      </p>

      <span className="bg-challengePct">
        현재 {Math.round(item.progress * 100)}% 달성 중
      </span>
    </motion.div>
  );
}

function ChallengeSection({
  challengeTab,
  setChallengeTab,
  filteredChallenges,
  completedCount,
  progressCount,
  totalCompletedAmount,
}) {
  const {
    gridRef,
    thumbRef,
    thumbHeight,
    isDragging,
    shouldShowScrollbar,
    handleThumbMouseDown,
  } = useCustomScrollbar([filteredChallenges]);

  return (
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
          <strong>{completedCount}개</strong>
        </div>
        <div>
          <span>진행 중인 버킷리스트</span>
          <strong>{progressCount}개</strong>
        </div>
        <div>
          <span>총 달성 금액</span>
          <strong>{formatWon(totalCompletedAmount)}원</strong>
        </div>
      </div>

      <div className="bg-challengeTabs" role="tablist" aria-label="버킷리스트 상태">
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
            <ChallengeCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {shouldShowScrollbar && (
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
  );
}

function SavingsModal({
  savingsGoal,
  savingsAmount,
  depositInput,
  setDepositInput,
  onClose,
  onDeposit,
}) {
  const remainAmount = Math.max(savingsGoal - savingsAmount, 0);
  const quickAmounts = [5000, 10000, 30000, 50000];
  const isValidAmount = depositInput && Number(depositInput) > 0;

  return (
    <motion.div
      className="bg-modalOverlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
            {formatWon(remainAmount)}원
          </strong>{" "}
          남았어요
        </p>

        <div className="bg-modalQuick">
          {quickAmounts.map((amount) => (
            <button key={amount} onClick={() => setDepositInput(String(amount))}>
              {formatWon(amount)}원
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
              if (e.key === "Enter" && isValidAmount) {
                onDeposit(depositInput);
              }
            }}
          />
          <span>원</span>
        </div>

        <button
          className="bg-modalConfirm"
          onClick={() => onDeposit(depositInput)}
          disabled={!isValidAmount}
        >
          {isValidAmount
            ? `${formatWon(depositInput)}원 저축하기`
            : "금액을 입력해주세요"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Bg() {
  const [savingsGoal, setSavingsGoal] = useState(() =>
    getLocalStorageNumber("mony_savings_goal", DEFAULT_SAVINGS_GOAL),
  );
  const [savingsAmount, setSavingsAmount] = useState(() =>
    getLocalStorageNumber("mony_saved_amount", 0),
  );

  const [bucketChallenges, setBucketChallenges] = useState([]);
  const [challengeTab, setChallengeTab] = useState("all");

  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [depositInput, setDepositInput] = useState("");
  const [toastMsg, setToastMsg] = useState(null);

  const savingsProgress = savingsGoal > 0 ? Math.min(savingsAmount / savingsGoal, 1) : 0;
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

  const allChallenges = useMemo(
    () => [...bucketChallenges, ...defaultChallengeCards].map(normalizeChallenge),
    [bucketChallenges],
  );

  const progressChallenges = useMemo(
    () => allChallenges.filter((item) => item.status !== "completed"),
    [allChallenges],
  );

  const completedChallenges = useMemo(
    () => allChallenges.filter((item) => item.status === "completed"),
    [allChallenges],
  );

  const filteredChallenges = useMemo(() => {
    if (challengeTab === "all") return allChallenges;

    if (BUCKET_CATEGORIES.includes(challengeTab)) {
      return allChallenges.filter((item) => item.category === challengeTab);
    }

    return allChallenges.filter((item) => item.status === challengeTab);
  }, [allChallenges, challengeTab]);

  const totalCompletedAmount = useMemo(
    () => completedChallenges.reduce((sum, item) => sum + item.targetAmount, 0),
    [completedChallenges],
  );

  const handleDeposit = (amount) => {
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) return;

    const nextTotal = Math.min(savingsAmount + depositAmount, savingsGoal);

    setSavingsAmount(nextTotal);
    localStorage.setItem("mony_saved_amount", String(nextTotal));

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "mony_saved_amount",
        newValue: String(nextTotal),
      }),
    );

    setShowSavingsModal(false);
    setDepositInput("");

    setToastMsg(
      nextTotal >= savingsGoal
        ? "🎉 이번 달 저축 목표 달성! 훌륭해요!"
        : `🪙 ${formatWon(depositAmount)}원 저축 완료!`,
    );

    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    goalsApi
      .getAll()
      .then((res) => {
        const periodDetail = new Date().toISOString().slice(0, 7);
        const goals = res.data ?? [];

        const monthlyGoal =
          goals.find(
            (goal) =>
              goal.period_type === "monthly" &&
              goal.period_detail === periodDetail,
          ) ?? goals[0];

        if (monthlyGoal?.target_amount) {
          setSavingsGoal(monthlyGoal.target_amount);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bucketsApi
      .getAll()
      .then((res) => {
        const buckets = res.data ?? [];

        if (buckets.length === 0) {
          setBucketChallenges(readBucketGoalsFromStorage());
          return;
        }

        const today = getTodayKoDate();
        const primaryBucketId = localStorage.getItem("mony_primary_bucket_id");
        const storedBucketGoal = readPrimaryBucketGoal();

        const primaryBucket =
          buckets.find((bucket) => String(bucket.id) === primaryBucketId) ??
          buckets[0];

        if (primaryBucket) {
          localStorage.setItem("mony_primary_bucket_id", String(primaryBucket.id));
        }

        const normalizedBuckets = buckets.map((bucket) => {
          const isPrimaryBucket =
            String(bucket.id) === primaryBucketId ||
            bucket.title === storedBucketGoal?.bucketList;

          const isCompleted = (bucket.probability ?? 0) >= 100;

          return {
            id: String(bucket.id),
            title: bucket.title,
            category: normalizeBucketCategory(
              isPrimaryBucket ? storedBucketGoal?.category : bucket.category,
            ),
            targetAmount: bucket.mony_ing || 0,
            currentAmount: bucket.mony_finish || 0,
            status: isCompleted ? "completed" : "progress",
            completedAt: isCompleted ? today : "",
          };
        });

        setBucketChallenges(normalizedBuckets);
      })
      .catch(() => {
        setBucketChallenges(readBucketGoalsFromStorage());
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
                <BudgetCard />

                <GuideCard
                  savingsGoal={savingsGoal}
                  savingsAmount={savingsAmount}
                  savingsProgress={savingsProgress}
                  savingsMilestones={savingsMilestones}
                  isGoalReached={isGoalReached}
                  onOpenSavingsModal={() => setShowSavingsModal(true)}
                />
              </div>

              <ChallengeSection
                challengeTab={challengeTab}
                setChallengeTab={setChallengeTab}
                filteredChallenges={filteredChallenges}
                completedCount={completedChallenges.length}
                progressCount={progressChallenges.length}
                totalCompletedAmount={totalCompletedAmount}
              />
            </motion.div>
          </motion.section>
        </section>
      </div>

      <AnimatePresence>
        {showSavingsModal && (
          <SavingsModal
            savingsGoal={savingsGoal}
            savingsAmount={savingsAmount}
            depositInput={depositInput}
            setDepositInput={setDepositInput}
            onClose={() => setShowSavingsModal(false)}
            onDeposit={handleDeposit}
          />
        )}
      </AnimatePresence>

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
