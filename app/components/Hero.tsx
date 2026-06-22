import Image from "next/image";
import { ArrowRightIcon, ArrowDownIcon } from "./Icons";

export default function Hero({ content }: { content?: any }) {
  const badge = content?.badge || "Professional Makeup Artist · Ahilyanagar";
  const title = content?.title || "Your beauty,";
  const titleAccent = content?.titleAccent || "my artistry.";
  const subtitle = content?.subtitle || "I'm Rupali — transforming faces and creating unforgettable looks for brides, events, and editorial shoots across Ahilyanagar and Maharashtra. Every face tells a story, and I am here to help you tell yours beautifully.";
  const primaryImage = content?.primaryImage || "/hero.png";
  const secondaryImage = content?.secondaryImage || "/portfolio_maharashtrian_bride.png";
  const statsList = content?.stats || [
    { value: "500+", label: "Happy Brides" },
    { value: "1200+", label: "Looks Created" },
    { value: "8+", label: "Years Exp" },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center hero-bg-mesh relative"
      style={{ paddingTop: "140px", paddingBottom: "110px" }}
    >
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-28 items-center">
          {/* Left text */}
          <div className="lg:pr-4">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8 animate-hero-text"
              style={{
                animationDelay: "0.1s",
                background: "rgba(184, 149, 106, 0.06)",
                border: "1px solid rgba(184, 149, 106, 0.18)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full relative"
                style={{ background: "var(--color-accent)" }}
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--color-accent)",
                    animation: "pulse-ring 2s ease-out infinite",
                  }}
                />
              </span>
              <span
                className="text-[10px] font-bold tracking-[0.14em] uppercase"
                style={{ color: "var(--color-accent-dark)" }}
              >
                {badge}
              </span>
            </div>

            {/* Main heading */}
            <h1
              className="leading-[1.15] mb-5 animate-hero-text"
              style={{
                animationDelay: "0.25s",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(38px, 5.5vw, 66px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--color-charcoal)",
              }}
            >
              <span className="sr-only">Rupali Shinde - Best Beauty Parlor &amp; Bridal Makeup Artist in Ahilyanagar, Maharashtra</span>
              {title}
              <br />
              <span
                className="italic font-light"
                style={{
                  fontFamily: "var(--font-accent)",
                  color: "var(--color-accent)",
                }}
              >
                {titleAccent}
              </span>
            </h1>

            {/* Decorative gold line */}
            <div
              className="animate-line-grow mb-7"
              style={{
                height: "2px",
                background: "linear-gradient(90deg, var(--color-gold), transparent)",
                borderRadius: "2px",
              }}
            />

            <p
              className="max-w-[460px] animate-hero-text"
              style={{
                animationDelay: "0.45s",
                fontSize: "15px",
                lineHeight: 1.9,
                color: "var(--color-muted)",
                marginBottom: "44px",
              }}
            >
              {subtitle}
            </p>

            <div
              className="flex flex-wrap items-center gap-4 animate-hero-text"
              style={{ animationDelay: "0.6s" }}
            >
              <a href="#contact" className="btn-primary group">
                Book a Session
                <ArrowRightIcon className="inline-block transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#portfolio" className="btn-secondary group">
                See My Work
                <ArrowDownIcon className="inline-block transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </div>


          </div>

          {/* Right — Photo collage */}
          <div className="hidden lg:block">
            <div className="relative w-full h-[580px] flex items-center justify-center">

              {/* Floating Glassmorphic Badge */}
              <div className="absolute top-0 right-6 z-30 animate-float-slow">
                <div className="glass-badge w-[112px] h-[112px] rounded-full flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-full animate-spin-slow"
                    style={{ border: "1px solid rgba(184, 149, 106, 0.15)" }}
                  />
                  <span
                    className="text-[10px] uppercase font-extrabold tracking-[0.16em] mb-0.5"
                    style={{ color: "var(--color-accent)" }}
                  >
                    MUA
                  </span>
                  <span
                    className="text-[9px] uppercase font-semibold leading-tight"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    Certified
                    <br />HD Base
                  </span>
                </div>
              </div>

              {/* Primary Image */}
              <div
                className="relative overflow-hidden w-[78%] h-[490px] group animate-float-slow"
                style={{
                  borderRadius: "80px 24px 80px 24px",
                  alignSelf: "start",
                  marginLeft: "auto",
                  boxShadow: "0 28px 64px rgba(26, 24, 21, 0.14), 0 8px 20px rgba(184, 149, 106, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <Image
                  src={primaryImage}
                  alt="Bridal makeup by Rupali Shinde"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                {/* Bottom gradient fade */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-28"
                  style={{
                    background: "linear-gradient(to top, rgba(255, 255, 255, 0.4), transparent)",
                  }}
                />
              </div>

              {/* Secondary Overlapping Image */}
              <div
                className="absolute bottom-2 left-0 w-[48%] h-[240px] z-20 overflow-hidden group animate-float-medium"
                style={{
                  borderRadius: "24px 80px 24px 80px",
                  boxShadow: "0 20px 48px rgba(26, 24, 21, 0.16), 0 4px 12px rgba(184, 149, 106, 0.06)",
                  border: "4px solid var(--color-warm-white)",
                }}
              >
                <Image
                  src={secondaryImage}
                  alt="Maharashtrian bridal look detail"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 240px"
                />
              </div>

              {/* Decorative gold accent ring */}
              <div
                className="absolute bottom-20 right-4 w-16 h-16 rounded-full animate-float-medium"
                style={{
                  border: "1.5px solid rgba(184, 149, 106, 0.2)",
                  animationDelay: "1s",
                }}
              />

            </div>
          </div>
        </div>

        {/* Stats strip at bottom */}
        <div
          className="mt-16 lg:mt-20 animate-hero-text"
          style={{ animationDelay: "0.9s" }}
        >
          <div
            className="grid grid-cols-3 items-center rounded-2xl px-8 py-6"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(197, 162, 125, 0.12)",
              maxWidth: "520px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.03)",
            }}
          >
            {statsList.map((stat: { value: string; label: string }, i: number) => (
              <div
                key={stat.label}
                className="text-center"
                style={{
                  borderLeft: i > 0 ? "1px solid rgba(184, 149, 106, 0.18)" : "none",
                }}
              >
                <span
                  className="block text-2xl sm:text-3xl font-light"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-gold)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.12em] mt-1.5 block"
                  style={{ color: "var(--color-muted)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden lg:flex justify-center mt-10 animate-hero-text"
          style={{ animationDelay: "1.1s" }}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce-gentle">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-muted)" }}>
              Scroll
            </span>
            <ArrowDownIcon size={16} stroke="var(--color-muted)" />
          </div>
        </div>
      </div>
    </section>
  );
}
