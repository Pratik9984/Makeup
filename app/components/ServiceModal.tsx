import { useState } from "react";
import Image from "next/image";
import { ServiceItem } from "../data/services";
import { CloseIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";

type ServiceModalProps = {
  service: ServiceItem;
  onClose: () => void;
};

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "process">("overview");
  const [galleryIndex, setGalleryIndex] = useState(0);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "process" as const, label: "Process" },
    { key: "products" as const, label: "Products Used" },
  ];

  const handlePrevImage = () => {
    setGalleryIndex((prev) => (prev === 0 ? service.gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setGalleryIndex((prev) => (prev === service.gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 md:p-10"
      onClick={onClose}
      style={{
        background: "rgba(26, 24, 21, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-5xl w-full relative overflow-y-auto"
        style={{
          maxHeight: "calc(100vh - 80px)",
          animation: "fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid rgba(197, 162, 125, 0.12)",
          boxShadow:
            "0 40px 80px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(197, 162, 125, 0.03)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(197, 162, 125, 0.2)",
          }}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-gold)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.color = "inherit";
          }}
        >
          <CloseIcon />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
          {/* ── Left: Gallery ──────────────────────── */}
          <div className="p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 bg-cream/30">
            {/* Main image */}
            <div
              className="w-full relative overflow-hidden rounded-2xl"
              style={{ height: "340px", background: "#f3ede6" }}
            >
              <Image
                key={service.gallery[galleryIndex]}
                src={service.gallery[galleryIndex]}
                alt={`${service.title} gallery`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-opacity duration-500"
              />

              {/* Nav arrows */}
              {service.gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md z-10"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </>
              )}

              {/* Tag badge */}
              {service.tag && (
                <span
                  className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full z-10"
                  style={{
                    background: "rgba(255, 255, 255, 0.92)",
                    color: "var(--color-gold-dark)",
                    border: "1px solid rgba(197, 162, 125, 0.25)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {service.tag}
                </span>
              )}
            </div>

            {/* Gallery counter */}
            {service.gallery.length > 1 && (
              <div className="text-center text-[10px] text-muted font-bold tracking-[0.15em] mt-3">
                {galleryIndex + 1} / {service.gallery.length}
              </div>
            )}

            {/* Thumbnails */}
            {service.gallery.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none pt-4 pb-1 mt-3">
                {service.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIndex(idx)}
                    className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 border-2"
                    style={{
                      borderColor: galleryIndex === idx ? "var(--color-gold)" : "transparent",
                      boxShadow:
                        galleryIndex === idx ? "0 4px 10px rgba(197, 162, 125, 0.2)" : "none",
                      opacity: galleryIndex === idx ? 1 : 0.6,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick info pills (below gallery) */}
            <div
              className="mt-5 grid grid-cols-2 gap-3"
              style={{ borderTop: "1px solid rgba(197, 162, 125, 0.1)", paddingTop: "20px" }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-muted/65 tracking-wider">
                  Duration
                </span>
                <span className="text-[13px] font-semibold text-charcoal">{service.duration}</span>
              </div>
              {service.startingAt && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-muted/65 tracking-wider">
                    Starting At
                  </span>
                  <span className="text-[13px] font-semibold text-charcoal">
                    {service.startingAt}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Details ─────────────────────── */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-px" style={{ background: "var(--color-gold)" }} />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gold">
                  {service.subtitle}
                </span>
              </div>
              <h3
                className="text-2xl font-bold text-charcoal leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {service.title}
              </h3>
            </div>

            {/* Tab navigation */}
            <div
              className="flex gap-1 mb-6 p-1 rounded-xl"
              style={{ background: "rgba(197, 162, 125, 0.06)" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 text-[11px] font-bold tracking-[0.08em] uppercase py-2.5 px-3 rounded-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: activeTab === tab.key ? "#fff" : "transparent",
                    color:
                      activeTab === tab.key
                        ? "var(--color-charcoal)"
                        : "var(--color-muted)",
                    boxShadow:
                      activeTab === tab.key
                        ? "0 2px 8px rgba(0, 0, 0, 0.06)"
                        : "none",
                    border:
                      activeTab === tab.key
                        ? "1px solid rgba(197, 162, 125, 0.12)"
                        : "1px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ─────────────── */}
            <div className="flex-grow overflow-y-auto pr-1" style={{ maxHeight: "340px" }}>
              {/* Overview tab */}
              {activeTab === "overview" && (
                <div style={{ animation: "fadeIn 0.35s ease" }}>
                  <p
                    className="text-[13.5px] text-muted leading-relaxed mb-6"
                    style={{ lineHeight: 1.85 }}
                  >
                    {service.fullDescription}
                  </p>

                  {/* What's included */}
                  <div
                    className="mb-6 pb-5"
                    style={{ borderBottom: "1px solid rgba(197, 162, 125, 0.08)" }}
                  >
                    <h4 className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-gold mb-3.5">
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2.5">
                      {service.inclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[12.5px] text-muted leading-relaxed"
                        >
                          <CheckIcon />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For */}
                  <div>
                    <h4 className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-gold mb-3">
                      Ideal For
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {service.idealFor.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-semibold px-3 py-1.5 rounded-full"
                          style={{
                            background: "rgba(197, 162, 125, 0.06)",
                            color: "var(--color-gold-dark)",
                            border: "1px solid rgba(197, 162, 125, 0.12)",
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Process tab */}
              {activeTab === "process" && (
                <div style={{ animation: "fadeIn 0.35s ease" }}>
                  <div className="space-y-0">
                    {service.process.map((step, idx) => (
                      <div key={step.step} className="flex gap-4 relative">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))",
                              color: "#fff",
                              boxShadow: "0 4px 12px rgba(197, 162, 125, 0.3)",
                            }}
                          >
                            {idx + 1}
                          </div>
                          {idx < service.process.length - 1 && (
                            <div
                              className="w-px flex-grow my-1.5"
                              style={{ background: "rgba(197, 162, 125, 0.15)" }}
                            />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="pb-6 flex-grow">
                          <h5
                            className="text-[14px] font-bold text-charcoal mb-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {step.step}
                          </h5>
                          <p className="text-[12.5px] text-muted leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products tab */}
              {activeTab === "products" && (
                <div style={{ animation: "fadeIn 0.35s ease" }}>
                  <p className="text-[13px] text-muted leading-relaxed mb-5">
                    I use only premium, professional-grade products from trusted international
                    brands to ensure long-lasting, flawless results.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.products.map((prod, idx) => (
                      <div
                        key={prod}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                        style={{
                          background: "rgba(197, 162, 125, 0.04)",
                          border: "1px solid rgba(197, 162, 125, 0.08)",
                          animation: `fadeIn 0.3s ease ${idx * 0.05}s both`,
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: "rgba(197, 162, 125, 0.08)",
                            border: "1px solid rgba(197, 162, 125, 0.12)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-gold)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                        </div>
                        <span className="text-[12px] font-semibold text-charcoal">{prod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div
              className="mt-6 pt-5 flex flex-col sm:flex-row gap-3"
              style={{ borderTop: "1px solid rgba(197, 162, 125, 0.1)" }}
            >
              <a
                href="#contact"
                className="btn-primary flex-1 text-center"
                onClick={onClose}
                style={{ fontSize: "12px", padding: "13px 24px" }}
              >
                Book This Service
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center"
                style={{ fontSize: "12px", padding: "13px 24px" }}
              >
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
