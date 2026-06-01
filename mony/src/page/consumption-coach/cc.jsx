import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { goals as goalsApi, buckets as bucketsApi, analysis } from "../../api/index.js";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import charSvg from "../../assets/home/char.svg";
import {
  cardMotion,
  Reveal,
  staggerContainerVariants,
  staggerItemVariants,
} from "../../component/homeMotion";
import "./cc.css";

const GROQ_URL = "/api/groq";

function buildSystemPrompt({ savingsGoal, savedAmount, totalSpent, bucket }) {
  const pct = savingsGoal > 0 ? Math.round((savedAmount / savingsGoal) * 100) : 0;
  const remain = Math.max(0, savingsGoal - savedAmount);
  const bucketPct = bucket?.mony_ing > 0
    ? Math.round(((bucket.mony_finish || 0) / bucket.mony_ing) * 100)
    : 0;

  return `당신은 MONY 앱의 소비 코치입니다.
사용자 정보:
- 이번 달 저축 목표: ${savingsGoal.toLocaleString()}원
- 현재 저축 적립: ${savedAmount.toLocaleString()}원
- 달성률: ${pct}%
- 남은 저축 금액: ${remain.toLocaleString()}원${
    totalSpent > 0 ? `\n- 이번 달 총 지출: ${totalSpent.toLocaleString()}원` : ""
  }${
    bucket
      ? `\n- 버킷리스트 목표: ${bucket.title}\n- 목표 금액: ${(bucket.mony_ing || 0).toLocaleString()}원\n- 현재 모인 금액: ${(bucket.mony_finish || 0).toLocaleString()}원\n- 달성률: ${bucketPct}%`
      : ""
  }

규칙:
1. 2~4문장으로 간결하게 답변하세요.
2. 친근하고 따뜻한 말투를 사용하세요.
3. 구체적인 수치를 언급하세요.
4. 한국어로만 답변하세요.
5. 마크다운 기호(**, ##, - 등)는 절대 사용하지 마세요. 일반 텍스트로만 답변하세요.`;
}

const quickCards = [
  { title: "이번 달 소비 분석", text: "지출 패턴,소비 흐름" },
  { title: "지출 줄이는 방법", text: "절약 방식 추천" },
  { title: "예산 맞추기", text: "남은 금액 활용" },
  { title: "나의 소비 습관", text: "소비 성향 분석" },
  { title: "카드 사용 분석", text: "카드 지출" },
  { title: "저축 챌린지 조언", text: "저축 목표를 달성" },
  { title: "저금통 현황 확인", text: "현재 저금통 현황" },
  { title: "직접 물어보기", text: "궁금한 점을 질문하기" },
  { title: "저금통 얼마나 찼어?", text: "저금통 달성률", savings: true },
  {
    title: "오늘 아낀 돈 넣기",
    text: "오늘 절약한 금액을 저금통에 적립",
    savings: true,
  },
  {
    title: "이번 달 저축 가능 금액 보기",
    text: "저축 가능 금액",
    savings: true,
  },
  {
    title: "목표 달성하려면 얼마나 아껴야 해?",
    text: "목표 달성 소비?",
    savings: true,
  },
];

const miniCards = [
  {
    label: "소비 흐름",
    value: "3월은 지출이 증가하는 추세에요",
    meta: "12% 증가",
  },
  {
    label: "주의 필요",
    value: "쇼핑 지출이 증가하고 있어요",
    meta: "시간 대비 빠른 지출 속도",
  },
  {
    label: "지출 패턴 안정",
    value: "교통비 지출이 안정적이에요",
    meta: "3주간 유지되는 교통비 지출",
  },
];

const formatTime = (date = new Date()) =>
  date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

// ── Groq API 호출 ──
const callGroq = async (userText, history, systemPrompt) => {
  const contents =
    history.length === 0
      ? [{ role: "user", parts: [{ text: userText }] }]
      : [...history, { role: "user", parts: [{ text: userText }] }];

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents, system_prompt: systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "응답을 받지 못했어요.";
};

export default function CC() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ccSaveToast, setCcSaveToast] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const groqHistory = useRef([]);
  const chatEndRef = useRef(null);
  const systemPromptRef = useRef(buildSystemPrompt({
    savingsGoal: Number(localStorage.getItem("mony_savings_goal")) || 100000,
    savedAmount: Number(localStorage.getItem("mony_saved_amount")) || 0,
    totalSpent: 0,
    bucket: null,
  }));
  const hasChatted = messages.length > 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const periodDetail = new Date().toISOString().slice(0, 7);
    const savedAmount = Number(localStorage.getItem("mony_saved_amount")) || 0;

    Promise.all([
      goalsApi.getAll().catch(() => ({ data: [] })),
      bucketsApi.getAll().catch(() => ({ data: [] })),
      analysis.summary(periodDetail).catch(() => null),
    ]).then(([goalsRes, bucketsRes, summaryRes]) => {
      const monthly = goalsRes.data?.find(
        (g) => g.period_type === "monthly" && g.period_detail === periodDetail,
      ) ?? goalsRes.data?.[0];

      systemPromptRef.current = buildSystemPrompt({
        savingsGoal: monthly?.target_amount || Number(localStorage.getItem("mony_savings_goal")) || 100000,
        savedAmount,
        totalSpent: summaryRes?.data?.total || 0,
        bucket: bucketsRes.data?.[0] || null,
      });
    });
  }, []);

  const handleCcSave = async (amount) => {
    const prev = Number(localStorage.getItem("mony_saved_amount") ?? 0);
    localStorage.setItem("mony_saved_amount", String(prev + amount));
    setCcSaveToast(amount);
    setTimeout(() => setCcSaveToast(null), 2500);

    const bucketId = localStorage.getItem("mony_primary_bucket_id");
    if (bucketId) {
      try {
        const res = await bucketsApi.getById(bucketId);
        if (res.data) {
          const newMonyFinish = Math.min(
            (res.data.mony_finish || 0) + amount,
            res.data.mony_ing || Infinity,
          );
          await bucketsApi.updateMoney(bucketId, newMonyFinish);
        }
      } catch {}
    }
  };

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const now = formatTime();
    const loadingId = `loading-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: content, time: now },
      {
        id: loadingId,
        role: "assistant",
        reply: { type: "loading" },
        time: now,
      },
    ]);
    setMessage("");
    setIsLoading(true);

    try {
      const replyText = await callGroq(content, groqHistory.current, systemPromptRef.current);

      groqHistory.current = [
        ...groqHistory.current,
        { role: "user", parts: [{ text: content }] },
        { role: "model", parts: [{ text: replyText }] },
      ];

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, reply: { type: "text", text: replyText } }
            : m,
        ),
      );
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                reply: {
                  type: "error",
                  text: `오류가 발생했어요: ${e.message}`,
                },
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <div className="cc-page">
      <div className="cc-shell">
        <Menu />

        <main className="cc-main">
          <HomeHeader />
            {/* ── TOP STRIP ── */}
            <Reveal as="section" className="cc-topStrip" amount={0.2}>
              <div className="cc-topIntro">
                <p className="cc-topEyebrow">오늘의 코칭</p>
                <h2 className="cc-topTitle">
                  최근 식비 지출이 증가하고 있어요.
                  <br />
                  이번 주는 외식 횟수를 줄여보는 건 어떨까요?
                </h2>
              </div>

              {miniCards.map((card) => (
                <motion.article
                  key={card.label}
                  className="cc-miniCard"
                  {...cardMotion}
                >
                  <span className="cc-miniLabel">{card.label}</span>
                  <strong className="cc-miniValue">{card.value}</strong>
                  <span className="cc-miniMeta">{card.meta}</span>
                </motion.article>
              ))}

              <div className="cc-avatarWrap" aria-hidden="true">
                <img src={charSvg} alt="" className="cc-avatarImg" />
              </div>
            </Reveal>

            {/* ── MAIN BODY ── */}
            {!hasChatted ? (
              <motion.section
                className="cc-heroSection"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  className="cc-heroCopy"
                  variants={staggerItemVariants}
                >
                  <p className="cc-heroEyebrow">
                    김수한무님의 소비 관리에 있어서
                  </p>
                  <h2 className="cc-heroTitle">
                    MONY의 소비코치가
                    <br />더 나은 선택으로 도와드릴게요
                  </h2>
                </motion.div>

                <motion.div
                  className="cc-promptGrid"
                  variants={staggerContainerVariants}
                >
                  {quickCards.map((card) => (
                    <motion.button
                      key={card.title}
                      type="button"
                      className={`cc-promptCard${card.savings ? " cc-promptCard--savings" : ""}`}
                      onClick={() =>
                        card.text ? sendMessage(card.text) : null
                      }
                      variants={staggerItemVariants}
                      {...cardMotion}
                    >
                      <span className="cc-promptIcon">
                        {card.savings ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                          </svg>
                        )}
                      </span>
                      <div className="cc-promptCardText">
                        <span className="cc-promptTitle">{card.title}</span>
                        <span className="cc-promptSub">
                          {card.text || "궁금한 점을 질문하기"}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

                <div className="cc-heroInputArea">
                  <form className="cc-heroForm" onSubmit={handleSubmit}>
                    <div
                      className={`cc-heroInputWrap${inputFocused || message ? " cc-heroInputWrap--active" : ""}`}
                    >
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        placeholder="무엇이든 물어보세요"
                        className="cc-heroInput"
                        disabled={isLoading}
                      />
                      {(inputFocused || message) && (
                        <button
                          type="submit"
                          className="cc-heroSendBtn"
                          disabled={isLoading || !message.trim()}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 2 11 13" />
                            <path d="M22 2 15 22 11 13 2 9l20-7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </motion.section>
            ) : (
              <motion.section
                className="cc-chatPanel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                <div className="cc-chatMessages" role="log" aria-live="polite">
                  {messages.map((item) =>
                    item.role === "user" ? (
                      <div key={item.id} className="cc-bubble cc-bubble--user">
                        <p>{item.text}</p>
                      </div>
                    ) : item.reply?.type === "loading" ? (
                      <div key={item.id} className="cc-bubble cc-bubble--asst">
                        <div className="cc-thinkingBox">
                          <span className="cc-thinkingText">
                            패턴을 정리하고 있어요
                            <span className="cc-dot" />
                            <span className="cc-dot" />
                            <span className="cc-dot" />
                          </span>
                        </div>
                      </div>
                    ) : item.reply?.type === "error" ? (
                      <div
                        key={item.id}
                        className="cc-bubble cc-bubble--asst cc-bubble--error"
                      >
                        <p className="cc-errorText">{item.reply.text}</p>
                      </div>
                    ) : (
                      <div key={item.id} className="cc-bubble cc-bubble--asst">
                        <p>{item.reply?.text}</p>
                      </div>
                    ),
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form className="cc-chatForm" onSubmit={handleSubmit}>
                  <div
                    className={`cc-chatInputWrap${inputFocused ? " cc-chatInputWrap--active" : ""}`}
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder={
                        isLoading
                          ? "답변을 기다리는 중..."
                          : "무엇이든 물어보세요"
                      }
                      className="cc-chatInput"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className={`cc-sendButton${isLoading ? " cc-sendButton--loading" : ""}${message.trim() ? " cc-sendButton--active" : ""}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="cc-sendSpinner" />
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 2 11 13" />
                          <path d="M22 2 15 22 11 13 2 9l20-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </motion.section>
            )}
        </main>
      </div>

      {ccSaveToast !== null && (
        <div className="cc-saveToast" role="status" aria-live="polite">
          🪙 {ccSaveToast.toLocaleString()}원이 저축 저금통에 반영됐어요!
        </div>
      )}
    </div>
  );
}
