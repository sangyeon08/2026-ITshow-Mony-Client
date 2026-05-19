import { motion } from "framer-motion";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import {
  CountUp,
  ProgressFill,
  cardMotion,
  staggerContainerVariants,
  staggerItemVariants,
  revealVariants,
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
  { name: "GS25 녹번점", amount: "-5,600원", date: "3/26" },
  { name: "백소정 관악점", amount: "-14,600원", date: "3/26" },
  { name: "교보문고 광화문점", amount: "-35,400원", date: "3/24" },
  { name: "롯데마트(주)", amount: "-10,600원", date: "3/22" },
  { name: "에이치앤엠", amount: "-34,020원", date: "3/20" },
];

const categoryItems = [
  { name: "식/외식", value: 60, color: "lime" },
  { name: "쇼핑", value: 30, color: "mint" },
  { name: "교통", value: 12, color: "lavender" },
];

const logBubbles = [
  { day: "26", label: "식사/외식", tone: "one" },
  { day: "27", label: "쇼핑", tone: "two" },
  { day: "28", label: "여행", tone: "three" },
  { day: "29", label: "취미", tone: "four" },
  { day: "30", label: "기타", tone: "five" },
];

export default function Cm() {
  return (
    <main className="cm-page">
      <div className="cm-shell">
        <Menu />

        <section className="cm-main">
          <HomeHeader />

          <motion.section
            className="cm-topMetrics"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {topMetrics.map((metric) => (
              <motion.article
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
                  <h3>{typeof metric.value === "number" ? <CountUp value={metric.value} suffix={metric.suffix} /> : metric.text}</h3>
                </div>
              </motion.article>
            ))}
          </motion.section>

          <motion.section
            className="cm-overview"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            <motion.article className="cm-card cm-card--featured" variants={staggerItemVariants} {...cardMotion}>
              <div className="cm-featuredHead">
                <div>
                  <p>3월 5주, 김수한무 님이</p>
                  <h2>가장 많이 사용한 카드</h2>
                </div>
                <span aria-hidden="true">›</span>
              </div>

              <div className="cm-cardMock">
                <div className="cm-cardMockChip" />
                <div className="cm-cardMockBadge">KM BANKING</div>
                <div className="cm-cardMockBrand">
                  <span />
                  <span />
                </div>
              </div>

              <div className="cm-cardInfo">
                <strong>김수한무의 카방카드</strong>
                <p>카키 1234 | 7777-1234-4321</p>
                <p>카카오뱅크</p>
              </div>
            </motion.article>

            <div className="cm-overviewRight">
              <motion.article className="cm-card cm-summaryStrip" variants={staggerItemVariants} {...cardMotion}>
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
              </motion.article>

              <div className="cm-grid3">
                <motion.article className="cm-card" variants={staggerItemVariants} {...cardMotion}>
                  <h3 className="cm-cardTitle">최근 사용 내역</h3>
                  <div className="cm-list">
                    {recentUsage.map((item) => (
                      <div key={item.name} className="cm-listRow">
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.amount}</span>
                        </div>
                        <small>{item.date}</small>
                      </div>
                    ))}
                  </div>
                </motion.article>

                <motion.article className="cm-card" variants={staggerItemVariants} {...cardMotion}>
                  <h3 className="cm-cardTitle">카테고리 소비</h3>
                  <p className="cm-subtitle">소비 지출의 증감이 보이네요</p>
                  <div className="cm-categoryList">
                    {categoryItems.map((item) => (
                      <div key={item.name} className="cm-categoryItem">
                        <div className="cm-categoryTop">
                          <span className={`cm-categoryIcon is-${item.color}`} />
                          <strong>{item.name}</strong>
                          <small>{item.value}%</small>
                        </div>
                        <div className="cm-categoryBar">
                          <ProgressFill value={item.value / 100} className={`cm-categoryFill is-${item.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.article>

                <motion.article className="cm-card cm-scoreCard" variants={staggerItemVariants} {...cardMotion}>
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
                    ◎
                  </div>
                </motion.article>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="cm-bottomGrid"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            <motion.article className="cm-card cm-historyCard" variants={staggerItemVariants} {...cardMotion}>
              <div className="cm-cardHeaderLine">
                <h3 className="cm-cardTitle">최근 사용 내역</h3>
                <span>1 / 2</span>
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
              </div>

              <div className="cm-historyList">
                {recentUsage.map((item) => (
                  <div key={`${item.name}-history`} className="cm-historyRow">
                    <span>{item.name}</span>
                    <strong>{item.amount}</strong>
                  </div>
                ))}
              </div>
            </motion.article>

            <div className="cm-rightStack">
              <motion.article className="cm-card cm-calendarCard" variants={staggerItemVariants} {...cardMotion}>
                <div className="cm-cardHeaderLine">
                  <div>
                    <p className="cm-cardMeta">2026년 3월</p>
                    <h3 className="cm-cardTitle">오늘 · 3월 30일 (월)</h3>
                  </div>
                  <span aria-hidden="true">›</span>
                </div>

                <div className="cm-calendar">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <span key={day} className="cm-calendarDay">
                      {day}
                    </span>
                  ))}
                  {["29", "30", "31", "1", "2", "3", "4"].map((day, index) => (
                    <span key={day} className={`cm-calendarDate ${index === 1 ? "is-active" : ""}`}>
                      {day}
                    </span>
                  ))}
                </div>
              </motion.article>

              <motion.article className="cm-card cm-logCard" variants={staggerItemVariants} {...cardMotion}>
                <div className="cm-cardHeaderLine">
                  <div>
                    <p className="cm-cardMeta">소비로그 · 2026년 3월</p>
                    <h3 className="cm-cardTitle">식사/외식 중심 로그</h3>
                  </div>
                  <span aria-hidden="true">›</span>
                </div>

                <div className="cm-logFilters">
                  {["식사/외식", "쇼핑", "여행", "취미", "장소", "기타"].map((item, index) => (
                    <span key={item} className={index === 0 ? "is-active" : ""}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="cm-logBubbles">
                  {logBubbles.map((item) => (
                    <div key={item.day} className={`cm-logBubble is-${item.tone}`}>
                      <span>{item.day}</span>
                      <small>{item.label}</small>
                    </div>
                  ))}
                </div>
              </motion.article>
            </div>
          </motion.section>
        </section>
      </div>
    </main>
  );
}
