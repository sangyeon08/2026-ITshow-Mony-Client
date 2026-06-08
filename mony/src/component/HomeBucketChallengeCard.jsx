import { motion } from "framer-motion";
import { ProgressFill } from "./homeMotion.jsx";
import ChallengeBg from "../assets/home/homebucketchallenge.png";

export default function HomeBucketChallengeCard({
  bucketGoal,
  bucketProgress,
  bucketTargetAmount,
  currentMonthLabel,
  note,
  variants,
  motionProps,
}) {
  const title = bucketGoal?.bucketList ?? "버킷리스트 챌린지";
  const targetText = bucketTargetAmount
    ? `${bucketTargetAmount.toLocaleString()}원`
    : "목표를 설정해요";

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
                매주 목요일마다 5000원을<br /> 모으고 있는 중이에요 </p>
            </div>
          </div>
        </div>

        <div className="home-v2ChallengeDetail">
          <strong className="home-v2ChallengeDetailTitle">{title}</strong>
          <p className="home-v2ChallengeDetailSpan">버킷리스트 진행중 </p>

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
