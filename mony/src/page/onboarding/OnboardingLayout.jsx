import Navigate from "../../component/navigate";
import JoinStarIcon from "../../component/JoinStarIcon";
import "./onboarding.css";

const TOTAL_STEPS = 3;

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(" ");

export default function OnboardingLayout({
  step,
  kicker,
  title,
  description,
  overlay,
  pageClassName,
  cardClassName,
  children,
  ...pageProps
}) {
  const formattedStep = String(step).padStart(2, "0");
  const formattedTotal = String(TOTAL_STEPS).padStart(2, "0");

  return (
    <main
      className={joinClassNames("join1-page", pageClassName)}
      {...pageProps}
    >
      {overlay}

      <div className="join1-iconWrap" aria-hidden="true">
        <JoinStarIcon />
      </div>

      <section
        className={joinClassNames("join1-card", cardClassName)}
        aria-label={`회원가입 ${step}단계`}
      >
        <div className="join1-progressRow" aria-label={`${step}/${TOTAL_STEPS} 단계`}>
          <span className="join1-progressNow">{formattedStep}</span>
          <span className="join1-progressSlash">/</span>
          <span className="join1-progressTotal">{formattedTotal}</span>
        </div>

        <div className="join1-titleBlock">
          <p className="join1-kicker">{kicker}</p>
          <h1 className="join1-title">{title}</h1>
          {description}
        </div>

        {children}
      </section>

      <Navigate />
    </main>
  );
}
