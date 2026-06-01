import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { analysis, buckets as bucketsApi } from "../../api/index.js";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import BusanImg from "../../assets/ca/busan.png";
import JapanImg from "../../assets/ca/japan.png";
import JejuImg from "../../assets/ca/jeju.png";
import {
  CountUp,
  ProgressFill,
  cardMotion,
  revealVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../../component/homeMotion.jsx";
import "./ca.css";

const weekBars = [
  {
    day: "일",
    value: 42,
    blocks: ["base", "base", "base"],
    period: "3/16(일) - 3/22(토)",
    amount: "₩22,000",
    change: "-8%",
    active: false,
  },
  {
    day: "월",
    value: 72,
    blocks: ["light", "accent", "accent", "light"],
    period: "3/23(월) - 3/30(일)",
    amount: "₩28,000",
    change: "+12%",
    active: true,
  },
  {
    day: "화",
    value: 64,
    blocks: ["base", "base", "base", "base"],
    period: "3/24(화) - 3/31(화)",
    amount: "₩34,000",
    change: "+10%",
    active: false,
  },
  {
    day: "수",
    value: 76,
    blocks: ["base", "base", "base", "base", "base"],
    period: "3/25(수) - 4/1(수)",
    amount: "₩36,000",
    change: "+14%",
    active: false,
  },
  {
    day: "목",
    value: 64,
    blocks: ["base", "base", "base", "base"],
    period: "3/26(목) - 4/2(목)",
    amount: "₩31,000",
    change: "+6%",
    active: false,
  },
  {
    day: "금",
    value: 38,
    blocks: ["base", "base", "base"],
    period: "3/27(금) - 4/3(금)",
    amount: "₩18,000",
    change: "-3%",
    active: false,
  },
  {
    day: "토",
    value: 48,
    blocks: ["base", "base", "base"],
    period: "3/28(토) - 4/4(토)",
    amount: "₩24,000",
    change: "+2%",
    active: false,
  },
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

const savingsOpportunities = [
  { place: "부산 여행",   date: "2025. 8. 4 - 8. 6.",    hint: "예산보다 28,000원 적게 썼어요.", piggyAmount: 28000 },
  { place: "일본 나고야", date: "2026. 2. 2 - 2. 28.",   hint: "여행 예산 내 소비 달성 · 15,000원 절약", piggyAmount: 15000 },
  { place: "제주도 여행", date: "2023. 4. 7 - 4. 13.",   hint: "숙박비 절약으로 9,000원 남았어요.", piggyAmount: 9000 },
];

const tripThumbs = [
  { name: "부산 여행", image: BusanImg },
  { name: "일본 나고야", image: JapanImg },
  { name: "제주도 여행", image: JejuImg },
];

const SAVEABLE_AMOUNT = 72000;

export default function Ca() {
  const [caSavedAmount, setCaSavedAmount] = useState(null);
  const [fixedItems, setFixedItems] = useState(DEFAULT_FIXED_ITEMS);
  const [totalSpent, setTotalSpent] = useState(326000);

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

  return (
    <main className="ca-page">
      <div className="ca-shell">
        <Menu />

        <section className="ca-main">
          <HomeHeader />

          <motion.section
            className="ca-analysisFrame"
            variants={revealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="ca-toolbar">
              <span>카카오뱅크, 김수한무의 카방카드</span>
              <span aria-hidden="true">⌄</span>
            </div>

            <motion.div
              className="ca-gridTop"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.article className="ca-card ca-card--weekly" variants={staggerItemVariants} {...cardMotion}>
                <div className="ca-cardHead">
                  <div>
                    <p>3월</p>
                    <strong>월 진행 대비 소비량</strong>
                  </div>
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
                    저금통에 넣으면 목표 달성률이 <strong className="is-lime">5% 올라가요.</strong>
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
                      <strong className="march-description">소비 패턴의 균형의 <br /> 유지가 적절해요</strong>
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
                          transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: `${bar.value}%` }}
                        >
                          {bar.blocks.map((block, blockIndex) => (
                            <span
                              key={`${bar.day}-${blockIndex}`}
                              className={`ca-weekBlock is-${block}`}
                            />
                          ))}
                        </motion.div>
                        <div className="ca-weekTooltip" role="tooltip">
                          <strong>{bar.period}</strong>
                          <span>
                            <i aria-hidden="true" />
                            총 지출
                            <b>{bar.amount}</b>
                          </span>
                          <span>
                            <i aria-hidden="true" />
                            주별대비
                            <b>{bar.change}</b>
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
              <div className="ca-cardHead">
                <div>
                  <p>절약 분석</p>
                  <strong className="ca-savingsTitle">
                    이번 달 저축 가능 금액 :{" "}
                    <span>
                      <CountUp value={SAVEABLE_AMOUNT} suffix="원" />
                    </span>
                  </strong>
                </div>
              </div>

              <div className="ca-savingsBody">
                <div className="ca-savingsAmounts">
                  <div className="ca-savingsAmountCard">
                    <i className="ca-savingsCardMark" aria-hidden="true" />
                    <span>예산 대비 절약 금액</span>
                    <strong>
                      <CountUp value={72000} suffix="원" />
                    </strong>
                    <small>예산보다 덜 쓴 금액</small>
                  </div>
                  <div className="ca-savingsAmountCard">
                    <i className="ca-savingsCardMark" aria-hidden="true" />
                    <span>지난달 대비 감소한 지출</span>
                    <strong>
                      <CountUp value={28000} suffix="원" />
                    </strong>
                    <small>지난달 대비 절감</small>
                  </div>
                  <div className="ca-savingsAmountCard">
                    <i className="ca-savingsCardMark" aria-hidden="true" />
                    <span>이번 달 저금통 적립 가능액</span>
                    <strong>
                      <CountUp value={100000} suffix="원" />
                    </strong>
                    <small>저금통 반영 가능</small>
                  </div>
                </div>

                <div className="ca-savingsAction">
                  <div className="ca-savingsCoinArea" aria-hidden="true">
                    <span>₩</span>
                  </div>
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

          <motion.section
            className="ca-middleGrid"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            <motion.article className="ca-card ca-card--fixed" variants={staggerItemVariants} {...cardMotion}>
              <div className="ca-cardHead">
                <h3>소비 구조 분석</h3>
              </div>
              <p className="ca-fixedConvert">
                이번 달 조절 가능한 소비 중 <strong>42,000원</strong>을 저축으로 전환할 수 있어요.
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

            <motion.article className="ca-card ca-card--travel" variants={staggerItemVariants} {...cardMotion}>
              <div className="ca-cardHead">
                <div className="ca-travelHead">
                  <h3>소비 기록에서 찾은 저축 기회</h3>
                  <strong>지출 기록 · 여행 / 기타</strong>
                </div>
                {/* <span aria-hidden="true">›</span> */}
              </div>

              <div className="ca-tripCards">
                {savingsOpportunities.map((trip) => (
                  <div key={trip.place} className="ca-tripCard ca-tripCard--savings">
                    <span className="ca-tripMeta">{trip.date}</span>
                    <h4>{trip.place}</h4>
                    <p className="ca-tripSavingsHint">{trip.hint}</p>
                    <button
                      type="button"
                      className="ca-tripPiggyBtn"
                      onClick={() => handleCaSave(trip.piggyAmount)}
                    >
                      저금통에 넣기
                    </button>
                  </div>
                ))}
              </div>

              <div className="ca-tripThumbs">
                {tripThumbs.map((thumb) => (
                  <img
                    key={thumb.name}
                    className="ca-tripThumb"
                    src={thumb.image}
                    alt={thumb.name}
                  />
                ))}
              </div>
            </motion.article>
          </motion.section>

        </section>
      </div>
    </main>
  );
}
