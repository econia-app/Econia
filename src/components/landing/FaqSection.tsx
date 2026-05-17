"use client";
import { useState } from "react";
import { T } from "@/lib/theme";
import { faqs } from "@/lib/theme";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="section" style={{ background: T.bgCard, padding: "110px 24px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: T.blue, marginBottom: "14px" }}>
          FAQ
        </div>
        <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px" }}>
          Vous hésitez encore ?
        </h2>
        <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>
          Les réponses à vos questions.
        </p>
        <div style={{ maxWidth: "640px" }}>
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} style={{ borderBottom: `1px solid ${T.borderLight}`, padding: "22px 0" }}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    color: T.navy,
                    textAlign: "left",
                  }}
                >
                  <span>{f.q}</span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: isOpen ? T.blueLight : T.bg,
                      border: `1px solid ${isOpen ? "rgba(37,99,235,0.2)" : T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      color: isOpen ? T.blue : T.textMuted,
                      flexShrink: 0,
                      transition: "transform 0.3s",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  style={{
                    maxHeight: isOpen ? "200px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                    fontSize: "14px",
                    color: T.textSoft,
                    lineHeight: 1.75,
                    paddingTop: isOpen ? "14px" : "0",
                  }}
                >
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
