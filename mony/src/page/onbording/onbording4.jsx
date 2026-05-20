import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./onbording4.css";
import Navigate from "../../component/navigate";
import JoinStarIcon from "../../component/JoinStarIcon";

function Dropdown({ placeholder, value, options, onChange, menuClassName = "" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const isSelected = Boolean(value);

  return (
    <div className="join3-select" ref={wrapRef}>
      <button
        type="button"
        className={`join3-selectBtn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`join3-selectText ${isSelected ? "is-selected" : "is-placeholder"}`}>
          {isSelected ? value : placeholder}
        </span>
        <span className="join3-caret" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div className={`join3-menu ${menuClassName}`} role="listbox">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`join3-item ${value === opt ? "is-active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnBording4() {
  const navigate = useNavigate();
  const location = useLocation();

  const routeName = location?.state?.name;
  const storedName = typeof window !== "undefined" ? localStorage.getItem("joinName") : "";
  const userName = (routeName || storedName || "회원").trim();

  const [method, setMethod]           = useState(null);
  const [cardCompany, setCardCompany] = useState("");
  const [cardType, setCardType]       = useState("");
  const [bank, setBank]               = useState("");
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    if (method === "card") { setBank(""); setAccountType(""); }
    else if (method === "account") { setCardCompany(""); setCardType(""); }
  }, [method]);

  const cardCompanies = ["국민카드", "롯데카드", "삼성카드", "신한카드", "현대카드"];
  const cardTypes     = ["신용카드", "체크카드"];
  const banks         = ["국민은행", "기업은행", "농협은행", "신한은행", "우리은행", "카카오뱅크", "토스뱅크", "하나은행"];
  const accountTypes  = ["입출금", "적금", "예금", "CMA"];

  const isValid = useMemo(() => {
    if (method === "card")    return Boolean(cardCompany) && Boolean(cardType);
    if (method === "account") return Boolean(bank) && Boolean(accountType);
    return false;
  }, [method, cardCompany, cardType, bank, accountType]);

  return (
    <main className="join1-page">
      <div className="join1-iconWrap" aria-hidden="true">
        <JoinStarIcon />
      </div>

      <section className="join1-card" aria-label="회원가입 4단계">
        <div className="join1-progressRow">
          <span className="join1-progressNow">04</span>
          <span className="join1-progressSlash">/</span>
          <span className="join1-progressTotal">04</span>
        </div>

        <div className="join1-titleBlock">
          <p className="join1-kicker">마지막 단계에요</p>
          <h1 className="join1-title">마지막 단계예요.</h1>
        </div>

        <div className="join3-block">
          <p className="join3-label">소비와 저축 가능 금액을 자동으로 계산하기 위해 카드 또는 계좌를 연결해주세요.</p>
          <p className="join3-helper">카드와 계좌 중 한 가지만 선택할 수 있어요</p>

          <div className="join3-options" role="group" aria-label="연결 수단 선택">
            <button
              type="button"
              className={`join3-option ${method === "card" ? "is-on" : ""}`}
              onClick={() => setMethod((prev) => (prev === "card" ? null : "card"))}
            >
              <span className="join3-optionInner">
                <span className="join3-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8.5C3 6.567 4.567 5 6.5 5H17.5C19.433 5 21 6.567 21 8.5V15.5C21 17.433 19.433 19 17.5 19H6.5C4.567 19 3 17.433 3 15.5V8.5Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 9.2H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M7 14.7H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="join3-optionText">카드</span>
              </span>
            </button>

            <button
              type="button"
              className={`join3-option ${method === "account" ? "is-on" : ""}`}
              onClick={() => setMethod((prev) => (prev === "account" ? null : "account"))}
            >
              <span className="join3-optionInner">
                <span className="join3-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5.5 7C4.12 7 3 8.12 3 9.5V16.5C3 17.88 4.12 19 5.5 19H18.5C19.88 19 21 17.88 21 16.5V10.5C21 9.12 19.88 8 18.5 8H6.8C6.25 8 5.73 7.78 5.34 7.39C4.95 7 4.73 6.48 4.73 5.93C4.73 5.38 4.95 4.86 5.34 4.47C5.73 4.08 6.25 3.86 6.8 3.86H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 13.2H18.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="join3-optionText">계좌</span>
              </span>
            </button>
          </div>

          {method === "card" && (
            <div className="join3-sub">
              <div className="join3-field">
                <p className="join3-subTitle">카드사를 선택해 주세요</p>
                <p className="join3-subHelper">별도의 카드번호 입력 없이 카드사 선택으로 연결돼요</p>
                <Dropdown placeholder="카드사 선택" value={cardCompany} options={cardCompanies} onChange={setCardCompany} />
              </div>
              <div className="join3-field">
                <p className="join3-subTitle">카드 유형을 선택해 주세요</p>
                <Dropdown placeholder="카드유형 선택" value={cardType} options={cardTypes} onChange={setCardType} />
              </div>
              <ul className="join3-bullets">
                <li>모든 정보는 암호화되어 안전하게 처리돼요</li>
                <li>연결 후 자동으로 지출과 저축 가능 금액을 분류해 드려요</li>
              </ul>
            </div>
          )}

          {method === "account" && (
            <div className="join3-sub">
              <div className="join3-field">
                <p className="join3-subTitle">금융기관을 선택해 주세요</p>
                <p className="join3-subHelper">별도의 계좌번호 입력 없이 금융기관 선택으로 연결돼요</p>
                <Dropdown placeholder="금융기관 선택" value={bank} options={banks} onChange={setBank} menuClassName="join3-menu--bank" />
              </div>
              <div className="join3-field">
                <p className="join3-subTitle">계좌 유형을 선택해 주세요</p>
                <Dropdown placeholder="계좌유형 선택" value={accountType} options={accountTypes} onChange={setAccountType} />
              </div>
              <ul className="join3-bullets">
                <li>모든 정보는 암호화되어 안전하게 처리돼요</li>
                <li>연결 후 자동으로 지출과 저축 가능 금액을 분류해 드려요</li>
              </ul>
            </div>
          )}

          <button
            type="button"
            disabled={!isValid}
            className={`join1-button ${isValid ? "is-enabled" : "is-disabled"}`}
            onClick={() => { if (isValid) navigate("/home", { state: { name: userName } }); }}
          >
            확인
          </button>
        </div>
      </section>

      <Navigate />
    </main>
  );
}
