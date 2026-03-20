"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CollectedData {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  details?: string;
}

interface Message {
  id: string;
  who: "bot" | "user";
  text: string;
}

interface FlowStep {
  key: keyof CollectedData | "done";
  bot: string | ((d: CollectedData) => string);
  input: "text" | "chips" | "summary";
  placeholder?: string;
  chips?: string[];
  inputType?: string;
  validate?: (val: string) => string | null;
}

// ─── Conversation Flow ─────────────────────────────────────────────────────────
const FLOW: FlowStep[] = [
  {
    key: "name",
    bot: "Hey! I'm Hamza, project manager at Vexa Motions 👋\n\nLet me put together a quick brief so I can connect you with the right team. What's your name?",
    input: "text",
    placeholder: "Your full name",
    validate: (v) =>
      v.trim().length < 2 ? "Could you enter your full name?" : null,
  },
  {
    key: "email",
    bot: (d) =>
      `Nice to meet you, ${d.name}! What email should we use to follow up?`,
    input: "text",
    placeholder: "your@email.com",
    inputType: "email",
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? null
        : "Hmm, that doesn't look right — double-check the email?",
  },
  {
    key: "projectType",
    bot: "What kind of project are you bringing to us?",
    input: "chips",
    chips: [
      "Motion graphics",
      "Brand animation",
      "Explainer video",
      "Social media content",
      "Full production",
      "Something else",
    ],
  },
  {
    key: "budget",
    bot: "Great choice. What budget range are you working with?",
    input: "chips",
    chips: [
      "Under $1k",
      "$1k – $5k",
      "$5k – $15k",
      "$15k – $50k",
      "$50k+",
      "Not sure yet",
    ],
  },
  {
    key: "timeline",
    bot: "Got it. When do you need this delivered?",
    input: "chips",
    chips: [
      "ASAP (< 2 weeks)",
      "1 month",
      "2–3 months",
      "Flexible",
      "Not sure yet",
    ],
  },
  {
    key: "details",
    bot: (d) =>
      `Almost done — in a sentence or two, what's the core idea behind your ${d.projectType?.toLowerCase()} project?`,
    input: "text",
    placeholder: "Describe your vision...",
    validate: (v) =>
      v.trim().length < 8
        ? "Give us a bit more — even a sentence helps!"
        : null,
  },
  {
    key: "done",
    bot: (d) =>
      `Perfect, ${d.name}! Review your brief below and hit submit — we'll reach out to ${d.email} within 24 hours. 🚀`,
    input: "summary",
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Summary Field Row ──────────────────────────────────────────────────────────
function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px",
        padding: "6px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          color: "#fff",
          fontWeight: 500,
          textAlign: "right",
          wordBreak: "break-word",
          maxWidth: "60%",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Contact() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // step 7 = all done (past last FLOW index)
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CollectedData>({});
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unread, setUnread] = useState(1);
  // Separate flag so summary card never flickers
  const [showSummary, setShowSummary] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, showSummary]);

  // Focus text input when step changes and panel is open
  useEffect(() => {
    if (open && step < FLOW.length && FLOW[step].input === "text") {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [step, open]);

  // Kick off flow on first open
  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setUnread(0);
      const text =
        typeof FLOW[0].bot === "function" ? FLOW[0].bot({}) : FLOW[0].bot;
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ id: uid(), who: "bot", text }]);
      }, 900);
    }
    if (open) setUnread(0);
  }, [open, started]);

  // pushBot: shows typing → appends message → calls onDone callback
  const pushBot = useCallback((text: string, onDone?: () => void) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: uid(), who: "bot", text }]);
      onDone?.();
    }, 750);
  }, []);

  const handleAnswer = useCallback(
    (raw: string) => {
      const current = FLOW[step];
      if (!current || current.input === "summary") return;
      const val = raw.trim();
      if (!val) return;

      if (current.validate) {
        const err = current.validate(val);
        if (err) {
          pushBot(err);
          setInputVal("");
          return;
        }
      }

      const newData: CollectedData = { ...data, [current.key]: val };
      setData(newData);
      setMessages((prev) => [...prev, { id: uid(), who: "user", text: val }]);
      setInputVal("");

      const nextStep = step + 1;
      setStep(nextStep);

      if (nextStep < FLOW.length) {
        const next = FLOW[nextStep];
        const msg =
          typeof next.bot === "function" ? next.bot(newData) : next.bot;

        // If this is the last question, show summary AFTER bot message appears
        const isSummaryStep = next.input === "summary";
        pushBot(msg, () => {
          if (isSummaryStep) setShowSummary(true);
        });
      }
    },
    [step, data, pushBot],
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: data.name,
          email: data.email,
          subject: `New brief from ${data.name} — ${data.projectType}`,
          message: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Project: ${data.projectType}`,
            `Budget: ${data.budget}`,
            `Timeline: ${data.timeline}`,
            `Details: ${data.details}`,
          ].join("\n"),
        }),
      });
      const result = await res.json();
      setShowSummary(false);
      if (result.success) {
        setSubmitted(true);
        pushBot(
          `Your brief is in! 🎉 We'll get back to you at ${data.email} within 24 hours. Talk soon, ${data.name}!`,
        );
      } else {
        pushBot("Something went wrong — could you try submitting again?", () =>
          setShowSummary(true),
        );
      }
    } catch {
      pushBot("Network error — please try again in a moment.", () =>
        setShowSummary(true),
      );
    } finally {
      setSubmitting(false);
    }
  }, [data, pushBot]);

  const currentStep = FLOW[step];

  return (
    <>
      <style>{`
        @keyframes vm-slide-up {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vm-msg-in {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vm-bounce {
          0%, 80%, 100% { transform: scale(0.75); opacity: 0.25; }
          40%           { transform: scale(1);    opacity: 1;    }
        }
        @keyframes vm-ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .vm-panel { animation: vm-slide-up 0.3s cubic-bezier(0.34,1.4,0.64,1) both; }
        .vm-msg   { animation: vm-msg-in 0.22s ease both; }
        .vm-dot   { animation: vm-bounce 1.3s infinite; }
        .vm-dot:nth-child(2) { animation-delay: 0.16s; }
        .vm-dot:nth-child(3) { animation-delay: 0.32s; }
        .vm-scroll::-webkit-scrollbar { width: 0; }
        .vm-chip { transition: background 0.13s, border-color 0.13s, color 0.13s; }
        .vm-chip:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.24) !important; color: #fff !important; }
        .vm-close:hover { background: rgba(255,255,255,0.1) !important; }
        .vm-submit:hover { opacity: 0.88; }
        .vm-send:hover  { transform: scale(1.06); }
        .vm-send:active { transform: scale(0.95); }
        @media (max-width: 639px) {
          .vm-panel {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
          }
        }
      `}</style>

      {/* ── Launcher ──────────────────────────────────────────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with our project manager"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9998,
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 28px rgba(0,0,0,0.55)",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "scale(1.1)";
            el.style.boxShadow = "0 10px 36px rgba(0,0,0,0.65)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "scale(1)";
            el.style.boxShadow = "0 6px 28px rgba(0,0,0,0.55)";
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: "1px",
                right: "1px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#ef4444",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {unread}
              <span
                style={{
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  animation: "vm-ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
            </span>
          )}
        </button>
      )}

      {/* ── Chat Panel ────────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="vm-panel"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            width: "370px",
            height: "min(calc(100vh - 60px), 660px)",
            borderRadius: "20px",
            background: "#0c0c0c",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.75)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              flexShrink: 0,
              padding: "13px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                M
              </div>
              <span
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#34d399",
                  border: "2px solid #0c0c0c",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                Marcus
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "10.5px",
                  color: "rgba(255,255,255,0.32)",
                }}
              >
                Project Manager · Vexa Motions
              </p>
            </div>
            <button
              className="vm-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                flexShrink: 0,
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                transition: "background 0.13s",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages — scrollable area */}
          <div
            className="vm-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 14px 6px",
              display: "flex",
              flexDirection: "column",
              gap: "9px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="vm-msg"
                style={{
                  display: "flex",
                  flexDirection: msg.who === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "7px",
                }}
              >
                {msg.who === "bot" && (
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    M
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius:
                      msg.who === "bot"
                        ? "14px 14px 14px 3px"
                        : "14px 14px 3px 14px",
                    background:
                      msg.who === "bot" ? "rgba(255,255,255,0.07)" : "#ffffff",
                    border:
                      msg.who === "bot"
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    color:
                      msg.who === "bot" ? "rgba(255,255,255,0.88)" : "#0a0a0a",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    fontWeight: msg.who === "user" ? 500 : 400,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {typing && (
              <div
                className="vm-msg"
                style={{ display: "flex", alignItems: "flex-end", gap: "7px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  M
                </div>
                <div
                  style={{
                    padding: "9px 13px",
                    borderRadius: "14px 14px 14px 3px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="vm-dot"
                      style={{
                        display: "block",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Summary card — pinned ABOVE the input bar ── */}
          {showSummary && !submitted && (
            <div
              className="vm-msg"
              style={{
                flexShrink: 0,
                margin: "0 10px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.13)",
                background: "rgba(255,255,255,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Card title */}
              <div
                style={{
                  padding: "9px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Project brief
                </span>
                <span
                  style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}
                >
                  Review before submitting
                </span>
              </div>

              {/* Field rows */}
              <SummaryRow label="Name" value={data.name} />
              <SummaryRow label="Email" value={data.email} />
              <SummaryRow label="Project" value={data.projectType} />
              <SummaryRow label="Budget" value={data.budget} />
              <SummaryRow label="Timeline" value={data.timeline} />
              <SummaryRow label="Details" value={data.details} />

              {/* Submit button */}
              <div style={{ padding: "10px 14px" }}>
                <button
                  className="vm-submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: "10px",
                    background: submitting
                      ? "rgba(255,255,255,0.4)"
                      : "#ffffff",
                    border: "none",
                    color: "#000",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "opacity 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {submitting ? (
                    <>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{ animation: "vm-spin 0.8s linear infinite" }}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Submit brief →"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Spacer below summary / above the bottom edge */}
          {showSummary && !submitted && (
            <div style={{ flexShrink: 0, height: "10px" }} />
          )}

          {/* ── Input bar ── */}
          {!submitted && !showSummary && (
            <div
              style={{
                flexShrink: 0,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "10px 12px",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              {/* Chips */}
              {!typing && currentStep?.input === "chips" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {currentStep.chips?.map((chip) => (
                    <button
                      key={chip}
                      className="vm-chip"
                      onClick={() => handleAnswer(chip)}
                      style={{
                        padding: "5px 11px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.62)",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Text input */}
              {!typing && currentStep?.input === "text" && (
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    ref={inputRef}
                    type={currentStep.inputType || "text"}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAnswer(inputVal)
                    }
                    placeholder={currentStep.placeholder}
                    style={{
                      flex: 1,
                      height: "37px",
                      padding: "0 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.28)")
                    }
                    onBlur={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                  <button
                    className="vm-send"
                    onClick={() => handleAnswer(inputVal)}
                    disabled={!inputVal.trim()}
                    style={{
                      width: "37px",
                      height: "37px",
                      borderRadius: "10px",
                      background: inputVal.trim()
                        ? "#fff"
                        : "rgba(255,255,255,0.07)",
                      border: "none",
                      cursor: inputVal.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.15s, transform 0.12s",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={
                        inputVal.trim() ? "#000" : "rgba(255,255,255,0.25)"
                      }
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Post-submit footer */}
          {submitted && (
            <div
              style={{
                flexShrink: 0,
                padding: "11px 14px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.22)",
                }}
              >
                Brief submitted · Response within 24 hours
              </p>
            </div>
          )}
        </div>
      )}

      {/* Spin keyframe for submit loader */}
      <style>{`@keyframes vm-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
