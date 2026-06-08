import { motion } from "framer-motion";
import { ProgressFill } from "./homeMotion.jsx";
import ChallengeBg from "../assets/home/homebucketchallenge.png";
import TripStampImage from "../assets/home/trip.png";
import HobbyStampImage from "../assets/home/hobby.png";
import ImprovementStampImage from "../assets/home/improvement.png";

const stampImagesByCategory = {
  여행: TripStampImage,
  취미: HobbyStampImage,
  자기계발: ImprovementStampImage,
};

export default function HomeBucketChallengeCard({
  bucketGoal,
  bucketProgress,
  bucketTargetAmount,
  quickSaveAmount,
  currentMonthLabel,
  note,
  variants,
  motionProps,
}) {
  const title = bucketGoal?.bucketList ?? "버킷리스트 챌린지";
  const targetText = bucketTargetAmount
    ? `${bucketTargetAmount.toLocaleString()}원`
    : "목표를 설정해요";
  const quickSaveText = Number(quickSaveAmount || 5000).toLocaleString();
  const isCompleted = bucketTargetAmount > 0 && bucketProgress >= 1;
  const category = bucketGoal?.category ?? "여행";
  const stampImage = stampImagesByCategory[category] ?? TripStampImage;

  return (
    <motion.article
      className="home-panelCard home-bucketChallengeCard"
      variants={variants}
      {...motionProps}
    >
      <div className="title">
        <p className="test10">버킷리스트 챌린지</p>
        <h3 className="test11">도전 중인 버킷리스트 챌린지</h3>
      </div>
      

      <div className="home-v2ChallengeBody">
        <div
          className="home-v2ChallengeImage"
          style={{ backgroundImage: `url(${ChallengeBg})` }}
        >
          <div className="home-v2ChallengeOverlay">
            <div className="home-v2ChallengeOverlayTop">
              <p className="home-v2ChallengePeriod">{currentMonthLabel} ~ 현재</p>
              <strong className="home-v2ChallengeImgTitle">{title}</strong>
              <p className="home-v2ChallengeImgDesc">
                {isCompleted ? (
                  <>
                    목표 금액을 모두 모았어요<br /> 버킷리스트 달성 완료!
                  </>
                ) : (
                  <>
                    매주 목요일마다 {quickSaveText}원을<br /> 모으고 있는 중이에요
                  </>
                )} </p>
            </div>
          </div>
        </div>

        <div className={`home-v2ChallengeDetail ${isCompleted ? "is-completed" : ""}`}>
          {isCompleted && (
            <motion.div
              className="home-v2ChallengeStamp"
              initial={{ scale: 1.8, rotate: -18, opacity: 0 }}
              animate={{ scale: 1, rotate: -12, opacity: 0.42 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 15,
                delay: 0.16,
              }}
            >
              <img src={stampImage} alt="" aria-hidden="true" />
            </motion.div>
          )}
          {isCompleted && (
            <motion.span
              className="home-v2ChallengeBadge"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.22, delay: 0.28 }}
            >
              칭찬도장 쾅!
            </motion.span>
          )}
          <strong className="home-v2ChallengeDetailTitle">{title}</strong>
          <p className="home-v2ChallengeDetailSpan">
            {isCompleted ? "버킷리스트 달성 완료" : "버킷리스트 진행중"}
          </p>

          <div className="home-v2ChallengeInfo">
            <span className="home-v2ChallengeInfoLabel">고정카드</span>
            <div className="home-v2ChallengeCardText">
              <strong>Visa-체크카드</strong>
              <span>하나트레블GO</span>
            </div>
          </div>

          <div className="home-v2ChallengeGoal">
            <strong>목표 {targetText}</strong>
          </div>

          <div className="home-progress home-v2ChallengeProgress">
            <ProgressFill className="home-progressBar" value={bucketProgress} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
