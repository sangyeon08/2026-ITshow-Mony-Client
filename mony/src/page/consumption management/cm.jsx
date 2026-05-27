import { useState } from "react";
import { motion as Motion } from "framer-motion";
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

const topMetrics = [
  {
    label: "오늘의 소비",
    value: 28000,
    sub: "3월 30일",
    trend: "+12% ↑",
    suffix: "원",
  },
  {
    label: "4월의 소비 점수",
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
    sub: "3월 5주",
    trend: "+쇼핑/온라인 구독 ↑",
    text: "식비",
  },
];

const recentUsage = [
  {
    name: "GS25 녹번점",
    amount: "-5,600원",
    date: "3/26",
    hint: "평소보다 1,200원 적게 썼어요",
    piggyAmount: 1200,
    icon: FoodIcon,
    color: "food",
  },
  {
    name: "백소정 관악점",
    amount: "-14,600원",
    date: "3/26",
    hint: "절약 가능 3,000원",
    piggyAmount: 3000,
    icon: FoodIcon,
    color: "food",
  },
  { name: "교보문고 광화문점", amount: "-35,400원", date: "3/24", icon: ShoppingIcon, color: "shopping" },
  { name: "롯데마트(주)", amount: "-10,600원", date: "3/22" },
  { name: "에이치앤엠", amount: "-34,020원", date: "3/20" },
];

const detailRows = [
  { date: "3월 26일", name: "백소정 관악점", time: "12:09/국내", amount: "-14,600원" },
  { date: "3월 26일", name: "GS25 녹번점", time: "09:05/국내", amount: "-5,600원" },
  { date: "3월 24일", name: "Apple", time: "17:50/국내", amount: "-5,400원" },
  { date: "3월 24일", name: "교보문고 광화문점", time: "11:45/국내", amount: "-35,400원" },
  { date: "3월 22일", name: "롯데쇼핑(주)", time: "18:13/국내", amount: "-10,600원" },
  { date: "3월 20일", name: "에이치앤엠", time: "16:03/국내", amount: "-34,020원" },
];

const categoryDetailRows = [
  { date: "3월 26일", name: "백소정 관악점", time: "12:09/국내", amount: "-14,600원" },
  { date: "3월 26일", name: "GS25 녹번점", time: "09:05/국내", amount: "-14,600원" },
  { date: "3월 26일", name: "투썸플레이스", time: "11:05/국내", amount: "-17,700원" },
  { date: "3월 26일", name: "GS25 녹번점", time: "16:38/국내", amount: "-9,600원" },
  { date: "3월 19일", name: "컴포즈커피", time: "12:07/국내", amount: "-2,300원" },
  { date: "3월 19일", name: "팻어케이크", time: "17:36/국내", amount: "-28,500원" },
];

const categoryItems = [
  { name: "식사/외식", value: 60, color: "food", icon: FoodIcon },
  { name: "쇼핑", value: 30, color: "shopping", icon: ShoppingIcon },
  { name: "교통", value: 12, color: "traffic", icon: TrafficIcon },
];

const logBubbles = [
  { day: "26", label: "식사/외식", tone: "one" },
  { day: "27", label: "쇼핑", tone: "two" },
  { day: "28", label: "여행", tone: "three" },
  { day: "29", label: "취미", tone: "four" },
  { day: "30", label: "기타", tone: "five" },
];

export default function Cm() {
  const [historyPage, setHistoryPage] = useState(0);
  const [savedAmount] = useState(() => {
    const v = Number(localStorage.getItem("mony_saved_amount"));
    return v > 0 ? v : 326000;
  });
  const savingsGoal =
    Number(localStorage.getItem("mony_savings_goal")) || 500000;
  const savingsPct = Math.min(
    100,
    Math.round((savedAmount / savingsGoal) * 100),
  );

  const historyTitle = historyPage === 0 ? "최근 사용 내역" : "카테고리 소비";
  const goToPrevHistory = () => setHistoryPage((page) => (page === 0 ? 1 : 0));
  const goToNextHistory = () => setHistoryPage((page) => (page === 0 ? 1 : 0));

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
                  <p>4월 저축 챌린지</p>
                  <span aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M6.44669 16.3363L12.2104 10.48C12.3369 10.3523 12.4078 10.1798 12.4078 10C12.4078 9.82029 12.3369 9.64781 12.2104 9.52003L6.44794 3.66378C6.3216 3.53522 6.2508 3.36217 6.2508 3.18191C6.2508 3.00165 6.3216 2.8286 6.44794 2.70003C6.50966 2.63672 6.58343 2.58641 6.66491 2.55205C6.74638 2.5177 6.8339 2.5 6.92232 2.5C7.01074 2.5 7.09826 2.5177 7.17973 2.55205C7.2612 2.58641 7.33497 2.63672 7.39669 2.70003L13.1592 8.55503C13.5379 8.94069 13.75 9.45956 13.75 10C13.75 10.5405 13.5379 11.0594 13.1592 11.445L7.39669 17.3C7.33495 17.3635 7.26111 17.414 7.17952 17.4485C7.09793 17.483 7.01026 17.5007 6.92169 17.5007C6.83312 17.5007 6.74546 17.483 6.66387 17.4485C6.58228 17.414 6.50843 17.3635 6.44669 17.3C6.32035 17.1715 6.24955 16.9984 6.24955 16.8182C6.24955 16.6379 6.32035 16.4649 6.44669 16.3363Z"
                        fill="white"
                      />
                    </svg>
                  </span>
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
                <p className="cm-challengeRemain">
                  목표까지{" "}
                  <strong>
                    {(savingsGoal - savedAmount).toLocaleString()}원
                  </strong>{" "}
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
                    <strong>김수한무의 카방카드</strong>
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
                            <img className="cm-listIcon" src={item.icon} alt="" aria-hidden="true" />
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
                    <p className="cm-subtitle">쇼핑과 식사 지출의 증가가 보여요</p>
                    <div className="cm-categoryList">
                      {categoryItems.map((item) => (
                        <div key={item.name} className="cm-categoryItem">
                          <div className="cm-categoryTop">
                            <span className={`cm-iconBox is-${item.color}`}>
                              <img className="cm-categoryIcon" src={item.icon} alt="" aria-hidden="true" />
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
                      최근 김수한무 님은
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
                    <span aria-hidden="true" className="cm-inlineChevron">›</span>
                  </button>

                  <div className="cm-historyPager" aria-label="사용 내역 페이지">
                    <button type="button" onClick={goToPrevHistory} aria-label="이전 페이지">
                      ‹
                    </button>
                    <span>{historyPage + 1} / 2</span>
                    <button type="button" onClick={goToNextHistory} aria-label="다음 페이지">
                      ›
                    </button>
                  </div>
                </div>

                <div className="cm-historyTop">
                  <div>
                    <span>카카오뱅크</span>
                    <strong>김수한무의 카방카드</strong>
                  </div>
                  <div>
                    <span>3월 사용금액</span>
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
                      const showDate = index === 0 || detailRows[index - 1].date !== item.date;

                      return (
                        <div key={`${item.name}-${item.time}`} className="cm-detailRow">
                          <span className="cm-detailDate">{showDate ? item.date : ""}</span>
                          <strong className="cm-detailName">{item.name}</strong>
                          <span className="cm-detailTime">{item.time}</span>
                          <strong className="cm-detailAmount">{item.amount}</strong>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="cm-categoryDetail">
                    <div className="cm-categoryLegend">
                      {categoryItems.map((item) => (
                        <div key={item.name} className="cm-categoryLegendItem">
                          <span className={`cm-categoryLegendIcon is-${item.color}`}>
                            <img src={item.icon} alt="" aria-hidden="true" />
                          </span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="cm-detailList cm-detailList--category">
                      {categoryDetailRows.map((item, index) => {
                        const showDate = index === 0 || categoryDetailRows[index - 1].date !== item.date;

                        return (
                          <div key={`${item.name}-${item.time}`} className="cm-detailRow">
                            <span className="cm-detailDate">{showDate ? item.date : ""}</span>
                            <strong className="cm-detailName">{item.name}</strong>
                            <span className="cm-detailTime">{item.time}</span>
                            <strong className="cm-detailAmount">{item.amount}</strong>
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
                      <p className="cm-cardMeta">2026년 3월</p>
                      <h3 className="cm-cardTitle">오늘 · 3월 30일 (월)</h3>
                    </div>
                    <span aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M6.44669 16.3363L12.2104 10.48C12.3369 10.3523 12.4078 10.1798 12.4078 10C12.4078 9.82029 12.3369 9.64781 12.2104 9.52003L6.44794 3.66378C6.3216 3.53522 6.2508 3.36217 6.2508 3.18191C6.2508 3.00165 6.3216 2.8286 6.44794 2.70003C6.50966 2.63672 6.58343 2.58641 6.66491 2.55205C6.74638 2.5177 6.8339 2.5 6.92232 2.5C7.01074 2.5 7.09826 2.5177 7.17973 2.55205C7.2612 2.58641 7.33497 2.63672 7.39669 2.70003L13.1592 8.55503C13.5379 8.94069 13.75 9.45956 13.75 10C13.75 10.5405 13.5379 11.0594 13.1592 11.445L7.39669 17.3C7.33495 17.3635 7.26111 17.414 7.17952 17.4485C7.09793 17.483 7.01026 17.5007 6.92169 17.5007C6.83312 17.5007 6.74546 17.483 6.66387 17.4485C6.58228 17.414 6.50843 17.3635 6.44669 17.3C6.32035 17.1715 6.24955 16.9984 6.24955 16.8182C6.24955 16.6379 6.32035 16.4649 6.44669 16.3363Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="cm-calendar">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                      <span key={day} className="cm-calendarDay">
                        {day}
                      </span>
                    ))}
                    {["29", "30", "31", "1", "2", "3", "4"].map(
                      (day, index) => (
                        <span
                          key={day}
                          className={`cm-calendarDate ${index === 1 ? "is-active" : ""}`}
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
                      <p className="cm-cardMeta">소비로그 · 2026년 3월</p>
                      <h3 className="cm-cardTitle">식사/외식 중심 로그</h3>
                    </div>
                    <span aria-hidden="true" className="next">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M6.44669 16.3363L12.2104 10.48C12.3369 10.3523 12.4078 10.1798 12.4078 10C12.4078 9.82029 12.3369 9.64781 12.2104 9.52003L6.44794 3.66378C6.3216 3.53522 6.2508 3.36217 6.2508 3.18191C6.2508 3.00165 6.3216 2.8286 6.44794 2.70003C6.50966 2.63672 6.58343 2.58641 6.66491 2.55205C6.74638 2.5177 6.8339 2.5 6.92232 2.5C7.01074 2.5 7.09826 2.5177 7.17973 2.55205C7.2612 2.58641 7.33497 2.63672 7.39669 2.70003L13.1592 8.55503C13.5379 8.94069 13.75 9.45956 13.75 10C13.75 10.5405 13.5379 11.0594 13.1592 11.445L7.39669 17.3C7.33495 17.3635 7.26111 17.414 7.17952 17.4485C7.09793 17.483 7.01026 17.5007 6.92169 17.5007C6.83312 17.5007 6.74546 17.483 6.66387 17.4485C6.58228 17.414 6.50843 17.3635 6.44669 17.3C6.32035 17.1715 6.24955 16.9984 6.24955 16.8182C6.24955 16.6379 6.32035 16.4649 6.44669 16.3363Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="cm-logFilters">
                    {["식사/외식", "쇼핑", "여행", "취미", "장소", "기타"].map(
                      (item, index) => (
                        <span
                          key={item}
                          className={index === 0 ? "is-active" : ""}
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>

                  <div className="cm-logBubbles">
                    {logBubbles.map((item) => (
                      <div
                        key={item.day}
                        className={`cm-logBubble is-${item.tone}`}
                      >
                        <span>{item.day}</span>
                        <small>{item.label}</small>
                      </div>
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
