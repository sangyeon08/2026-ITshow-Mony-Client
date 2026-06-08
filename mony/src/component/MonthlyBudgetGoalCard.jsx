import "./MonthlyBudgetGoalCard.css";

export default function MonthlyBudgetGoalCard({
  name,
  avatarSrc,
  items = [],
}) {
  const displayName = name || "김수한무";

  return (
    <>
      <div className="title">
        <h2 className="test10">2026년 6월</h2>
        <h3 className="test11">이번달의 예산목표</h3>
      </div>

      <div className="bg-goalLayout">
        <div className="bg-goalAvatarWrap">
          <div className="goaltext">
            <h2 className="bg-goalTitle1">MONY와 함께한 지</h2>
            <h2 className="bg-goalTitle1">365일째</h2>
          </div>
          <div className="bg-goalAvatar">
            <img src={avatarSrc} alt="프로필" />
          </div>
          <span className="bg-goalName">{displayName}</span>
        </div>

        <div className="bg-goalCardList">
          {items.map((item, index) => {
            const progress =
              item.progress > 1
                ? Math.round(item.progress)
                : Math.round(item.progress * 100);

            return (
              <div key={`${item.title}-${index}`} className="bg-goalCard">
                <span className="bg-goalTag">진행중인 목표 {index + 1}</span>
                <div className="bg-goalRow">
                  <div className="bg-goalLeft">
                    <p>{item.desc}</p>
                    <strong className="bg-goalTitle">{item.title}</strong>
                  </div>
                  <div className="bg-goalRight">
                    <div className="bg-goalMeta">
                      <span>진행률</span>
                      <span>기간</span>
                    </div>
                    <div className="bg-goalMetaValues">
                      <strong>{progress}%</strong>
                      <strong>{item.period}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
