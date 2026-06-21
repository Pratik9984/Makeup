import {
  Sparkle4Icon,
  ConcentricCirclesIcon,
  EyeIcon,
  SparklesIcon,
} from "./Icons";
import { specialties } from "../data/specialties";
import React from "react";

const iconMap = {
  traditional: Sparkle4Icon,
  fusion: ConcentricCirclesIcon,
  airbrush: EyeIcon,
  eyes: SparklesIcon,
};

const cardAccents = [
  {
    border: "var(--color-rose)",
    bg: "rgba(196, 139, 127, 0.02)",
    iconBg: "rgba(196, 139, 127, 0.08)",
    iconColor: "var(--color-rose)",
    numColor: "rgba(196, 139, 127, 0.08)",
  },
  {
    border: "var(--color-gold)",
    bg: "rgba(197, 162, 125, 0.03)",
    iconBg: "rgba(197, 162, 125, 0.08)",
    iconColor: "var(--color-gold)",
    numColor: "rgba(197, 162, 125, 0.08)",
  },
  {
    border: "#8fa89b", // Sage Green
    bg: "rgba(143, 168, 155, 0.02)",
    iconBg: "rgba(143, 168, 155, 0.08)",
    iconColor: "#799285",
    numColor: "rgba(143, 168, 155, 0.08)",
  },
  {
    border: "var(--color-taupe)",
    bg: "rgba(138, 131, 124, 0.02)",
    iconBg: "rgba(138, 131, 124, 0.08)",
    iconColor: "var(--color-taupe)",
    numColor: "rgba(138, 131, 124, 0.08)",
  },
];

export default function Expertise({ content }: { content?: any[] }) {
  const specialtiesList = content || specialties;

  return (
    <section
      id="expertise"
      className="my-12 md:my-28 pt-20 pb-20 md:pt-40 md:pb-40 relative"
      style={{
        background: "#FAF7F2",
        borderTop: "1px solid rgba(197, 162, 125, 0.08)",
        borderBottom: "1px solid rgba(197, 162, 125, 0.08)",
      }}
    >
      <div className="wrap">
        {/* Header */}
        <div className="reveal mb-14 md:mb-20" style={{ textAlign: "center" }}>
          <span className="section-subtitle" style={{ display: "block", textAlign: "center" }}>What I specialize in</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Expertise &amp; techniques
          </h2>
          <div
            className="section-ornament"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "16px",
            }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 lg:gap-10">
          {specialtiesList.map((s: any, i: number) => {
            const IconComp = iconMap[s.iconName as keyof typeof iconMap];
            const accent = cardAccents[i] || cardAccents[1];
            return (
              <div
                key={s.title}
                className="reveal"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div
                  className="card-premium h-full relative group p-4 sm:p-6 md:p-8 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,24,21,0.06)] transition-all duration-300 ease-out"
                  style={{
                    borderRadius: "24px",
                    borderLeft: `3.5px solid ${accent.border}`,
                    background: accent.bg,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                    "--accent-color": accent.border,
                  } as React.CSSProperties}
                >
                  {/* Decorative number watermark */}
                  <span
                    className="absolute bottom-[-18px] right-2 select-none pointer-events-none transition-all duration-700 ease-out group-hover:translate-x-[-8px] group-hover:translate-y-[-4px] z-0"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(100px, 12vw, 140px)",
                      fontWeight: 700,
                      color: accent.numColor,
                      lineHeight: 0.8,
                    }}
                  >
                    {s.num}
                  </span>

                  {/* Content */}
                  <div className="flex items-start gap-4 sm:gap-5 relative z-[1]">
                    {/* Icon badge */}
                    <div
                      className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-400 group-hover:scale-110"
                      style={{
                        background: accent.iconBg,
                        border: `1.5px solid ${accent.border}`,
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
                      }}
                    >
                      {IconComp ? (
                        <IconComp
                          className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]"
                          stroke={accent.iconColor}
                        />
                      ) : null}
                    </div>

                    <div>
                      {/* Number */}
                      <span
                        className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase block mb-0.5 sm:mb-1.5"
                        style={{ color: accent.iconColor }}
                      >
                        {s.num}
                      </span>

                      <h3
                        className="text-[16px] sm:text-[19px] md:text-[20px] font-bold transition-colors duration-300 mb-1 sm:mb-2 group-hover:text-[var(--accent-color)]"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--color-charcoal)",
                          lineHeight: 1.3,
                        }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="text-[12.5px] sm:text-[13px] md:text-[13.5px] leading-[1.7] max-w-[400px]"
                        style={{
                          color: "var(--color-muted)",
                        }}
                      >
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14 md:mt-18 reveal">
          <a href="#contact" className="btn-primary">
            Book a Trial Session
          </a>
        </div>
      </div>
    </section>
  );
}
