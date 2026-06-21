import Image from "next/image";

export default function About({ content }: { content?: any }) {
  const subtitle = content?.subtitle || "A little about me";
  const title = content?.title || "Eight years of making\nwomen feel beautiful";
  const quote = content?.quote || "Every face is unique — I never do a one-size-fits-all look.";
  const image = content?.image || "/about.png";
  const paragraphs = content?.paragraphs || [
    "I'm Rupali Shinde, a professional makeup artist based in Ahilyanagar, Maharashtra with over 8 years of experience in bridal, party, and editorial makeup. I trained under some of the finest artists in Pune and Mumbai before bringing my craft home to Ahilyanagar.",
    "I believe every face is unique — which is why I never do a one-size-fits-all look. I take time to understand your skin, your personality, and your vision before I open a single palette."
  ];
  const tags = content?.tags || [
    "Certified in HD & Airbrush",
    "Premium international products",
    "Home & venue visits"
  ];

  return (
    <section
      id="about"
      className="pt-24 pb-24 md:pt-40 md:pb-40 relative"
      style={{ background: "#ffffff" }}
    >
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-16 lg:gap-32 items-center">
          {/* Photo */}
          <div className="reveal flex justify-center lg:justify-start">
            <div className="relative">
              {/* Double border frame */}
              <div
                className="absolute -inset-3"
                style={{
                  borderRadius: "100px 24px 24px 24px",
                  border: "1px solid rgba(197, 162, 125, 0.12)",
                }}
              />
              <div
                className="absolute -inset-1.5"
                style={{
                  borderRadius: "98px 22px 22px 22px",
                  border: "1px solid rgba(197, 162, 125, 0.2)",
                }}
              />

              {/* Image Container */}
              <div
                className="relative overflow-hidden z-10 group"
                style={{
                  borderRadius: "96px 20px 20px 20px",
                  maxWidth: "380px",
                  boxShadow: "0 24px 56px rgba(26, 24, 21, 0.1), 0 8px 20px rgba(184, 149, 106, 0.04)",
                }}
              >
                <Image
                  src={image}
                  alt="Rupali Shinde at work in her studio"
                  width={380}
                  height={460}
                  className="object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                  style={{ width: "100%", height: "auto", objectPosition: "center" }}
                />
                {/* Subtle bottom gradient */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{ background: "linear-gradient(to top, rgba(255, 255, 255, 0.3), transparent)" }}
                />
              </div>

              {/* Pull quote overlapping bottom-right */}
              <div
                className="absolute -bottom-6 -right-6 z-20 hidden lg:block"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(197, 162, 125, 0.2)",
                  borderRadius: "20px",
                  padding: "18px 22px",
                  maxWidth: "200px",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.03)",
                }}
              >
                <span
                  className="text-[32px] leading-none block mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
                >
                  &ldquo;
                </span>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-muted)", fontStyle: "italic", fontFamily: "var(--font-accent)", fontSize: "14px" }}
                >
                  {quote}
                </p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <span className="section-subtitle">{subtitle}</span>
            <h2 className="section-title mb-2" style={{ whiteSpace: "pre-line" }}>
              {title}
            </h2>
            <div className="section-ornament mb-8" />

            <div
              className="space-y-6 mb-12"
              style={{ fontSize: "14.5px", lineHeight: 2.0, color: "var(--color-muted)" }}
            >
              {paragraphs.map((p: string, idx: number) => (
                <p key={idx} className={idx === 0 ? "drop-cap" : ""}>
                  {p}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3.5 mb-12">
              {tags.map((item: string) => (
                <span
                  key={item}
                  className="text-[11px] font-semibold px-4 py-2.5 rounded-full tracking-wide flex items-center gap-2 transition-all duration-300"
                  style={{
                    border: "1px solid rgba(197, 162, 125, 0.18)",
                    color: "var(--color-gold-dark)",
                    background: "var(--color-gold-light)",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
