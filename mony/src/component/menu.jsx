import React, { useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import Logo from "../assets/menu/Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import "./menu.css";

function HomeIcon({ className }) {
  return (
    <svg className={className} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8.70833 0.441279C8.37019 0.156298 7.94221 0 7.5 0C7.05779 0 6.62981 0.156298 6.29167 0.441279L0.666667 5.18711C0.457883 5.36307 0.290049 5.58251 0.174898 5.83009C0.0597466 6.07766 5.64406e-05 6.3474 0 6.62045V14.3746C0 15.1796 0.653333 15.8329 1.45833 15.8329H3.95833C4.34511 15.8329 4.71604 15.6793 4.98953 15.4058C5.26302 15.1323 5.41667 14.7614 5.41667 14.3746V11.0388C5.41667 10.4721 5.86833 10.0121 6.43083 9.99711H8.56917C8.84064 10.0043 9.09858 10.1172 9.28802 10.3118C9.47746 10.5063 9.58343 10.7672 9.58333 11.0388V14.3746C9.58333 15.1796 10.2367 15.8329 11.0417 15.8329H13.5417C13.9284 15.8329 14.2994 15.6793 14.5729 15.4058C14.8464 15.1323 15 14.7614 15 14.3746V6.61961C14.9999 6.34657 14.9403 6.07683 14.8251 5.82926C14.71 5.58168 14.5421 5.36224 14.3333 5.18628L8.70833 0.441279Z" fill="currentColor"/>
    </svg>
  );
}

function ConsumptionManagementIcon({ className }) {
  return (
    <svg className={className} width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14.6621 4.15797C14.9482 4.32118 15.1858 4.55752 15.3505 4.84276C15.5153 5.128 15.6012 5.45191 15.5996 5.7813V11.8513C15.5996 12.5255 15.2304 13.1471 14.6346 13.4746L9.00961 17.033C8.73071 17.186 8.41773 17.2662 8.09961 17.2662C7.78149 17.2662 7.4685 17.186 7.18961 17.033L1.56461 13.4746C1.27337 13.315 1.03025 13.0802 0.860531 12.7947C0.690817 12.5092 0.600717 12.1834 0.599609 11.8513V5.78047C0.599609 5.1063 0.968776 4.48547 1.56461 4.15797L7.18961 0.8413C7.47672 0.682997 7.79925 0.599976 8.12711 0.599976C8.45497 0.599976 8.7775 0.682997 9.06461 0.8413L14.6896 4.15797H14.6621Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.59961 8.93298C5.59961 9.59602 5.863 10.2319 6.33184 10.7008C6.80068 11.1696 7.43657 11.433 8.09961 11.433C8.76265 11.433 9.39854 11.1696 9.86738 10.7008C10.3362 10.2319 10.5996 9.59602 10.5996 8.93298C10.5996 8.26994 10.3362 7.63406 9.86738 7.16522C9.39854 6.69638 8.76265 6.43298 8.09961 6.43298C7.43657 6.43298 6.80068 6.69638 6.33184 7.16522C5.863 7.63406 5.59961 8.26994 5.59961 8.93298Z" fill="rgba(0,0,0,0.45)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ConsumptionAnalysisIcon({ className }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6.60303 4.69586V33.397H18.7456V35.3043H6.75342C6.20768 35.3043 5.68425 35.0876 5.29834 34.7017C4.91243 34.3158 4.6958 33.7924 4.6958 33.2466V4.69586H6.60303ZM32.1431 22.358H35.3042V26.6236C35.3041 29.5841 32.8956 31.9927 29.9351 31.9927H28.6812V35.3043H26.7729V31.9927H25.519C23.1669 31.9925 21.2534 30.0793 21.2534 27.7271V24.566H24.4155C25.3756 24.5647 26.3081 24.8889 27.0601 25.4859L27.2075 25.6031L27.2886 25.4322C27.7244 24.5134 28.4119 23.7371 29.271 23.1929C30.1302 22.6487 31.1261 22.3593 32.1431 22.358ZM23.1616 27.7271C23.1616 29.0274 24.2188 30.0853 25.519 30.0855H26.7729V28.8316C26.7729 27.5312 25.716 26.4732 24.4155 26.4732H23.1616V27.7271ZM32.1431 24.2652C30.2344 24.2652 28.6812 25.8185 28.6812 27.7271V30.0855H29.9351C31.8437 30.0855 33.3969 28.5322 33.397 26.6236V24.2652H32.1431ZM35.3042 6.90289V14.3306H33.397V10.1597L23.9858 19.5709C23.8071 19.7494 23.5647 19.8501 23.312 19.8502C23.0592 19.8502 22.8161 19.7496 22.6372 19.5709L17.8979 14.8316L17.7925 14.7252L10.522 21.9957L9.17236 20.6461L17.1177 12.7027C17.2966 12.5239 17.5395 12.4234 17.7925 12.4234C18.0453 12.4235 18.2875 12.5239 18.4663 12.7027L23.2056 17.441L23.312 17.5474L23.4175 17.441L31.7915 9.06696L32.0483 8.8111H27.8774V6.90289H35.3042Z" fill="currentColor"/>
    </svg>
  );
}

function BudgetGoalIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M11.3643 2.42422C10.8744 2.32422 10.3694 2.27372 9.8492 2.27271C5.6651 2.27271 2.27344 5.66437 2.27344 9.84846C2.27344 14.0326 5.6651 17.4242 9.8492 17.4242C14.0333 17.4242 17.425 14.0326 17.425 9.84846C17.4239 9.32826 17.3734 8.82321 17.2734 8.33331" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M13.6363 9.84855C13.6363 10.5977 13.4142 11.3301 12.9979 11.953C12.5817 12.5759 11.9901 13.0614 11.298 13.3481C10.6058 13.6348 9.84423 13.7098 9.10945 13.5636C8.37467 13.4175 7.69974 13.0567 7.16999 12.527C6.64025 11.9972 6.27949 11.3223 6.13333 10.5875C5.98718 9.85275 6.06219 9.09113 6.34888 8.39899C6.63558 7.70685 7.12108 7.11526 7.74399 6.69904C8.36691 6.28282 9.09926 6.06067 9.84843 6.06067" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M9.87109 9.82074L13.3203 6.3715M15.712 4.04953L15.2931 2.54347C15.2763 2.4861 15.2457 2.43373 15.2039 2.39102C15.1621 2.3483 15.1104 2.31655 15.0534 2.29858C14.9964 2.2806 14.9358 2.27695 14.8771 2.28795C14.8183 2.29895 14.7632 2.32427 14.7165 2.36165C13.6287 3.25029 12.4438 4.44802 13.4112 6.33665C15.3612 7.24574 16.4749 6.01999 17.3279 4.98893C17.3665 4.94144 17.3926 4.88508 17.404 4.82495C17.4153 4.76482 17.4115 4.70281 17.3928 4.64453C17.3742 4.58625 17.3413 4.53354 17.2972 4.49116C17.253 4.44878 17.199 4.41807 17.14 4.4018L15.712 4.04953Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ConsumptionCoachIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5885 11.0775L13.4044 13.8933C13.7681 14.257 14.0159 14.7205 14.1162 15.225C14.2166 15.7296 14.1651 16.2525 13.9682 16.7278C13.7714 17.2031 13.438 17.6093 13.0102 17.895C12.5825 18.1808 12.0796 18.3333 11.5652 18.3333H11.3977C10.9061 18.3344 10.4233 18.2038 9.99935 17.955C9.57543 18.2038 9.09256 18.3344 8.60102 18.3333H8.43435C7.91985 18.3335 7.41686 18.1811 6.98899 17.8954C6.56112 17.6097 6.2276 17.2035 6.03063 16.7282C5.83366 16.2529 5.78208 15.7298 5.88243 15.2252C5.98277 14.7206 6.23053 14.2571 6.59435 13.8933L9.41018 11.0766C9.56646 10.9204 9.77838 10.8326 9.99935 10.8326C10.2203 10.8326 10.4322 10.9204 10.5885 11.0766V11.0775ZM15.7327 5.8333C16.397 5.83309 17.0362 6.08718 17.5191 6.5434C18.0019 6.99963 18.2919 7.62338 18.3294 8.28663L18.3335 8.43413V8.60163C18.3346 9.09318 18.204 9.57605 17.9552 9.99997C18.1652 10.3575 18.2969 10.7675 18.3269 11.2083L18.3335 11.3983V11.565C18.3338 12.0649 18.19 12.5544 17.9193 12.9747C17.6486 13.395 17.2625 13.7284 16.8072 13.935C16.3519 14.1415 15.8467 14.2125 15.3521 14.1393C14.8575 14.0661 14.3945 13.852 14.0185 13.5225L13.8935 13.405L11.0769 10.5891C10.9335 10.4455 10.8475 10.2546 10.8349 10.052C10.8223 9.84952 10.884 9.64937 11.0085 9.48913L11.0777 9.4108L13.8935 6.59497C14.3811 6.10735 15.0432 5.83338 15.7327 5.8333ZM4.26602 5.8333C4.89935 5.8333 5.50768 6.0633 5.98018 6.47747L6.10518 6.59497L8.92185 9.4108C9.06521 9.5544 9.15125 9.74537 9.16383 9.94789C9.17641 10.1504 9.11467 10.3506 8.99018 10.5108L8.92102 10.5891L6.10518 13.405C5.75019 13.7595 5.30026 14.0038 4.80959 14.1085C4.31893 14.2132 3.80846 14.1738 3.33968 13.995C2.8709 13.8162 2.46382 13.5057 2.16746 13.1009C1.8711 12.6961 1.69812 12.2142 1.66935 11.7133L1.66602 11.5658V11.3983C1.66602 10.8858 1.80518 10.4083 2.04435 9.99997C1.82831 9.63152 1.70105 9.21781 1.67268 8.79163L1.66602 8.60247V8.4358C1.66569 8.09408 1.73272 7.75565 1.86329 7.43986C1.99386 7.12407 2.1854 6.83712 2.42695 6.59541C2.6685 6.3537 2.95533 6.16198 3.27104 6.03121C3.58675 5.90044 3.9243 5.83319 4.26602 5.8333ZM8.60018 1.66663C9.09173 1.66551 9.5746 1.79615 9.99852 2.04497C10.367 1.82892 10.7807 1.70167 11.2069 1.6733L11.3969 1.66663H11.5635C12.0635 1.66635 12.5529 1.81017 12.9732 2.08087C13.3936 2.35158 13.727 2.73769 13.9335 3.19299C14.1401 3.64829 14.211 4.15347 14.1378 4.64805C14.0647 5.14262 13.8505 5.60563 13.521 5.98163L13.4035 6.10663L10.5877 8.9233C10.4441 9.06666 10.2531 9.1527 10.0506 9.16528C9.84807 9.17786 9.64792 9.11612 9.48768 8.99163L9.40935 8.92247L6.59352 6.10663C6.23863 5.75178 5.99398 5.30183 5.88909 4.81105C5.78419 4.32027 5.82353 3.80962 6.00236 3.3407C6.18119 2.87178 6.49187 2.46461 6.89693 2.16831C7.30199 1.872 7.78412 1.69922 8.28518 1.6708L8.43352 1.66663H8.60018Z" fill="currentColor"/>
    </svg>
  );
}

const MENU = [
  { key: "home", label: "홈", Icon: HomeIcon, to: "/home" },
  { key: "consumption-management", label: "소비관리", Icon: ConsumptionManagementIcon, to: "/consumption-management" },
  { key: "consumption-analysis", label: "소비분석", Icon: ConsumptionAnalysisIcon, to: "/consumption-analysis" },
  { key: "budget-goal", label: "예산목표", Icon: BudgetGoalIcon, to: "/budget-goal" },
  { key: "consumption-coach", label: "소비코치", Icon: ConsumptionCoachIcon, to: "/consumption-coach" },
];

const RESET_KEYS = [
  "joinName", "onboardingCompleted", "onboarding2Form",
  "bucketGoal", "bucketGoals",
  "mony_savings_goal", "mony_saved_amount", "mony_challenge_saved_amount",
  "mony_savings_method", "mony_primary_bucket_id",
  "mony_quick_save_amount", "mony_memories",
];

function guessActiveKey(pathname) {
  if (pathname === "/" || pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/consumption-management")) return "consumption-management";
  if (pathname.startsWith("/consumption-analysis")) return "consumption-analysis";
  if (pathname.startsWith("/budget-goal")) return "budget-goal";
  if (pathname.startsWith("/consumption-coach")) return "consumption-coach";
  return "consumption-management";
}

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const nameFromState = location?.state?.name;
  const [name, setName] = useState(() => nameFromState ?? localStorage.getItem("joinName") ?? "");

  useEffect(() => {
    if (typeof nameFromState === "string" && nameFromState.trim().length > 0) {
      const trimmed = nameFromState.trim();
      setName(trimmed);
      localStorage.setItem("joinName", trimmed);
    }
  }, [nameFromState]);

  const activeKey = useMemo(() => guessActiveKey(location.pathname), [location.pathname]);

  const handleReset = () => {
    RESET_KEYS.forEach((k) => localStorage.removeItem(k));
    navigate("/splash");
  };

  return (
    <aside className="menu" aria-label="사이드 메뉴">
      <nav className="menu-nav" aria-label="메뉴">
        <img className="menu-logo" src={Logo} alt="Mony" />
        <LayoutGroup id="menu-active-group">
          <ul className="menu-list">
            {MENU.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <li key={item.key} className="menu-itemWrap">
                  <button
                    type="button"
                    className={`menu-item ${isActive ? "is-active" : "is-inactive"}`}
                    onClick={() => navigate(item.to)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="menu-active-bg"
                        className="menu-activeIndicator"
                        aria-hidden="true"
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 32,
                          mass: 1,
                        }}
                      />
                    )}
                    <span className="menu-itemContent">
                      <item.Icon className="menu-icon" />
                      <span className="menu-label">{item.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </nav>

      <div className="menu-bottom">
        <h4>오늘의 이야기</h4>
        <div className="menu-bottom-top-box">
          이해하는 소비를 실천해 볼까요?
        </div>
        <div className="menu-bottom-context">
          <span className="title">ㅤ목적을 잃지 마라 !!</span>
          <span className="lion">ㅤ돈을 아끼는 것이 미덕이지만,ㅤ돈을 아끼는 것이 목적이  ㅤㅤㅤ되어서는 안 된다.</span>
        </div>
        <p className="menu-resetBtn" onClick={handleReset}>처음으로 가기</p>
      </div>
    </aside>
  );
}
