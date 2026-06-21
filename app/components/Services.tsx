"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { mainServices, ServiceItem } from "../data/services";
import ServiceModal from "./ServiceModal";
import { collection, getDocs } from "firebase/firestore";
import { db, isConfigured } from "../lib/firebase";

export default function Services() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, hasDragged: false });
  const [servicesList, setServicesList] = useState<ServiceItem[]>(mainServices);

  useEffect(() => {
    if (!isConfigured) return;
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const fetchedServices: ServiceItem[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedServices.push(docSnap.data() as ServiceItem);
        });
        if (fetchedServices.length > 0) {
          setServicesList(fetchedServices);
        }
      } catch (error) {
        console.error("Error fetching services: ", error);
      }
    };
    fetchServices();
  }, []);

  /* ── Track active dot on scroll ────────────── */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth
      : 1;
    const gap = 32;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, servicesList.length - 1));
  }, [servicesList]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Dot click → scroll to card ────────────── */
  const scrollToCard = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - 48, behavior: "smooth" });
    }
  };

  /* ── Arrow navigation ──────────────────────── */
  const scrollBy = (dir: number) => {
    const next = Math.max(0, Math.min(activeIndex + dir, servicesList.length - 1));
    scrollToCard(next);
  };

  /* ── Desktop drag-to-scroll ────────────────── */
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = { startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, hasDragged: false };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > 5) {
      dragState.current.hasDragged = true;
    }
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const onMouseUp = () => setIsDragging(false);

  /* ── Lock/unlock body scroll when modal is open ── */
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedService]);

  return (
    <>
      <section
        id="services"
        className="pt-24 pb-24 md:pt-40 md:pb-40 relative"
        style={{
          background: "#FAF7F2",
          borderTop: "1px solid rgba(197, 162, 125, 0.08)",
          borderBottom: "1px solid rgba(197, 162, 125, 0.08)",
        }}
      >
        <div className="wrap">
          {/* Section header */}
          <div className="mb-14 md:mb-20 reveal" style={{ textAlign: "center" }}>
            <span className="section-subtitle" style={{ textAlign: "center", display: "block" }}>What I offer</span>
            <h2 className="section-title mb-4" style={{ textAlign: "center" }}>Services &amp; Packages</h2>
            <div
              className="section-ornament"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "16px",
              }}
            />
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.85,
                color: "var(--color-muted)",
                maxWidth: "520px",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "20px",
              }}
            >
              From intimate mehendi mornings to grand wedding receptions — every
              look is crafted with care, precision, and the finest products.
            </p>
          </div>
        </div>

        {/* ── Horizontal scroll track ────────────── */}
        <div style={{ position: "relative" }}>
          {/* Gradient overlays to prevent arrows overlapping text/images */}
          <div
            className="hidden md:block absolute top-0 left-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, #FAF7F2 15%, rgba(250, 247, 242, 0))",
            }}
          />
          <div
            className="hidden md:block absolute top-0 right-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, #FAF7F2 15%, rgba(250, 247, 242, 0))",
            }}
          />

          {/* Arrow buttons — desktop only */}
          <button
            aria-label="Previous service"
            onClick={() => scrollBy(-1)}
            className="hidden md:flex"
            style={{
              position: "absolute",
              top: "50%",
              left: "max(12px, calc((100% - 1200px) / 2 - 8px))",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid rgba(184,149,106,0.2)",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transition: "all 0.3s ease",
              opacity: activeIndex === 0 ? 0.35 : 1,
              pointerEvents: activeIndex === 0 ? "none" : "auto",
            }}
          >
            <ChevronLeftIcon size={18} stroke="var(--color-charcoal)" />
          </button>

          <button
            aria-label="Next service"
            onClick={() => scrollBy(1)}
            className="hidden md:flex"
            style={{
              position: "absolute",
              top: "50%",
              right: "max(12px, calc((100% - 1200px) / 2 - 8px))",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid rgba(184,149,106,0.2)",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transition: "all 0.3s ease",
              opacity: activeIndex === servicesList.length - 1 ? 0.35 : 1,
              pointerEvents: activeIndex === servicesList.length - 1 ? "none" : "auto",
            }}
          >
            <ChevronRightIcon size={18} stroke="var(--color-charcoal)" />
          </button>

          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="services-scroll-track reveal"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: isDragging ? "none" : "auto",
            }}
          >
            {servicesList.map((s, i) => (
              <div
                key={s.title}
                style={{
                  flex: "0 0 min(370px, 86vw)",
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="card-premium rounded-3xl overflow-hidden flex flex-col flex-1 cursor-pointer"
                  onClick={() => {
                    /* Only open modal if user didn't drag */
                    if (!dragState.current.hasDragged) {
                      setSelectedService(s);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${s.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedService(s);
                    }
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative w-full overflow-hidden bg-cream h-[200px] md:h-[240px]"
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 86vw, 370px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent)",
                      }}
                    />
                    {s.tag && (
                      <span
                        className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full z-10"
                        style={{
                          background: "rgba(255, 255, 255, 0.92)",
                          color: "var(--color-gold-dark)",
                          border: "1px solid rgba(197, 162, 125, 0.25)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {s.tag}
                      </span>
                    )}

                    {/* Card number indicator */}
                    <span
                      className="absolute bottom-4 right-4 text-[10px] font-bold tracking-widest z-10"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-7 flex-grow flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-accent mb-1.5 block">
                      {s.subtitle}
                    </span>
                    <h3
                      className="font-semibold text-charcoal mb-3"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "21px",
                        lineHeight: 1.25,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-muted mb-4 leading-relaxed"
                      style={{ fontSize: "13px" }}
                    >
                      {s.desc}
                    </p>

                    <div
                      className="w-8 h-px mb-4"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-gold), transparent)",
                      }}
                    />

                    <ul className="space-y-2.5 mb-6">
                      {s.inclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs text-muted leading-relaxed"
                        >
                          <CheckIcon />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* View Details CTA (replaces "Inquire Now") */}
                    <span
                      className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase transition-colors duration-300 mt-auto group px-1 py-0.5"
                      style={{ color: "var(--color-gold)" }}
                    >
                      View Details
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pagination dots ──────────────────────── */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {servicesList.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to service ${i + 1}`}
              onClick={() => scrollToCard(i)}
              style={{
                width: activeIndex === i ? 28 : 8,
                height: 8,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                background:
                  activeIndex === i
                    ? "linear-gradient(90deg, var(--color-gold), var(--color-gold-dark))"
                    : "rgba(197, 162, 125, 0.2)",
              }}
            />
          ))}
        </div>

        {/* Bottom CTA block removed to avoid redundancy with the individual service cards */}
      </section>

      {/* ── Service Detail Modal ────────────── */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
