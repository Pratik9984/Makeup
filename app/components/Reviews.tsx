"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { GoogleIcon, Stars, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { testimonials, Testimonial } from "../data/testimonials";
import ReviewCard from "./ReviewCard";
import { collection, getDocs } from "firebase/firestore";
import { db, isConfigured } from "../lib/firebase";

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const [reviewsList, setReviewsList] = useState<Testimonial[]>(testimonials);

  useEffect(() => {
    if (!isConfigured) return;
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const fetchedReviews: Testimonial[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedReviews.push(docSnap.data() as Testimonial);
        });
        if (fetchedReviews.length > 0) {
          setReviewsList(fetchedReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };
    fetchReviews();
  }, []);

  /* ── Track active dot on scroll ────────────── */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 1;
    const gap = 28;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, reviewsList.length - 1));
  }, [reviewsList]);

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
    const next = Math.max(0, Math.min(activeIndex + dir, reviewsList.length - 1));
    scrollToCard(next);
  };

  /* ── Desktop drag-to-scroll ────────────────── */
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = { startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <section
      id="reviews"
      className="pt-24 pb-24 md:pt-40 md:pb-40 overflow-hidden"
      style={{
        background: "#FAF7F2",
        borderTop: "1px solid rgba(197, 162, 125, 0.08)",
        borderBottom: "1px solid rgba(197, 162, 125, 0.08)",
      }}
    >
      <div className="wrap">
        {/* Header */}
        <div className="reveal mb-10 md:mb-14" style={{ textAlign: "center" }}>
          <span className="section-subtitle" style={{ display: "block", textAlign: "center" }}>Kind words</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>What my brides say</h2>
          <div
            className="section-ornament"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "16px",
            }}
          />
        </div>

        {/* Google & Website Trust Banner */}
        <div className="reveal mb-12 md:mb-14 trust-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <div className="trust-banner-logo">
              <GoogleIcon />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
              <div
                className="text-[12px] sm:text-[13px] font-bold text-charcoal"
                style={{ lineHeight: 1.15, whiteSpace: "nowrap" }}
              >
                Client Reviews
              </div>
              <div>
                <span
                  className="text-[8px] sm:text-[9px] font-bold tracking-[0.06em] px-2 py-0.5 rounded-full"
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    display: "inline-block",
                  }}
                >
                  Verified
                </span>
              </div>
            </div>
          </div>
          <div className="trust-banner-divider" />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <span
              className="text-2xl sm:text-3xl font-light text-charcoal"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              5.0
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <Stars />
              <span
                className="text-[8px] sm:text-[9px] font-bold tracking-[0.08em] sm:tracking-[0.12em] block"
                style={{
                  color: "var(--color-muted)",
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                Google &amp; Web
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track */}
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
          aria-label="Previous review"
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
          aria-label="Next review"
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
            opacity: activeIndex === reviewsList.length - 1 ? 0.35 : 1,
            pointerEvents: activeIndex === reviewsList.length - 1 ? "none" : "auto",
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
          className="reviews-scroll-track reveal"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: isDragging ? "none" : "auto",
          }}
        >
          {reviewsList.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              style={{
                flex: "0 0 min(360px, 80vw)",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ReviewCard t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2.5 mt-8 reveal">
        {reviewsList.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to review ${i + 1}`}
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
    </section>
  );
}
