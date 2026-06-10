import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { goals as goalsApi, analysis } from "../../api/index.js";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import Coinimg from "../../assets/cm/coin.png";
import FoodIcon from "../../assets/cm/food.svg";
import ShoppingIcon from "../../assets/cm/shopping.svg";
import TrafficIcon from "../../assets/cm/traffic.svg";

import {
  CountUp,
  ProgressFill,
  cardMotion,
  staggerContainerVariants,
  staggerItemVariants,
} from "../../component/homeMotion.jsx";
import "./cm.css";
import {
  getKoreanDateLabel,
  getMonthLabel,
  getShortMonthLabel,
  getToday,
  getTodayLabel,
  getWeekDateNumbers,
} from "../../utils/date.js";

const today = getToday();
const currentFullMonthLabel = getMonthLabel(today);
const currentShortMonthLabel = getShortMonthLabel(today);
const todayKoreanLabel = getKoreanDateLabel(today);
const todayCompactLabel = `${today.getMonth() + 1}/${today.getDate()}`;
const todayDayNumber = today.getDate();
const currentWeekDates = getWeekDateNumbers(today);

const topMetrics = [
  {
    label: "오늘의 소비",
    value: 28000,
    sub: todayKoreanLabel,
    trend: "+12% ↑",
    suffix: "원",
  },
  {
    label: `${currentShortMonthLabel}의 소비 점수`,
    value: 78,
    sub: "평균보다 안정적",
    trend: "",
    suffix: "점",
  },
  {
    label: "이번 주의 소비 속도",
    value: null,
    sub: "슬로우 소비",
    trend: "",
    text: "매우 좋음",
  },
  {
    label: "TOP 소비",
    value: null,
    sub: `${currentShortMonthLabel} ${Math.ceil(today.getDate() / 7)}주`,
    trend: "+쇼핑/온라인 구독 ↑",
    text: "식비",
  },
];

const recentUsage = [
  {
    name: "GS25 녹번점",
    amount: "-5,600원",
    date: todayCompactLabel,
    hint: "평소보다 1,200원 적게 썼어요",
    piggyAmount: 1200,
    icon: FoodIcon,
    color: "food",
  },
  {
    name: "백소정 관악점",
    amount: "-14,600원",
    date: todayCompactLabel,
    hint: "절약 가능 3,000원",
    piggyAmount: 3000,
    icon: FoodIcon,
    color: "food",
  },
  {
    name: "교보문고 광화문점",
    amount: "-35,400원",
    date: todayCompactLabel,
    icon: ShoppingIcon,
    color: "shopping",
  },
  { name: "롯데마트(주)", amount: "-10,600원", date: todayCompactLabel },
  { name: "에이치앤엠", amount: "-34,020원", date: todayCompactLabel },
];

const detailRows = [
  {
    date: todayKoreanLabel,
    name: "백소정 관악점",
    time: "12:09/국내",
    amount: "-14,600원",
  },
  {
    date: todayKoreanLabel,
    name: "GS25 녹번점",
    time: "09:05/국내",
    amount: "-5,600원",
  },
  { date: todayKoreanLabel, name: "Apple", time: "17:50/국내", amount: "-5,400원" },
  {
    date: todayKoreanLabel,
    name: "교보문고 광화문점",
    time: "11:45/국내",
    amount: "-35,400원",
  },
  {
    date: todayKoreanLabel,
    name: "롯데쇼핑(주)",
    time: "18:13/국내",
    amount: "-10,600원",
  },
  {
    date: todayKoreanLabel,
    name: "에이치앤엠",
    time: "16:03/국내",
    amount: "-34,020원",
  },
];

const categoryDetailRows = [
  {
    date: todayKoreanLabel,
    name: "백소정 관악점",
    time: "12:09/국내",
    amount: "-14,600원",
  },
  {
    date: todayKoreanLabel,
    name: "GS25 녹번점",
    time: "09:05/국내",
    amount: "-14,600원",
  },
  {
    date: todayKoreanLabel,
    name: "투썸플레이스",
    time: "11:05/국내",
    amount: "-17,700원",
  },
  {
    date: todayKoreanLabel,
    name: "GS25 녹번점",
    time: "16:38/국내",
    amount: "-9,600원",
  },
  {
    date: todayKoreanLabel,
    name: "컴포즈커피",
    time: "12:07/국내",
    amount: "-2,300원",
  },
  {
    date: todayKoreanLabel,
    name: "팻어케이크",
    time: "17:36/국내",
    amount: "-28,500원",
  },
];

const logCategories = ["식사/외식", "쇼핑", "여행", "취미", "장소", "기타"];

const logBubbleMap = {
  "식사/외식": [
    {
      day: todayDayNumber,
      label: "백소정",
      amount: "-20,200",
      image: "/images/food-26.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "일번지...",
      amount: "-30,240",
      image: "/images/food-27.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "",
      amount: "",
      image: "/images/food-28.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "업기떡...",
      amount: "-14,300",
      image: "/images/food-29.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "분식집",
      amount: "-9,130",
      image: "/images/food-30.svg",
      tone: "normal",
    },
  ],
  쇼핑: [
    {
      day: todayDayNumber,
      label: "무신사",
      amount: "-48,900",
      image: "/images/food-27.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "올리브영",
      amount: "-18,400",
      image: "/images/food-28.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "교보문고",
      amount: "-35,400",
      image: "/images/food-29.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "",
      amount: "",
      image: "/images/food-30.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "H&M",
      amount: "-34,020",
      image: "/images/food-26.svg",
      tone: "normal",
    },
  ],
  여행: [
    {
      day: todayDayNumber,
      label: "KTX",
      amount: "-59,800",
      image: "/images/food-28.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "숙소예약",
      amount: "-82,000",
      image: "/images/food-29.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "",
      amount: "",
      image: "/images/food-30.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "공항버스",
      amount: "-17,000",
      image: "/images/food-26.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "기념품",
      amount: "-22,500",
      image: "/images/food-27.svg",
      tone: "normal",
    },
  ],
  취미: [
    {
      day: todayDayNumber,
      label: "필라테스",
      amount: "-45,000",
      image: "/images/food-29.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "",
      amount: "",
      image: "/images/food-30.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "영화관",
      amount: "-15,000",
      image: "/images/food-26.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "클래스",
      amount: "-28,000",
      image: "/images/food-27.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "문구점",
      amount: "-8,400",
      image: "/images/food-28.svg",
      tone: "normal",
    },
  ],
  장소: [
    {
      day: todayDayNumber,
      label: "GS25",
      amount: "-5,600",
      image: "/images/food-30.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "스타필드",
      amount: "-12,300",
      image: "/images/food-26.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "홍대입구",
      amount: "-9,900",
      image: "/images/food-27.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "",
      amount: "",
      image: "/images/food-28.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "성수동",
      amount: "-16,800",
      image: "/images/food-29.svg",
      tone: "normal",
    },
  ],
  기타: [
    {
      day: todayDayNumber,
      label: "구독",
      amount: "-9,900",
      image: "/images/food-26.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "통신비",
      amount: "-31,000",
      image: "/images/food-30.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "",
      amount: "",
      image: "/images/food-29.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "세탁",
      amount: "-6,500",
      image: "/images/food-28.svg",
      tone: "normal",
    },
    {
      day: todayDayNumber,
      label: "생활용품",
      amount: "-13,200",
      image: "/images/food-27.svg",
      tone: "normal",
    },
  ],
};

export default function Cm() {
  const name = localStorage.getItem("joinName")?.trim() || "사용자";
  const [historyPage, setHistoryPage] = useState(0);
  const [activeLogCategory, setActiveLogCategory] = useState("식사/외식");
  const [savedAmount] = useState(() => {
    const v = Number(localStorage.getItem("mony_saved_amount"));
    return v > 0 ? v : 0;
  });
  const [savingsGoal, setSavingsGoal] = useState(
    () => Number(localStorage.getItem("mony_savings_goal")) || 500000,
  );
  const [categoryItems, setCategoryItems] = useState([
    { name: "식사/외식", value: 60, color: "food", icon: FoodIcon },
    { name: "쇼핑", value: 30, color: "shopping", icon: ShoppingIcon },
    { name: "교통", value: 12, color: "traffic", icon: TrafficIcon },
  ]);

  const savingsPct = Math.min(
    100,
    Math.round((savedAmount / savingsGoal) * 100),
  );

  // ✅ 이번 달 텍스트 자동 계산
  const now = new Date();
  const currentMonthLabel = `${now.getMonth() + 1}월`;

  // ✅ 목표 초과시 0원으로 표시
  const remainAmount = Math.max(savingsGoal - savedAmount, 0);

  useEffect(() => {
    const periodDetail = new Date().toISOString().slice(0, 7);

    goalsApi
      .getAll()
      .then((res) => {
        const monthly =
          res.data?.find(
            (g) =>
              g.period_type === "monthly" && g.period_detail === periodDetail,
          ) ?? res.data?.[0];
        if (monthly?.target_amount) setSavingsGoal(monthly.target_amount);
      })
      .catch(() => {});

    analysis
      .category(periodDetail)
      .then((res) => {
        if (!res.data?.length) return;
        const total = res.data.reduce((s, c) => s + c.total, 0);
        if (total === 0) return;
        const iconMap = {
          식비: FoodIcon,
          쇼핑: ShoppingIcon,
          교통: TrafficIcon,
        };
        const colorMap = { 식비: "food", 쇼핑: "shopping", 교통: "traffic" };
        const items = res.data
          .sort((a, b) => b.total - a.total)
          .slice(0, 3)
          .map((c) => ({
            name: c.category,
            value: Math.round((c.total / total) * 100),
            color: colorMap[c.category] ?? "food",
            icon: iconMap[c.category] ?? FoodIcon,
          }));
        if (items.length > 0) setCategoryItems(items);
      })
      .catch(() => {});
  }, []);

  const historyTitle = historyPage === 0 ? "최근 사용 내역" : "카테고리 소비";
  const goToPrevHistory = () => setHistoryPage((page) => (page === 0 ? 1 : 0));
  const goToNextHistory = () => setHistoryPage((page) => (page === 0 ? 1 : 0));
  const activeLogBubbles =
    logBubbleMap[activeLogCategory] ?? logBubbleMap["식사/외식"];

  return (
    <main className="cm-page">
      <div className="cm-shell">
        <Menu />

        <section className="cm-main">
          <HomeHeader />
          <div className="cm-section">
            <Motion.section
              className="cm-topMetrics"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {topMetrics.map((metric) => (
                <Motion.article
                  key={metric.label}
                  className="cm-topMetricCard"
                  variants={staggerItemVariants}
                  {...cardMotion}
                >
                  <div className="cm-topMetricHead">
                    <div>
                      <p>{metric.label}</p>
                      <strong>{metric.sub}</strong>
                    </div>
                    {metric.trend ? <span>{metric.trend}</span> : null}
                  </div>
                  <div className="cm-topMetricValue">
                    <h3>
                      {typeof metric.value === "number" ? (
                        <CountUp value={metric.value} suffix={metric.suffix} />
                      ) : (
                        metric.text
                      )}
                    </h3>
                  </div>
                </Motion.article>
              ))}
            </Motion.section>

            <Motion.section
              className="cm-overview"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.18 }}
            >
              <Motion.article
                className="cm-card cm-card--challenge"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="cm-challengeHead">
                  {/* ✅ 이번 달 텍스트 자동 계산 */}
                  <p>{currentMonthLabel} 저축 챌린지</p>
                </div>
                <div className="cm-challengeAmounts">
                  <div>
                    <span>현재</span>
                    <strong className="is-lime">
                      <CountUp value={savedAmount} suffix="원" />
                    </strong>
                  </div>
                  <div>
                    <span>목표</span>
                    <strong>{savingsGoal.toLocaleString()}원</strong>
                  </div>
                </div>
                <div className="cm-challengeProgress">
                  <div className="cm-challengeBar">
                    <ProgressFill
                      value={savingsPct / 100}
                      className="cm-challengeFill"
                    />
                  </div>
                  <span className="cm-challengePct">{savingsPct}%</span>
                </div>
                {/* ✅ 목표 초과시 0원으로 표시 */}
                <p className="cm-challengeRemain">
                  목표까지 <strong>{remainAmount.toLocaleString()}원</strong>{" "}
                  남았어요
                </p>
              </Motion.article>

              <div className="cm-overviewRight">
                <Motion.article
                  className="cm-card cm-summaryStrip"
                  variants={staggerItemVariants}
                  {...cardMotion}
                >
                  <div className="cm-summaryCell">
                    <span>가장 많이 사용한 카드</span>
                    <strong>{name}의 카뱅 카드</strong>
                  </div>
                  <div className="cm-summaryCell">
                    <span>이 카드는</span>
                    <strong>식비 중심으로 사용되고 있어요</strong>
                  </div>
                  <div className="cm-summaryCell">
                    <span>이번 달 쓴 돈</span>
                    <strong>-326,000원</strong>
                  </div>
                  <div className="cm-summaryCell">
                    <span>전체 소비</span>
                    <strong>약 42%</strong>
                  </div>
                  <div className="cm-summaryCell">
                    <span>지난 달에 비해</span>
                    <strong>12% ↑</strong>
                  </div>
                </Motion.article>

                <div className="cm-grid3">
                  <Motion.article
                    className="cm-card"
                    variants={staggerItemVariants}
                    {...cardMotion}
                  >
                    <h3 className="cm-cardTitle">최근 사용 내역</h3>
                    <div className="cm-list">
                      {recentUsage.slice(0, 3).map((item) => (
                        <div key={item.name} className="cm-listRow">
                          <span className={`cm-iconBox is-${item.color}`}>
                            <img
                              className="cm-listIcon"
                              src={item.icon}
                              alt=""
                              aria-hidden="true"
                            />
                          </span>
                          <div className="cm-listText">
                            <strong>{item.name}</strong>
                            <span>{item.amount}</span>
                          </div>
                          <small>{item.date}</small>
                        </div>
                      ))}
                    </div>
                  </Motion.article>

                  <Motion.article
                    className="cm-card"
                    variants={staggerItemVariants}
                    {...cardMotion}
                  >
                    <h3 className="cm-cardTitle">카테고리 소비</h3>
                    <p className="cm-subtitle">
                      쇼핑과 식사 지출의 증가가 보여요
                    </p>
                    <div className="cm-categoryList">
                      {categoryItems.map((item) => (
                        <div key={item.name} className="cm-categoryItem">
                          <div className="cm-categoryTop">
                            <span className={`cm-iconBox is-${item.color}`}>
                              <img
                                className="cm-categoryIcon"
                                src={item.icon}
                                alt=""
                                aria-hidden="true"
                              />
                            </span>
                            <div className="cm-categoryInfo">
                              <strong>{item.name}</strong>
                              <div className="cm-categoryBar">
                                <ProgressFill
                                  value={item.value / 100}
                                  className={`cm-categoryFill is-${item.color}`}
                                />
                              </div>
                            </div>
                            <small>{item.value}%</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Motion.article>

                  <Motion.article
                    className="cm-card cm-scoreCard"
                    variants={staggerItemVariants}
                    {...cardMotion}
                  >
                    <h3 className="cm-cardTitle">소비 성격</h3>
                    <p className="cm-scoreCopy">
                      최근 {name} 님은
                      <br />
                      <strong>#소소하지만확실한행복</strong>을
                      <br />
                      소비하고 있어요
                    </p>
                    <p className="cm-scoreTags">#일상소비 #삶의질중시</p>
                    <div className="cm-scoreCharacter" aria-hidden="true">
                      <img src={Coinimg} alt="" />
                    </div>
                  </Motion.article>
                </div>
              </div>
            </Motion.section>

            <Motion.section
              className="cm-bottomGrid"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.18 }}
            >
              <Motion.article
                className="cm-card cm-historyCard"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="cm-cardHeaderLine">
                  <button
                    type="button"
                    className="cm-historyTitleBtn"
                    onClick={goToNextHistory}
                    aria-label={`${historyPage === 0 ? "카테고리 소비" : "최근 사용 내역"} 보기`}
                  >
                    <h3 className="cm-cardTitle">{historyTitle}</h3>
                    <span aria-hidden="true" className="cm-inlineChevron">
                      ›
                    </span>
                  </button>

                  <div
                    className="cm-historyPager"
                    aria-label="사용 내역 페이지"
                  >
                    <button
                      type="button"
                      onClick={goToPrevHistory}
                      aria-label="이전 페이지"
                    >
                      ‹
                    </button>
                    <span>{historyPage + 1} / 2</span>
                    <button
                      type="button"
                      onClick={goToNextHistory}
                      aria-label="다음 페이지"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="cm-historyTop">
                  <div>
                    <span>카카오뱅크</span>
                    <strong>{name}의 카뱅 카드</strong>
                  </div>
                  <div>
                    <span>{currentShortMonthLabel} 사용금액</span>
                    <strong>326,000원</strong>
                  </div>
                  <div>
                    <span>국내 정상 (27건)</span>
                    <strong>326,000원</strong>
                  </div>
                  <div>
                    <span>국내 취소 (0)</span>
                    <strong>0원</strong>
                  </div>
                </div>

                {historyPage === 0 ? (
                  <div className="cm-detailList">
                    {detailRows.map((item, index) => {
                      const showDate =
                        index === 0 || detailRows[index - 1].date !== item.date;
                      return (
                        <div
                          key={`${item.name}-${item.time}`}
                          className="cm-detailRow"
                        >
                          <span className="cm-detailDate">
                            {showDate ? item.date : ""}
                          </span>
                          <strong className="cm-detailName">{item.name}</strong>
                          <span className="cm-detailTime">{item.time}</span>
                          <strong className="cm-detailAmount">
                            {item.amount}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="cm-categoryDetail">
                    <div className="cm-categoryLegend">
                      {categoryItems.map((item) => (
                        <div key={item.name} className="cm-categoryLegendItem">
                          <span
                            className={`cm-categoryLegendIcon is-${item.color}`}
                          >
                            <img src={item.icon} alt="" aria-hidden="true" />
                          </span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="cm-detailList cm-detailList--category">
                      {categoryDetailRows.map((item, index) => {
                        const showDate =
                          index === 0 ||
                          categoryDetailRows[index - 1].date !== item.date;
                        return (
                          <div
                            key={`${item.name}-${item.time}`}
                            className="cm-detailRow"
                          >
                            <span className="cm-detailDate">
                              {showDate ? item.date : ""}
                            </span>
                            <strong className="cm-detailName">
                              {item.name}
                            </strong>
                            <span className="cm-detailTime">{item.time}</span>
                            <strong className="cm-detailAmount">
                              {item.amount}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Motion.article>

              <div className="cm-rightStack">
                <Motion.article
                  className="cm-card cm-calendarCard"
                  variants={staggerItemVariants}
                  {...cardMotion}
                >
                  <div className="cm-cardHeaderLine">
                    <div>
                      <p className="cm-cardMeta">{currentFullMonthLabel}</p>
                      <h3 className="cm-cardTitle">{getTodayLabel(today)}</h3>
                    </div>
                  </div>

                  <div className="cm-calendar">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                      <span key={day} className="cm-calendarDay">
                        {day}
                      </span>
                    ))}
                    {currentWeekDates.map(
                      (day) => (
                        <span
                          key={day}
                          className={`cm-calendarDate ${day === String(todayDayNumber) ? "is-active" : ""}`}
                        >
                          {day}
                        </span>
                      ),
                    )}
                  </div>
                </Motion.article>

                <Motion.article
                  className="cm-card cm-logCard"
                  variants={staggerItemVariants}
                  {...cardMotion}
                >
                  <div className="cm-cardHeaderLine">
                    <div>
                      <p className="cm-cardMeta1">소비로그 · {currentFullMonthLabel}</p>
                    </div>
                  </div>
                  <div className="cm-logFilters">
                    {logCategories.map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={
                          activeLogCategory === item ? "is-active" : ""
                        }
                        aria-pressed={activeLogCategory === item}
                        onClick={() => setActiveLogCategory(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="cm-logBubbles">
                    {activeLogBubbles.map((item, index) => (
                      <button
                        type="button"
                        key={`${activeLogCategory}-${item.day}-${item.label || "empty"}-${index}`}
                        className="cm-logBubble"
                        style={{ backgroundImage: `url(${item.image})` }}
                        aria-label={`${item.day}일 소비 로그`}
                      >
                        <span className="cm-logBubbleDay">{item.day}</span>
                        {(item.label || item.amount) && (
                          <span className="cm-logBubbleInfo">
                            <strong>{item.label}</strong>
                            <small>{item.amount}</small>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </Motion.article>
              </div>
            </Motion.section>
          </div>
        </section>
      </div>
    </main>
  );
}
