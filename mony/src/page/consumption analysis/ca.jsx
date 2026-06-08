import { useEffect, useRef, useState } from "react";
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
import JejuImg  from "../../assets/ca/jeju.png";
import BusanImg from "../../assets/ca/busan.png";
import JapanImg from "../../assets/ca/japan.png";

/* ─────────────────────────────────────────── 예시 데이터 (폴백) */
const DEMO_COMPLETED_BUCKETS = [
  {
    id: "demo-jeju",
    title: "제주도 여행가기",
    category: "여행",
    mony_ing: 320000,
    mony_finish: 320000,
    d_day: "2023-04-13",
  },
];

const DEMO_MEMORIES = {
  "demo-jeju": { photoUrl: JejuImg, memo: "드디어 제주도 다녀왔어요! 🌊", date: "2023-04-13" },
};

/* ─────────────────────────────────────────── 정적 데이터 */
const weekBars = [
  { day: "일", value: 42, blocks: ["base","base","base"],             period: "3/16(일) - 3/22(토)", amount: "₩22,000", change: "-8%",  active: false },
  { day: "월", value: 72, blocks: ["light","accent","accent","light"], period: "3/23(월) - 3/30(일)", amount: "₩28,000", change: "+12%", active: true  },
  { day: "화", value: 64, blocks: ["base","base","base","base"],       period: "3/24(화) - 3/31(화)", amount: "₩34,000", change: "+10%", active: false },
  { day: "수", value: 76, blocks: ["base","base","base","base","base"], period: "3/25(수) - 4/1(수)",  amount: "₩36,000", change: "+14%", active: false },
  { day: "목", value: 64, blocks: ["base","base","base","base"],       period: "3/26(목) - 4/2(목)",  amount: "₩31,000", change: "+6%",  active: false },
  { day: "금", value: 38, blocks: ["base","base","base"],             period: "3/27(금) - 4/3(금)",  amount: "₩18,000", change: "-3%",  active: false },
  { day: "토", value: 48, blocks: ["base","base","base"],             period: "3/28(토) - 4/4(토)",  amount: "₩24,000", change: "+2%",  active: false },
];

const DEFAULT_FIXED_ITEMS = [
  { title: "줄이기 어려운 소비", value: 256800, suffix: "원", meta: "12건" },
  { title: "조절 가능한 소비",   value: 171200, suffix: "원", meta: "6건"  },
];

const monthlyItems = [
  { title: "월세", value: 500000, count: "1건" },
  { title: "구독", value: 29000,  count: "3건" },
  { title: "식비", value: 180000, count: "4건" },
  { title: "쇼핑", value: 120000, count: "이외 4건" },
];

const SAVEABLE_AMOUNT = 72000;

/* ─────────────────────────────────────────── 카테고리 설정 */
const CATEGORY_CONFIG = {
  여행: { emoji: "✈️",  color: "#60a5fa" },
  쇼핑: { emoji: "🛍️", color: "#f472b6" },
  음식: { emoji: "🍽️", color: "#fb923c" },
  문화: { emoji: "🎭",  color: "#a78bfa" },
  운동: { emoji: "🏃",  color: "#34d399" },
  기타: { emoji: "🌟",  color: "#fbbf24" },
};
function getCat(cat) {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG["기타"];
}

/* ─────────────────────────────────────────── 달성 % 계산 */
function getProgress(bucket) {
  const target = Number(bucket.mony_ing)    || 0;
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
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
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
        <button type="button" className="ca-memoryCalendar__nav" onClick={() => moveMonth(-1)}>
          &lt;
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" className="ca-memoryCalendar__nav" onClick={() => moveMonth(1)}>
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
              ].filter(Boolean).join(" ")}
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

/* ─────────────────────────────────────────── MemoryCard 컴포넌트 */
function MemoryCard({ bucket, memoryData, onSave, onOpenModal }) {
  const cat = getCat(bucket.category);
  const pct = Math.round(getProgress(bucket) * 100);

  // 기본 사진 결정 (memoryData > 키워드 매칭 > null)
  const getDefaultPhoto = () => {
    if (memoryData?.photoUrl) return memoryData.photoUrl;
    const title = bucket.title || bucket.bucket_name || "";
    if (title.includes("제주")) return JejuImg;
    if (title.includes("부산")) return BusanImg;
    if (title.includes("일본") || title.includes("나고야")) return JapanImg;
    return null;
  };
  const [photoUrl, setPhotoUrl] = useState(getDefaultPhoto);
  const fileRef = useRef(null);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoUrl(url);
    onSave(bucket.id, { ...(memoryData || {}), photoUrl: url });
  };

  return (
    <motion.div
      className="ca-mc"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── 상단: 카테고리 소제목 + 달성 뱃지 */}
      <div className="ca-mc__badges">
        <span className="ca-mc__catLabel" style={{ color: cat.color }}>
          {cat.emoji} {bucket.category || "기타"}
        </span>
        <span className="ca-mc__done">✓ 달성</span>
      </div>

      {/* ── 사진 */}
      {photoUrl ? (
        <div className="ca-mc__photo">
          <img src={photoUrl} alt="추억" />
          <button
            className="ca-mc__photoEdit"
            type="button"
            onClick={() => fileRef.current?.click()}
          >✎</button>
        </div>
      ) : (
        <button
          className="ca-mc__photoAdd"
          type="button"
          onClick={() => fileRef.current?.click()}
        >
          <span className="ca-mc__photoIcon">📷</span>
          <span>사진 추가</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFile}
      />

      {/* ── 버킷 정보 */}
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
            {new Date(memoryData?.date || bucket.d_day).toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
        )}
      </div>

      {/* ── 추억 남기기 버튼 → 모달 오픈 */}
      <button
        type="button"
        className="ca-mc__toggle"
        onClick={() => onOpenModal(bucket.id)}
      >
        {memoryData?.memo ? "추억 보기 ›" : "추억 남기기 ›"}
      </button>

      {/* 메모 미리보기 (저장된 경우) */}
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
  const [fixedItems,    setFixedItems]    = useState(DEFAULT_FIXED_ITEMS);
  const [totalSpent,    setTotalSpent]    = useState(326000);

  /* 완료 버킷 */
  const [completedBuckets, setCompletedBuckets] = useState([]);
  const [bucketsLoading,   setBucketsLoading]   = useState(true);

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
  const [modalPhoto,    setModalPhoto]    = useState(null);
  const [modalMemo,     setModalMemo]     = useState("");
  const [modalDate,     setModalDate]     = useState("");
  const modalFileRef = useRef(null);

  const openModal = (bucketId) => {
    const existing = memories[bucketId];
    setModalBucketId(bucketId);
    setModalPhoto(existing?.photoUrl || null);
    setModalMemo(existing?.memo  || "");
    setModalDate(existing?.date  || new Date().toISOString().slice(0, 10));
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
    analysis.summary(periodDetail)
      .then((res) => {
        const d = res.data;
        if (!d) return;
        if (d.total > 0) setTotalSpent(d.total);
        if (d.fixed > 0 || d.variable > 0) {
          setFixedItems([
            { title: "줄이기 어려운 소비", value: d.fixed,    suffix: "원", meta: "고정 지출" },
            { title: "조절 가능한 소비",   value: d.variable, suffix: "원", meta: "변동 지출" },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  /* 버킷 API */
  useEffect(() => {
    setBucketsLoading(true);
    bucketsApi.getAll()
      .then((res) => {
        try {
          const all = Array.isArray(res?.data) ? res.data : [];
          const done = all.filter((b) => {
            const target = Number(b.mony_ing)    || 0;
            const finish = Number(b.mony_finish) || 0;
            const prob   = Number(b.probability) || 0;
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

  const handleCaSave = async (amount) => {
    const prev = Number(localStorage.getItem("mony_saved_amount") ?? 0);
    localStorage.setItem("mony_saved_amount", String(prev + amount));
    setCaSavedAmount(amount);
    const bucketId = localStorage.getItem("mony_primary_bucket_id");
    if (bucketId) {
      try {
        const res = await bucketsApi.getById(bucketId);
        if (res.data) {
          const newMonyFinish = Math.min(
            (res.data.mony_finish || 0) + amount,
            res.data.mony_ing || Infinity,
          );
          await bucketsApi.updateMoney(bucketId, newMonyFinish);
        }
      } catch {}
    }
  };

  /* ── JSX */
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
              <motion.article className="ca-card ca-card--weekly" variants={staggerItemVariants} {...cardMotion}>
                <div className="ca-cardHead">
                  <div><p>3월</p><strong>월 진행 대비 소비량</strong></div>
                  <span>시간 대비 소비 70%</span>
                </div>
                <div className="ca-progressPair">
                  <div className="ca-progressRow">
                    <span>시간</span>
                    <div className="ca-progressTrack">
                      <ProgressFill className="ca-progressFill is-orange" value={0.54} />
                    </div>
                    <strong>50%</strong>
                  </div>
                  <div className="ca-progressRow">
                    <span>지출</span>
                    <div className="ca-progressTrack">
                      <ProgressFill className="ca-progressFill is-lime" value={0.72} />
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
                    <span>주간 | 3/23(월) - 3/30(일)</span>
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
                    <span className="ca-miniCard__label">안정적인 적정 소비</span>
                    <div className="march-div">
                      <strong className="march">3월,</strong>
                      <br />
                      <strong className="march-description">
                        소비 패턴의 균형의 <br /> 유지가 적절해요
                      </strong>
                    </div>
                  </div>
                  <div className="ca-miniCard">
                    <span>3월의 지출</span>
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
              <motion.article className="ca-card ca-card--chart" variants={staggerItemVariants} {...cardMotion}>
                <div className="ca-cardHead">
                  <div>
                    <p>3월 사용금액</p>
                    <strong className="ca-cardHeadStrong">
                      <CountUp value={totalSpent} suffix="원" />
                    </strong>
                  </div>
                </div>
                <div className="ca-weekChart">
                  <div className="ca-weekScale" aria-hidden="true">
                    <span>31</span><span>1</span>
                  </div>
                  <div className="ca-weekGrid" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                  <div className="ca-weekBars">
                    {weekBars.map((bar, index) => (
                      <div key={bar.day} className="ca-weekBarWrap">
                        <motion.div
                          className={`ca-weekBar ${bar.active ? "is-active" : ""}`}
                          initial={{ scaleY: 0.35, opacity: 0.5 }}
                          whileInView={{ scaleY: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: `${bar.value}%` }}
                        >
                          {bar.blocks.map((block, bi) => (
                            <span key={`${bar.day}-${bi}`} className={`ca-weekBlock is-${block}`} />
                          ))}
                        </motion.div>
                        <div className="ca-weekTooltip" role="tooltip">
                          <strong>{bar.period}</strong>
                          <span><i aria-hidden="true" />총 지출<b>{bar.amount}</b></span>
                          <span><i aria-hidden="true" />주별대비<b>{bar.change}</b></span>
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
            <motion.article className="ca-card ca-card--savings" variants={staggerItemVariants} {...cardMotion}>
              <div className="ca-cardHead">
                <div>
                  <p>절약 분석</p>
                  <strong className="ca-savingsTitle">
                    이번 달 저축 가능 금액 :{" "}
                    <span><CountUp value={SAVEABLE_AMOUNT} suffix="원" /></span>
                  </strong>
                </div>
              </div>
              <div className="ca-savingsBody">
                <div className="ca-savingsAmounts">
                  <div className="ca-savingsAmountCard">
                    <i className="ca-savingsCardMark" aria-hidden="true" />
                    <span>예산 대비 절약 금액</span>
                    <strong><CountUp value={72000} suffix="원" /></strong>
                    <small>예산보다 덜 쓴 금액</small>
                  </div>
                  <div className="ca-savingsAmountCard">
                    <i className="ca-savingsCardMark" aria-hidden="true" />
                    <span>지난달 대비 감소한 지출</span>
                    <strong><CountUp value={28000} suffix="원" /></strong>
                    <small>지난달 대비 절감</small>
                  </div>
                  <div className="ca-savingsAmountCard">
                    <i className="ca-savingsCardMark" aria-hidden="true" />
                    <span>이번 달 저금통 적립 가능액</span>
                    <strong><CountUp value={100000} suffix="원" /></strong>
                    <small>저금통 반영 가능</small>
                  </div>
                </div>
                <div className="ca-savingsAction">
                  <div className="ca-savingsCoinArea" aria-hidden="true"><span>₩</span></div>
                  <button
                    type="button"
                    className="ca-savingsBtn"
                    onClick={() => handleCaSave(SAVEABLE_AMOUNT)}
                  >
                    72,000원 적립하기
                  </button>
                </div>
                <div
                  className={`ca-savingsReaction ${caSavedAmount !== null ? "is-saved" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  <span className="ca-savingsReactionBadge">
                    {caSavedAmount === null ? "대기 중" : "적립 완료"}
                  </span>
                  <span className="ca-savingsReactionIcon" aria-hidden="true">
                    {caSavedAmount === null ? "·" : "✓"}
                  </span>
                  <strong>적립 반응</strong>
                  <p>
                    {caSavedAmount === null
                      ? "아직 적립된 금액이 없어요"
                      : `${caSavedAmount.toLocaleString()}원이 저축 저금통에 반영됐어요!`}
                  </p>
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
            <motion.article className="ca-card ca-card--fixed" variants={staggerItemVariants} {...cardMotion}>
              <div className="ca-cardHead"><h3>소비 구조 분석</h3></div>
              <p className="ca-fixedConvert">
                이번 달 조절 가능한 소비 중 <strong>42,000원</strong>을 저축으로 전환할 수 있어요.
              </p>
              <div className="ca-fixedSummary">
                {fixedItems.map((item) => (
                  <div key={item.title} className="ca-fixedRow">
                    <div>
                      <strong>{item.title}</strong>
                      <span><CountUp value={item.value} suffix={item.suffix} /></span>
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
                      <span><CountUp value={item.value} suffix="원" /></span>
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
            <motion.article className="ca-card ca-card--travel" variants={staggerItemVariants} {...cardMotion}>
              <div className="ca-cardHead">
                <div className="ca-travelHead">
                  <h3>달성한 버킷리스트</h3>
                  <strong>저축 완료 · 추억 저장소</strong>
                </div>
              </div>

              {!bucketsLoading && completedBuckets.length > 0 && (
                <div className="ca-mc__summary">
                  <span>🏆 총 <b>{completedBuckets.length}개</b> 달성</span>
                  <span>
                    💰 <b>
                      {completedBuckets
                        .reduce((s, b) => s + (Number(b.mony_finish) || 0), 0)
                        .toLocaleString()}원
                    </b> 저축 완료
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

              {!bucketsLoading && completedBuckets.length > 0 && (
                <motion.div
                  className="ca-mc__grid"
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {completedBuckets.map((bucket) => (
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
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 16, scale: 0.97  }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="ca-modal__head">
                <span className="ca-modal__title">추억 남기기</span>
                <button className="ca-modal__close" onClick={closeModal}>✕</button>
              </div>

              {/* 사진 업로드 */}
              <div
                className="ca-modal__photoArea"
                onClick={() => modalFileRef.current?.click()}
              >
                {modalPhoto ? (
                  <img src={modalPhoto} alt="추억 사진" className="ca-modal__photoPreview" />
                ) : (
                  <div className="ca-modal__photoEmpty">
                    <p>사진을 추가해보세요</p>
                    <small>클릭해서 업로드</small>
                  </div>
                )}
                {modalPhoto && (
                  <div className="ca-modal__photoOverlay"><span>사진 변경</span></div>
                )}
              </div>
              <input
                ref={modalFileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onModalFile}
              />

              {/* 날짜 */}
              <div className="ca-modal__field">
                <label className="ca-modal__label">달성 날짜</label>
                <MemoryDateCalendar
                  value={modalDate}
                  onChange={setModalDate}
                />
              </div>

              {/* 메모 */}
              <div className="ca-modal__field">
                <label className="ca-modal__label">추억 메모</label>
                <textarea
                  className="ca-modal__textarea"
                  placeholder="이 목표를 달성한 순간의 기억을 남겨보세요!"
                  value={modalMemo}
                  maxLength={200}
                  onChange={(e) => setModalMemo(e.target.value)}
                />
                <span className="ca-modal__charCount">{modalMemo.length}/200</span>
              </div>

              {/* 저장 버튼 */}
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
