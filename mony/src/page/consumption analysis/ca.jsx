import { useEffect, useRef, useState } from "react";
import coinImg from "../../assets/cm/coin.png";
import { motion, AnimatePresence } from "framer-motion";
import { analysis, buckets as bucketsApi } from "../../api/index.js";
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
import "./ca.css";
import {
  getShortMonthLabel,
  getToday,
  getWeekRangeLabel,
} from "../../utils/date.js";
import JejuImg from "../../assets/ca/jeju.png";
import BusanImg from "../../assets/ca/busan.png";
import JapanImg from "../../assets/ca/japan.png";

const currentShortMonthLabel = getShortMonthLabel();
const todayInputValue = toDateInputValue(getToday());
const currentWeekRangeLabel = getWeekRangeLabel();

/* ─────────────────────────────────────────── 예시 데이터 (폴백) */
const DEMO_COMPLETED_BUCKETS = [
  {
    id: "demo-jeju",
    title: "제주도 여행가기",
    category: "여행",
    mony_ing: 320000,
    mony_finish: 320000,
    d_day: todayInputValue,
  },
];

const DEMO_MEMORIES = {
  "demo-jeju": {
    photoUrl: JejuImg,
    memo: "드디어 제주도 다녀왔어요! 🌊",
    date: todayInputValue,
  },
};

/* ─────────────────────────────────────────── 정적 데이터 */
const weekBars = [
  {
    day: "일",
    value: 42,
    blocks: ["base", "base", "base"],
    period: currentWeekRangeLabel,
    amount: "₩22,000",
    change: "-8%",
    active: false,
  },
  {
    day: "월",
    value: 72,
    blocks: ["light", "accent", "accent", "light"],
    period: currentWeekRangeLabel,
    amount: "₩28,000",
    change: "+12%",
    active: true,
  },
  {
    day: "화",
    value: 64,
    blocks: ["base", "base", "base", "base"],
    period: currentWeekRangeLabel,
    amount: "₩34,000",
    change: "+10%",
    active: false,
  },
  {
    day: "수",
    value: 76,
    blocks: ["base", "base", "base", "base", "base"],
    period: currentWeekRangeLabel,
    amount: "₩36,000",
    change: "+14%",
    active: false,
  },
  {
    day: "목",
    value: 64,
    blocks: ["base", "base", "base", "base"],
    period: currentWeekRangeLabel,
    amount: "₩31,000",
    change: "+6%",
    active: false,
  },
  {
    day: "금",
    value: 38,
    blocks: ["base", "base", "base"],
    period: currentWeekRangeLabel,
    amount: "₩18,000",
    change: "-3%",
    active: false,
  },
  {
    day: "토",
    value: 48,
    blocks: ["base", "base", "base"],
    period: currentWeekRangeLabel,
    amount: "₩24,000",
    change: "+2%",
    active: false,
  },
];

const DEFAULT_FIXED_ITEMS = [
  { title: "줄이기 어려운 소비", value: 256800, suffix: "원", meta: "12건" },
  { title: "조절 가능한 소비", value: 171200, suffix: "원", meta: "6건" },
];

const monthlyItems = [
  { title: "월세", value: 500000, count: "1건" },
  { title: "구독", value: 29000, count: "3건" },
  { title: "식비", value: 180000, count: "4건" },
  { title: "쇼핑", value: 120000, count: "이외 4건" },
];

const SAVEABLE_AMOUNT = 72000;

/* ─────────────────────────────────────────── 카테고리 설정 */
const CATEGORY_CONFIG = {
  여행: { emoji: "✈️", color: "#60a5fa" },
  취미: { emoji: "🎸", color: "#f472b6" },
  자기계발: { emoji: "📚", color: "#a78bfa" },
  쇼핑: { emoji: "🛍️", color: "#fb923c" },
  음식: { emoji: "🍽️", color: "#34d399" },
  문화: { emoji: "🎭", color: "#fbbf24" },
  기타: { emoji: "🌟", color: "#fbbf24" },
};

const BUCKET_TABS = [
  { key: "all", label: "전체" },
  { key: "여행", label: "여행" },
  { key: "취미", label: "취미" },
  { key: "자기계발", label: "자기계발" },
];

function getCat(cat) {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG["기타"];
}

function getProgress(bucket) {
  const target = Number(bucket.mony_ing) || 0;
  const finish = Number(bucket.mony_finish) || 0;
  if (target <= 0) return 0;
  return Math.min(finish / target, 1);
}

const calendarWeekDays = ["일", "월", "화", "수", "목", "금", "토"];

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

function getCalendarCells(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function MemoryDateCalendar({ value, onChange }) {
  const selectedDate = parseDateInput(value);
  const [viewDate, setViewDate] = useState(selectedDate);
  const todayValue = toDateInputValue(new Date());
  const selectedValue = toDateInputValue(selectedDate);

  const moveMonth = (amount) => {
    setViewDate(
      (cur) => new Date(cur.getFullYear(), cur.getMonth() + amount, 1),
    );
  };

  const selectDate = (date) => {
    onChange(toDateInputValue(date));
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const cells = getCalendarCells(viewDate);
  const monthLabel = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;

  return (
    <div className="ca-memoryCalendar">
      <div className="ca-memoryCalendar__top">
        <button
          type="button"
          className="ca-memoryCalendar__nav"
          onClick={() => moveMonth(-1)}
        >
          &lt;
        </button>
        <strong>{monthLabel}</strong>
        <button
          type="button"
          className="ca-memoryCalendar__nav"
          onClick={() => moveMonth(1)}
        >
          &gt;
        </button>
      </div>
      <div className="ca-memoryCalendar__grid">
        {calendarWeekDays.map((day) => (
          <span key={day} className="ca-memoryCalendar__day">
            {day}
          </span>
        ))}
        {cells.map((date) => {
          const dateValue = toDateInputValue(date);
          const isSelected = dateValue === selectedValue;
          const isToday = dateValue === todayValue;
          const isMuted = date.getMonth() !== viewDate.getMonth();
          return (
            <button
              key={dateValue}
              type="button"
              className={[
                "ca-memoryCalendar__date",
                isSelected ? "is-selected" : "",
                isToday ? "is-today" : "",
                isMuted ? "is-muted" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => selectDate(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── MemoryCard */
function MemoryCard({ bucket, memoryData, onOpenModal }) {
  const cat = getCat(bucket.category);
  const pct = Math.round(getProgress(bucket) * 100);

  const getDefaultPhoto = () => {
    if (memoryData?.photoUrl) return memoryData.photoUrl;
    const title = bucket.title || bucket.bucket_name || "";
    if (title.includes("제주")) return JejuImg;
    if (title.includes("부산")) return BusanImg;
    if (title.includes("일본") || title.includes("나고야")) return JapanImg;
    return null;
  };
  const photoUrl = getDefaultPhoto();

  return (
    <motion.div
      className="ca-mc"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpenModal(bucket.id)}
      style={{ cursor: "pointer" }}
    >
      <div className="ca-mc__badges">
        <span className="ca-mc__catLabel" style={{ color: cat.color }}>
          {cat.emoji} {bucket.category || "기타"}
        </span>
        <span className="ca-mc__done">✓ 달성</span>
      </div>

      {photoUrl ? (
        <div className="ca-mc__photo">
          <img src={photoUrl} alt="추억" />
          <div className="ca-mc__photoHoverOverlay">
            <span>추억 {memoryData?.memo ? "보기" : "남기기"} ›</span>
          </div>
        </div>
      ) : (
        <div className="ca-mc__photoAdd">
          <span className="ca-mc__photoIcon">📷</span>
          <span>클릭해서 추억 남기기</span>
        </div>
      )}

      <div className="ca-mc__info">
        <h4 className="ca-mc__name">{bucket.title || bucket.bucket_name}</h4>
        <div className="ca-mc__amountRow">
          <span className="ca-mc__amount">
            {(bucket.mony_finish || 0).toLocaleString()}원
          </span>
          <span className="ca-mc__pct">{pct}%</span>
        </div>
        <div className="ca-mc__bar">
          <motion.div
            className="ca-mc__barFill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: getProgress(bucket) }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </div>
        {(memoryData?.date || bucket.d_day) && (
          <span className="ca-mc__date">
            {new Date(memoryData?.date || bucket.d_day).toLocaleDateString(
              "ko-KR",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </span>
        )}
      </div>

      <button
        type="button"
        className="ca-mc__toggle"
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal(bucket.id);
        }}
      >
        {memoryData?.memo ? "추억 보기 ›" : "추억 남기기 ›"}
      </button>

      {memoryData?.memo && (
        <p className="ca-mc__memoPreview">{memoryData.memo}</p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────── 메인 컴포넌트 */
export default function Ca() {
  const name = localStorage.getItem("joinName")?.trim() || "사용자";

  const [caSavedAmount, setCaSavedAmount] = useState(null);
  const [fixedItems, setFixedItems] = useState(DEFAULT_FIXED_ITEMS);
  const [totalSpent, setTotalSpent] = useState(326000);

  /* 완료 버킷 */
  const [completedBuckets, setCompletedBuckets] = useState([]);
  const [bucketsLoading, setBucketsLoading] = useState(true);
  const [bucketTab, setBucketTab] = useState("all");

  /* 추억 데이터 */
  const [memories, setMemories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("mony_memories") || "{}");
      return { ...DEMO_MEMORIES, ...saved };
    } catch {
      return DEMO_MEMORIES;
    }
  });

  /* 모달 state */
  const [modalBucketId, setModalBucketId] = useState(null);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [modalMemo, setModalMemo] = useState("");
  const [modalDate, setModalDate] = useState("");
  const modalFileRef = useRef(null);

  const openModal = (bucketId) => {
    const existing = memories[bucketId];
    setModalBucketId(bucketId);
    setModalPhoto(existing?.photoUrl || null);
    setModalMemo(existing?.memo || "");
    setModalDate(existing?.date || new Date().toISOString().slice(0, 10));
  };
  const closeModal = () => {
    setModalBucketId(null);
    setModalPhoto(null);
    setModalMemo("");
    setModalDate("");
  };
  const saveModal = () => {
    if (!modalBucketId) return;
    handleSaveMemory(modalBucketId, {
      photoUrl: modalPhoto,
      memo: modalMemo,
      date: modalDate,
    });
    closeModal();
  };
  const onModalFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setModalPhoto(URL.createObjectURL(f));
  };

  /* analysis API */
  useEffect(() => {
    const periodDetail = new Date().toISOString().slice(0, 7);
    analysis
      .summary(periodDetail)
      .then((res) => {
        const d = res.data;
        if (!d) return;
        if (d.total > 0) setTotalSpent(d.total);
        if (d.fixed > 0 || d.variable > 0) {
          setFixedItems([
            {
              title: "줄이기 어려운 소비",
              value: d.fixed,
              suffix: "원",
              meta: "고정 지출",
            },
            {
              title: "조절 가능한 소비",
              value: d.variable,
              suffix: "원",
              meta: "변동 지출",
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  /* 버킷 API */
  useEffect(() => {
    setBucketsLoading(true);
    bucketsApi
      .getAll()
      .then((res) => {
        try {
          const all = Array.isArray(res?.data) ? res.data : [];
          const done = all.filter((b) => {
            const target = Number(b.mony_ing) || 0;
            const finish = Number(b.mony_finish) || 0;
            const prob = Number(b.probability) || 0;
            return (target > 0 && finish >= target) || prob >= 100;
          });
          setCompletedBuckets(done.length > 0 ? done : DEMO_COMPLETED_BUCKETS);
        } catch {
          setCompletedBuckets(DEMO_COMPLETED_BUCKETS);
        }
      })
      .catch(() => setCompletedBuckets(DEMO_COMPLETED_BUCKETS))
      .finally(() => setBucketsLoading(false));
  }, []);

  const handleSaveMemory = (bucketId, data) => {
    const updated = { ...memories, [bucketId]: data };
    setMemories(updated);
    localStorage.setItem("mony_memories", JSON.stringify(updated));
  };

  const handleCaSave = (amount) => {
    const prev = Number(localStorage.getItem("mony_saved_amount") ?? 0);
    localStorage.setItem("mony_saved_amount", String(prev + amount));
    setCaSavedAmount(amount);
  };

  /* 탭 필터 */
  const filteredBuckets =
    bucketTab === "all"
      ? completedBuckets
      : completedBuckets.filter((b) => (b.category || "기타") === bucketTab);

  /* 이미지 디자인의 통계 수치들 */
  const statsRow = [
    { label: "전체 소비", value: "약 42%" },
    { label: "목표 성공 금액", value: "8% ↑" },
    { label: "지난 달에 비해", value: "12% ↑" },
  ];

  const savingsCards = [
    { label: "예산 대비\n절약 금액", sub: "예산보다 덜 쓴 금액", value: 72000 },
    {
      label: "지난달 대비\n감소한 지출",
      sub: "지난달 대비 절감",
      value: 28000,
    },
    {
      label: "이번달 저금통\n적립 가능액",
      sub: "저금통 반영 가능",
      value: 10000,
    },
  ];

  /* 모달에서 보여줄 버킷 정보 */
  const modalBucket = modalBucketId
    ? completedBuckets.find((b) => String(b.id) === String(modalBucketId))
    : null;

  return (
    <main className="ca-page">
      <div className="ca-shell">
        <Menu />

        <section className="ca-main">
          <HomeHeader />

          {/* ══ 분석 프레임 ══ */}
          <motion.section
            className="ca-analysisFrame"
            variants={revealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="ca-toolbar">
              <span>카카오뱅크, {name}의 카방카드</span>
              <span aria-hidden="true">⌄</span>
            </div>

            <motion.div
              className="ca-gridTop"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* 주간 소비량 카드 */}
              <motion.article
                className="ca-card ca-card--weekly"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="ca-cardHead">
                  <div>
                    <p>{currentShortMonthLabel}</p>
                    <strong>월 진행 대비 소비량</strong>
                  </div>
                  <span>시간 대비 소비 70%</span>
                </div>
                <div className="ca-progressPair">
                  <div className="ca-progressRow">
                    <span>시간</span>
                    <div className="ca-progressTrack">
                      <ProgressFill
                        className="ca-progressFill is-orange"
                        value={0.54}
                      />
                    </div>
                    <strong>50%</strong>
                  </div>
                  <div className="ca-progressRow">
                    <span>지출</span>
                    <div className="ca-progressTrack">
                      <ProgressFill
                        className="ca-progressFill is-lime"
                        value={0.72}
                      />
                    </div>
                    <strong>70%</strong>
                  </div>
                </div>
                <div className="ca-savingsInsight">
                  <p className="ca-insightItem">
                    <span className="ca-insightDot" />
                    지난주보다 <strong>28,000원</strong> 덜 썼어요.
                  </p>
                  <p className="ca-insightItem">
                    <span className="ca-insightDot is-dim" />
                    저금통에 넣으면 목표 달성률이{" "}
                    <strong className="is-lime">5% 올라가요.</strong>
                  </p>
                </div>
                <div className="ca-miniGrid">
                  <div className="ca-miniCard">
                    <span>주간 | {currentWeekRangeLabel}</span>
                    <strong>총 지출</strong>
                    <strong>₩28,000</strong>
                    <small>주변비례 +12%</small>
                  </div>
                  <div className="ca-miniCard">
                    <span>지난달 대비 누적 소비</span>
                    <strong>이번달 누적</strong>
                    <strong>₩428,000</strong>
                    <small>지난달 누적 ₩380,000</small>
                  </div>
                  <div className="ca-miniCard ca-miniCard--steady">
                    <span className="ca-miniCard__label">
                      안정적인 적정 소비
                    </span>
                    <div className="march-div">
                      <strong className="march">{currentShortMonthLabel},</strong>
                      <br />
                      <strong className="march-description">
                        소비 패턴의 균형의 <br /> 유지가 적절해요
                      </strong>
                    </div>
                  </div>
                  <div className="ca-miniCard">
                    <span>{currentShortMonthLabel}의 지출</span>
                    <strong>최다지출</strong>
                    <strong>₩125,000</strong>
                    <small>적정소비 주간 소비 비중↑</small>
                  </div>
                  <div className="ca-miniCard">
                    <span>이번 달 소비 속도</span>
                    <strong>예상지출</strong>
                    <strong>₩530,000</strong>
                    <small>예상 대비 적정한 지출량</small>
                  </div>
                </div>
              </motion.article>

              {/* 차트 카드 */}
              <motion.article
                className="ca-card ca-card--chart"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="ca-cardHead">
                  <div>
                    <p>{currentShortMonthLabel} 사용금액</p>
                    <strong className="ca-cardHeadStrong">
                      <CountUp value={totalSpent} suffix="원" />
                    </strong>
                  </div>
                </div>
                <div className="ca-weekChart">
                  <div className="ca-weekScale" aria-hidden="true">
                    <span>31</span>
                    <span>1</span>
                  </div>
                  <div className="ca-weekGrid" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="ca-weekBars">
                    {weekBars.map((bar, index) => (
                      <div key={bar.day} className="ca-weekBarWrap">
                        <motion.div
                          className={`ca-weekBar ${bar.active ? "is-active" : ""}`}
                          initial={{ scaleY: 0.35, opacity: 0.5 }}
                          whileInView={{ scaleY: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: 0.9,
                            delay: index * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{ height: `${bar.value}%` }}
                        >
                          {bar.blocks.map((block, bi) => (
                            <span
                              key={`${bar.day}-${bi}`}
                              className={`ca-weekBlock is-${block}`}
                            />
                          ))}
                        </motion.div>
                        <div className="ca-weekTooltip" role="tooltip">
                          <strong>{bar.period}</strong>
                          <span>
                            <i aria-hidden="true" />총 지출<b>{bar.amount}</b>
                          </span>
                          <span>
                            <i aria-hidden="true" />
                            주별대비<b>{bar.change}</b>
                          </span>
                        </div>
                        <span className="ca-weekDay">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            </motion.div>
          </motion.section>

          {/* ══ 절약 분석 카드 ══ */}
          <motion.section
            className="ca-savingsSection"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.article
              className="ca-card ca-card--savings"
              variants={staggerItemVariants}
              {...cardMotion}
            >
              <div className="ca-sv__inner">
                <span className="testtest">절약 분석</span>
                <div className="ca-sv__body">
                  {/* ── 좌측 */}
                  <div className="ca-sv__left">
                    {/* 상단 둥근 박스: 총금액 왼쪽 / 통계3개 오른쪽 */}
                    <div className="ca-sv__topBox">
                      <div className="ca-sv__totalBlock">
                        <span className="ca-sv__totalLabel">
                          이번달 저축 가능 금액
                        </span>
                        <strong className="ca-sv__totalAmount">
                          총 <CountUp value={SAVEABLE_AMOUNT} suffix="원" />
                        </strong>
                      </div>
                      <div className="ca-sv__statsRow">
                        {statsRow.map((s) => (
                          <div key={s.label} className="ca-sv__stat">
                            <span>{s.label}</span>
                            <strong>{s.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 하단 카드 3개: 라벨(상단) → 서브(중간) → 큰금액(하단) */}
                    <div className="ca-sv__cards">
                      {savingsCards.map((card) => (
                        <div key={card.label} className="ca-sv__card">
                          <span className="ca-sv__cardLabel">{card.label}</span>
                          <small className="ca-sv__cardSub">{card.sub}</small>
                          <strong className="ca-sv__cardAmount">
                            <CountUp value={card.value} suffix="원" />
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── 우측 */}
                  <div className="ca-sv__right">
                    {/* 코인 + 적립버튼 묶음 */}
                    <div className="ca-sv__coinWrap">
                      <div className="ca-savingsCoinArea" aria-hidden="true">
                        <span>₩</span>
                      </div>
                      <button
                        type="button"
                        className="ca-sv__depositBtn"
                        onClick={() => handleCaSave(SAVEABLE_AMOUNT)}
                      >
                        {SAVEABLE_AMOUNT.toLocaleString()}원<br />
                        적립하기
                      </button>
                    </div>

                    {/* 초록 반응 박스 */}
                    <div
                      className={`ca-sv__reaction ${caSavedAmount !== null ? "is-saved" : ""}`}
                    >
                      <div className="ca-sv__reactionTop">
                        <img
                          className="ca-sv__reactionChar"
                          src={coinImg}
                          alt=""
                          aria-hidden="true"
                        />
                        <span className="ca-sv__reactionBadge">
                          {caSavedAmount !== null ? "적립완료" : "대기중"}
                        </span>
                      </div>
                      <span className="ca-sv__reactionTime">방금전</span>
                      <p className="ca-sv__reactionMsg">
                        {caSavedAmount !== null ? (
                          <>
                            <strong>
                              {caSavedAmount.toLocaleString()}원이
                            </strong>
                            <br />
                            저축 저금통에 반영됐어요!
                          </>
                        ) : (
                          <>
                            적립 버튼을 눌러
                            <br />
                            저금통에 넣어보세요!
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.section>

          {/* ══ 하단 2열 그리드 ══ */}
          <motion.section
            className="ca-middleGrid"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            {/* 소비 구조 분석 */}
            <motion.article
              className="ca-card ca-card--fixed"
              variants={staggerItemVariants}
              {...cardMotion}
            >
              <div className="ca-cardHead">
                <h3>소비 구조 분석</h3>
              </div>
              <p className="ca-fixedConvert">
                이번 달 조절 가능한 소비 중 <strong>42,000원</strong>을 저축으로
                전환할 수 있어요.
              </p>
              <div className="ca-fixedSummary">
                {fixedItems.map((item) => (
                  <div key={item.title} className="ca-fixedRow">
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        <CountUp value={item.value} suffix={item.suffix} />
                      </span>
                    </div>
                    <small>{item.meta}</small>
                  </div>
                ))}
              </div>
              <div className="ca-fixedGrid">
                {monthlyItems.map((item) => (
                  <div key={item.title} className="ca-fixedCard">
                    <div className="ca-fixedCardTop">
                      <strong>{item.title}</strong>
                      <span>
                        <CountUp value={item.value} suffix="원" />
                      </span>
                    </div>
                    <div className="ca-fixedCardFoot">
                      <small>{item.count}</small>
                      <span>고정카드/계좌</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>

            {/* ══ 달성 버킷 추억 카드 ══ */}
            <motion.article
              className="ca-card ca-card--travel"
              variants={staggerItemVariants}
              {...cardMotion}
            >
              <div className="ca-cardHead">
                <div className="ca-travelHead">
                  <h3>달성한 버킷리스트</h3>
                  <strong>저축 완료 · 추억 저장소</strong>
                </div>
              </div>

              {/* 카테고리 탭 */}
              {!bucketsLoading && completedBuckets.length > 0 && (
                <div className="ca-mc__tabs" role="tablist">
                  {BUCKET_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={bucketTab === tab.key}
                      className={`ca-mc__tab ${bucketTab === tab.key ? "is-active" : ""}`}
                      onClick={() => setBucketTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {!bucketsLoading && completedBuckets.length > 0 && (
                <div className="ca-mc__summary">
                  <span>
                    🏆 총 <b>{completedBuckets.length}개</b> 달성
                  </span>
                  <span>
                    💰{" "}
                    <b>
                      {completedBuckets
                        .reduce((s, b) => s + (Number(b.mony_finish) || 0), 0)
                        .toLocaleString()}
                      원
                    </b>{" "}
                    저축 완료
                  </span>
                </div>
              )}

              {bucketsLoading && (
                <div className="ca-mc__loading">
                  <span className="ca-mc__dot" />
                  <span className="ca-mc__dot" />
                  <span className="ca-mc__dot" />
                </div>
              )}

              {!bucketsLoading && completedBuckets.length === 0 && (
                <div className="ca-mc__empty">
                  <span className="ca-mc__emptyIcon">🏆</span>
                  <p>아직 달성한 버킷이 없어요</p>
                  <span>저축 목표를 달성하면 여기에 추억이 쌓여요!</span>
                </div>
              )}

              {!bucketsLoading &&
                filteredBuckets.length === 0 &&
                completedBuckets.length > 0 && (
                  <div className="ca-mc__empty">
                    <span className="ca-mc__emptyIcon">🔍</span>
                    <p>이 카테고리에 달성한 버킷이 없어요</p>
                  </div>
                )}

              {!bucketsLoading && filteredBuckets.length > 0 && (
                <motion.div
                  className="ca-mc__grid"
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredBuckets.map((bucket) => (
                    <MemoryCard
                      key={bucket.id}
                      bucket={bucket}
                      memoryData={memories[bucket.id]}
                      onSave={handleSaveMemory}
                      onOpenModal={openModal}
                    />
                  ))}
                </motion.div>
              )}
            </motion.article>
          </motion.section>
        </section>
      </div>

      {/* ══ 추억 입력 모달 ══ */}
      <AnimatePresence>
        {modalBucketId && (
          <motion.div
            className="ca-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="ca-modal"
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ca-modal__head">
                <div className="ca-modal__headLeft">
                  {modalBucket && (
                    <span className="ca-modal__bucketTitle">
                      {getCat(modalBucket.category).emoji}{" "}
                      {modalBucket.title || modalBucket.bucket_name}
                    </span>
                  )}
                  <span className="ca-modal__title">추억 남기기</span>
                </div>
                <button className="ca-modal__close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div
                className="ca-modal__photoArea"
                onClick={() => modalFileRef.current?.click()}
              >
                {modalPhoto ? (
                  <img
                    src={modalPhoto}
                    alt="추억 사진"
                    className="ca-modal__photoPreview"
                  />
                ) : (
                  <div className="ca-modal__photoEmpty">
                    <p>사진을 추가해보세요</p>
                    <small>클릭해서 업로드</small>
                  </div>
                )}
                {modalPhoto && (
                  <div className="ca-modal__photoOverlay">
                    <span>사진 변경</span>
                  </div>
                )}
              </div>
              <input
                ref={modalFileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onModalFile}
              />

              <div className="ca-modal__field">
                <label className="ca-modal__label">달성 날짜</label>
                <MemoryDateCalendar value={modalDate} onChange={setModalDate} />
              </div>

              <div className="ca-modal__field">
                <label className="ca-modal__label">추억 메모</label>
                <textarea
                  className="ca-modal__textarea"
                  placeholder="이 목표를 달성한 순간의 기억을 남겨보세요!"
                  value={modalMemo}
                  maxLength={200}
                  onChange={(e) => setModalMemo(e.target.value)}
                />
                <span className="ca-modal__charCount">
                  {modalMemo.length}/200
                </span>
              </div>

              <button className="ca-modal__saveBtn" onClick={saveModal}>
                추억 저장하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
