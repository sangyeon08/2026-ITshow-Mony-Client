import { AnimatePresence, motion as Motion } from "framer-motion";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { cardMotion, buttonMotion, staggerContainerVariants, staggerItemVariants } from "./homeMotion.jsx";
import bannerBg from "../assets/home/banner_bg.png";
import bannerBg2 from "../assets/home/banner_bg2.png";
import bannerCh1 from "../assets/home/banner_ch1.png";
import bannerCh2 from "../assets/home/banner_ch2.png";
import bannerCh3 from "../assets/home/banner_ch3.png";
import bannerComponent1 from "../assets/home/banner_component1.png";
import bannerComponent2 from "../assets/home/banner_component2.png";
import bannerComponent3 from "../assets/home/banner_component3.png";
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

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function PreviousArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="19" viewBox="0 0 10 19" fill="none">
      <path
        d="M1.65188 9.20571L9.46486 1.17652C9.52918 1.11181 9.58004 1.03499 9.61448 0.950503C9.64892 0.866014 9.66626 0.775534 9.6655 0.684298C9.66475 0.593062 9.6459 0.502882 9.61006 0.418977C9.57422 0.335072 9.5221 0.259108 9.45671 0.19548C9.39132 0.131853 9.31395 0.0818248 9.2291 0.0482924C9.14425 0.0147599 9.05359 -0.00161174 8.96236 0.000125035C8.87114 0.0018618 8.78117 0.0216725 8.69765 0.0584105C8.61414 0.0951486 8.53874 0.148085 8.47581 0.214155L0.195453 8.72453C0.0701234 8.85334 0 9.02598 0 9.20571C0 9.38543 0.0701234 9.55807 0.195453 9.68689L8.47581 18.1973C8.53874 18.2633 8.61414 18.3163 8.69765 18.353C8.78117 18.3897 8.87114 18.4095 8.96236 18.4113C9.05359 18.413 9.14425 18.3967 9.2291 18.3631C9.31395 18.3296 9.39132 18.2796 9.45671 18.2159C9.5221 18.1523 9.57422 18.0763 9.61006 17.9924C9.6459 17.9085 9.66475 17.8183 9.6655 17.7271C9.66626 17.6359 9.64892 17.5454 9.61448 17.4609C9.58004 17.3764 9.52918 17.2996 9.46486 17.2349L1.65188 9.20571Z"
        fill="#777777"
      />
    </svg>
  );
}

function NextArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="19" viewBox="0 0 10 19" fill="none">
      <path
        d="M8.01414 9.20567L0.20116 17.2349C0.136833 17.2996 0.0859796 17.3764 0.0515386 17.4609C0.0170975 17.5454 -0.000246934 17.6358 0.000511229 17.7271C0.00126939 17.8183 0.020114 17.9085 0.0559531 17.9924C0.0917931 18.0763 0.143917 18.1523 0.209309 18.2159C0.2747 18.2795 0.352061 18.3296 0.436914 18.3631C0.521769 18.3966 0.612431 18.413 0.703653 18.4113C0.794876 18.4095 0.884848 18.3897 0.968364 18.353C1.05188 18.3162 1.12728 18.2633 1.1902 18.1972L9.47056 9.68685C9.59589 9.55803 9.66602 9.3854 9.66602 9.20567C9.66602 9.02594 9.59589 8.85331 9.47056 8.72449L1.1902 0.214118C1.12728 0.148048 1.05188 0.095113 0.968365 0.0583736C0.884849 0.0216362 0.794878 0.00182646 0.703655 8.88619e-05C0.612432 -0.00164683 0.52177 0.0147239 0.436916 0.0482551C0.352063 0.0817882 0.274702 0.131814 0.20931 0.195443C0.143919 0.259071 0.0917946 0.335036 0.0559546 0.418941C0.0201155 0.502845 0.0012709 0.593026 0.000512719 0.68426C-0.00024546 0.775497 0.017099 0.865977 0.05154 0.950467C0.085981 1.03496 0.136835 1.11178 0.201161 1.17648L8.01414 9.20567Z"
        fill="white"
      />
    </svg>
  );
}

function FirstBanner({ direction, onGoConsumptionManagement }) {
  return (
    <Motion.div
      key="weekly-insight"
      className="home-heroSlide is-weekly"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <Motion.div className="home-heroIntro" variants={staggerItemVariants}>
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
        <Motion.button
          className="home-heroButton"
          type="button"
          onClick={onGoConsumptionManagement}
          {...buttonMotion}
        >
          소비관리 더보기
          <span aria-hidden="true">↗</span>
        </Motion.button>
      </Motion.div>

      <Motion.div className="home-heroCards" aria-label="주간 인사이트" variants={staggerContainerVariants}>
        {highlightCards.map((card) => (
          <Motion.article
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
          </Motion.article>
        ))}
      </Motion.div>
    </Motion.div>
  );
}

function BucketListBanner({ direction, onGoBudgetGoal }) {
  return (
    <Motion.div
      key="bucket-list"
      className="home-heroSlide is-bucket"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <div className="home-heroBucketBg" aria-hidden="true" style={{ backgroundImage: `url(${bannerBg})` }} />
      <div className="home-heroBucketOverlay" aria-hidden="true" />

      <div className="home-heroIntro home-heroIntro--bucket">
        <div className="home-heroIndex">02</div>
        <p>김수한무님의 버킷리스트 챌린지</p>
        <h2 className="home-heroTitle">
          작은 소비가 쌓이는
          <br />
          노력 자체는 의미가 깊어요
        </h2>
        <p className="home-heroDesc">
          지속가능성과 성장을 고려하는 절약은 의미있는 경험으로 쌓여, 노력의 양분이 될거예요.
        </p>
        <Motion.button
          className="home-heroButton"
          type="button"
          onClick={onGoBudgetGoal}
          {...buttonMotion}
        >
          예산목표 더보기
          <span aria-hidden="true">↗</span>
        </Motion.button>
      </div>

      <div className="home-bucketGallery" aria-label="지난 11월의 버킷리스트 챌린지">
        <img className="home-bucketMain" src={bannerComponent1} alt="지난 11월의 버킷리스트 챌린지 나고야 여행가기" />
        <img className="home-bucketSide" src={bannerComponent2} alt="01 챌린지 기록" />
        <img className="home-bucketSide" src={bannerComponent3} alt="02 챌린지 기록" />
      </div>
    </Motion.div>
  );
}

function FriendsBanner({ direction }) {
  return (
    <Motion.div
      key="friends"
      className="home-heroSlide is-friends"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <div className="home-heroFriendsBg" aria-hidden="true" style={{ backgroundImage: `url(${bannerBg2})` }} />
      <div className="home-heroFriendsOverlay" aria-hidden="true" />

      <div className="home-heroIntro home-heroIntro--friends">
        <div className="home-heroIndex">03</div>
        <p>MONY와 친구들</p>
        <h2 className="home-heroTitle">
          소비와 지출 관리를
          <br />
          더욱 즐겁게 다가가요
        </h2>
        <p className="home-heroDesc">
          김수한무 님의 옆에서 MONY 친구들이 용기와 동기를 부여해요.
        </p>
      </div>

      <div className="home-friendsCharacters" aria-label="MONY 친구 캐릭터">
        <img src={bannerCh1} alt="별 캐릭터" />
        <img src={bannerCh2} alt="MONY 친구 캐릭터" />
        <img src={bannerCh3} alt="코인 캐릭터" />
      </div>
    </Motion.div>
  );
}

export default function Banner() {
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const bannerCount = 3;
  const showPrevious = () => {
    setSlideDirection(1);
    setActiveBanner((current) => (current - 1 + bannerCount) % bannerCount);
  };
  const showNext = () => {
    setSlideDirection(-1);
    setActiveBanner((current) => (current + 1) % bannerCount);
  };

  return (
    <Motion.section
      className="home-hero"
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <button type="button" className="home-heroArrow is-left" aria-label="이전 배너" onClick={showPrevious}>
        <PreviousArrowIcon />
      </button>
      <button type="button" className="home-heroArrow is-right" aria-label="다음 배너" onClick={showNext}>
        <NextArrowIcon />
      </button>

      <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
        {activeBanner === 0 ? (
          <FirstBanner
            direction={slideDirection}
            onGoConsumptionManagement={() => navigate("/consumption-management")}
          />
        ) : null}
        {activeBanner === 1 ? (
          <BucketListBanner
            direction={slideDirection}
            onGoBudgetGoal={() => navigate("/budget-goal")}
          />
        ) : null}
        {activeBanner === 2 ? <FriendsBanner direction={slideDirection} /> : null}
      </AnimatePresence>
    </Motion.section>
  );
}
