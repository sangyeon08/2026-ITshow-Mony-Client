import { motion } from "framer-motion";
import { cardMotion, buttonMotion, staggerContainerVariants, staggerItemVariants } from "./homeMotion.jsx";
import "./banner.css";

function StoneDecor() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="159" height="113" viewBox="0 0 159 113" fill="none" className="home-decorSvg home-decorSvg--stone">
      <path
        d="M112.595 0C174.779 0 225.19 50.4103 225.19 112.595C225.19 174.779 174.779 225.19 112.595 225.19C50.4103 225.19 0 174.779 0 112.595C0.000185548 50.4105 50.4105 0.000185596 112.595 0ZM112.227 70.8154C89.3543 70.8155 70.8126 89.3572 70.8125 112.229C70.8125 135.102 89.3542 153.643 112.227 153.644C135.099 153.644 153.641 135.102 153.641 112.229C153.641 89.3571 135.099 70.8154 112.227 70.8154Z"
        fill="#888A7F"
      />
    </svg>
  );
}

function BlueDecor() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="137" height="99" viewBox="0 0 137 99" fill="none" className="home-decorSvg home-decorSvg--blue">
      <path d="M0 0H57.3782V98.1092H0V0Z" fill="#6070A4" />
      <path d="M98.7529 0L136.958 32.2618L57.3713 98.1092L57.3782 32.3503L98.7529 0Z" fill="#6070A4" />
    </svg>
  );
}

function GreenDecor() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="187" height="111" viewBox="0 0 187 111" fill="none" className="home-decorSvg home-decorSvg--green">
      <path
        d="M167.359 111.455C167.359 96.8182 165.415 82.3251 161.637 68.8028C157.86 55.2805 152.323 42.9938 145.344 32.6443C138.364 22.2948 130.078 14.0851 120.959 8.48397C111.84 2.88286 102.066 -6.39778e-07 92.1954 0C82.3249 6.39779e-07 72.5509 2.88286 63.4317 8.48398C54.3125 14.0851 46.0266 22.2948 39.047 32.6443C32.0675 42.9938 26.531 55.2805 22.7537 68.8028C18.9764 82.3251 17.0322 96.8182 17.0322 111.455L167.359 111.455Z"
        fill="url(#paint0_linear_820_3808)"
      />
      <path
        d="M110.878 117.204C110.878 107.156 109.282 97.2066 106.181 87.9234C103.081 78.6402 98.5366 70.2054 92.8077 63.1003C87.0788 55.9953 80.2776 50.3593 72.7925 46.5141C65.3073 42.6689 57.2848 40.6898 49.183 40.6898C41.0811 40.6898 33.0586 42.6689 25.5734 46.5141C18.0883 50.3593 11.2871 55.9953 5.55823 63.1003C-0.17065 70.2054 -4.71505 78.6403 -7.81549 87.9234C-10.9159 97.2066 -12.5117 107.156 -12.5117 117.204H110.878Z"
        fill="url(#paint1_linear_820_3808)"
      />
      <path
        d="M199.509 117.204C199.509 107.156 197.914 97.2066 194.813 87.9234C191.713 78.6402 187.168 70.2054 181.439 63.1003C175.711 55.9953 168.909 50.3593 161.424 46.5141C153.939 42.6689 145.917 40.6898 137.815 40.6898C129.713 40.6898 121.69 42.6689 114.205 46.5141C106.72 50.3593 99.9189 55.9953 94.19 63.1003C88.4611 70.2054 83.9167 78.6403 80.8163 87.9234C77.7158 97.2066 76.1201 107.156 76.1201 117.204H199.509Z"
        fill="url(#paint2_linear_820_3808)"
      />
      <defs>
        <linearGradient id="paint0_linear_820_3808" x1="93.4988" y1="0" x2="93.4988" y2="117.204" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D8C6C" />
          <stop offset="1" stopColor="#3D8C5F" />
        </linearGradient>
        <linearGradient id="paint1_linear_820_3808" x1="93.4988" y1="0" x2="93.4988" y2="117.204" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D8C6C" />
          <stop offset="1" stopColor="#3D8C5F" />
        </linearGradient>
        <linearGradient id="paint2_linear_820_3808" x1="93.4988" y1="0" x2="93.4988" y2="117.204" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D8C6C" />
          <stop offset="1" stopColor="#3D8C5F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PinkDecor() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="162" height="113" viewBox="0 0 162 113" fill="none" className="home-decorSvg home-decorSvg--pink">
      <path
        d="M97.5947 0C159.779 0 210.19 50.4103 210.19 112.595C210.19 174.779 159.779 225.19 97.5947 225.19C35.4103 225.19 -15 174.779 -15 112.595C-14.9998 50.4105 35.4105 0.000185596 97.5947 0ZM97.2266 70.8154C74.3543 70.8155 55.8126 89.3572 55.8125 112.229C55.8125 135.102 74.3542 153.643 97.2266 153.644C120.099 153.644 138.641 135.102 138.641 112.229C138.641 89.3571 120.099 70.8154 97.2266 70.8154Z"
        fill="#B487BC"
      />
    </svg>
  );
}

const highlightCards = [
  {
    no: "01",
    title: "일상 속\n작은 즐거움",
    desc: "간편한 소비의 선택이 증가했어요",
    tags: "#편의점 #다이소 #정기구독",
    tone: "stone",
    decor: "arch",
  },
  {
    no: "02",
    title: "패스트\n패션과 쇼핑",
    desc: "충동 구매가 구매 가능성이 보여요",
    tags: "#유니클로 #캔메이크 #나이키",
    tone: "blue",
    decor: "arrow",
  },
  {
    no: "03",
    title: "나를\n위한 소비",
    desc: "취미 소비가 최근 활발해 졌어요",
    tags: "#수제공방 #클래스101 #독서",
    tone: "green",
    decor: "hill",
  },
  {
    no: "04",
    title: "벚꽃이 핀\n봄나들이",
    desc: "야외 활동이 소비를 선호하시는 군요",
    tags: "#따릉이 #노들섬 #한강",
    tone: "pink",
    decor: "moon",
  },
];

export default function Banner() {
  return (
    <motion.section
      className="home-hero"
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <motion.div className="home-heroIntro" variants={staggerItemVariants}>
        <div className="home-heroIndex">01</div>
        <p>활기찬 하루를 보내고 있는, 김수한무 님</p>
        <h2 className="home-heroTitle">
          이번 주의 소비를 한 번
          <br />
          살펴볼까요?
        </h2>
        <p className="home-heroDesc">
          MONY와 함께한 4월의 1주차의 소비 기록으로 인사이트를 보여드려요
        </p>
        <motion.button className="home-heroButton" type="button" {...buttonMotion}>
          소비관리 더보기
          <span aria-hidden="true">↗</span>
        </motion.button>
      </motion.div>

    <motion.div className="home-heroCards" aria-label="주간 인사이트" variants={staggerContainerVariants}>
        {highlightCards.map((card) => (
          <motion.article
            key={card.no}
            className={`home-insightCard is-${card.tone}`}
            variants={staggerItemVariants}
            {...cardMotion}
          >
            <div className="home-insightCardTop">
              <div className="home-insightNo">{card.no}</div>
              <h3 className="home-insightTitle">
                {card.title.split("\n").map((line, index, lines) => (
                  <span key={`${card.no}-${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h3>
              <p className="home-insightDesc">{card.desc}</p>
              <p className="home-insightTags">{card.tags}</p>
            </div>
            <div className="home-insightDecorWrap" aria-hidden="true">
              {card.decor === "arch" ? <StoneDecor /> : null}
              {card.decor === "arrow" ? <BlueDecor /> : null}
              {card.decor === "hill" ? <GreenDecor /> : null}
              {card.decor === "moon" ? <PinkDecor /> : null}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
