import { Testimonial } from "../data/testimonials";
import { GoogleIcon, GlobeIcon, Stars } from "./Icons";

export default function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="card-premium"
      style={{
        minWidth: "360px",
        maxWidth: "360px",
        height: "100%",
        flexShrink: 0,
        padding: "36px 32px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Gold accent bar */}
      <div
        className="absolute top-0 left-8 right-8 h-[2px] rounded-b-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
          opacity: 0.4,
        }}
      />

      {/* Source watermark */}
      <div style={{ position: "absolute", top: "28px", right: "28px", opacity: 0.35 }}>
        {t.source === "google" ? <GoogleIcon /> : <GlobeIcon />}
      </div>

      <div>
        {/* Quote mark */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "48px",
            lineHeight: "0.5",
            color: "var(--color-gold)",
            opacity: 0.35,
            display: "block",
            marginBottom: "16px",
          }}
        >
          &ldquo;
        </span>
        <Stars />
        <p
          style={{
            fontSize: "13.5px",
            lineHeight: 1.8,
            color: "var(--color-muted)",
            marginTop: "14px",
          }}
        >
          {t.text}
        </p>
      </div>

      {/* Reviewer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginTop: "24px",
          paddingTop: "18px",
          borderTop: "1px solid rgba(197, 162, 125, 0.1)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: t.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {t.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-charcoal)", lineHeight: 1 }}>
            {t.name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-muted)", marginTop: "5px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>{t.role}</span>
            <span>·</span>
            <span style={{ color: "var(--color-gold)", fontWeight: 600 }}>{t.timeAgo}</span>
            <span>·</span>
            <span
              style={{
                color: t.source === "google" ? "#4285f4" : "var(--color-accent-dark)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "9px",
                letterSpacing: "0.04em",
              }}
            >
              {t.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
