"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { items, filters, PortfolioItem } from "../data/portfolio";
import PortfolioModal from "./PortfolioModal";
import { collection, getDocs } from "firebase/firestore";
import { db, isConfigured } from "../lib/firebase";

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(items);

  useEffect(() => {
    if (!isConfigured) return;
    const fetchPortfolio = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const fetchedItems: PortfolioItem[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedItems.push(docSnap.data() as PortfolioItem);
        });
        if (fetchedItems.length > 0) {
          setPortfolioList(fetchedItems);
        }
      } catch (error) {
        console.error("Error fetching portfolio: ", error);
      }
    };
    fetchPortfolio();
  }, []);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const filterScrollRef = useRef<HTMLDivElement>(null);

  const handleFilterScroll = () => {
    const el = filterScrollRef.current;
    if (el) {
      setShowLeftFade(el.scrollLeft > 5);
      const maxScroll = el.scrollWidth - el.clientWidth;
      setShowRightFade(el.scrollLeft < maxScroll - 5);
    }
  };

  useEffect(() => {
    const el = filterScrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setShowRightFade(maxScroll > 5 && el.scrollLeft < maxScroll - 5);
      setShowLeftFade(el.scrollLeft > 5);
    };

    // Run initial check after a brief timeout to let layout settle
    const timer = setTimeout(checkScroll, 100);

    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });

  const filtered =
    active === "all" ? portfolioList : portfolioList.filter((i) => i.cat === active);

  /* ── Reset scroll on filter change ────────── */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }
    setActiveIndex(0);
  }, [active]);

  /* ── Track active dot on scroll ────────────── */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 1;
    const gap = 24;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, filtered.length - 1));
  }, [filtered.length]);

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
    const next = Math.max(0, Math.min(activeIndex + dir, filtered.length - 1));
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
    <>
      <section
        id="portfolio"
        className="pt-24 pb-24 md:pt-40 md:pb-40"
        style={{ background: "#ffffff" }}
      >
        <div className="wrap">
          {/* Header */}
          <div className="reveal mb-14 md:mb-20" style={{ textAlign: "center" }}>
            <span className="section-subtitle" style={{ display: "block", textAlign: "center" }}>Selected work</span>
            <h2 className="section-title">My latest looks</h2>
            <div
              className="section-ornament"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "16px",
              }}
            />
          </div>

          {/* Minimal Segmented Filter Container */}
          <div className="relative w-full mb-16 md:mb-20 reveal" style={{ zIndex: 10 }}>
            {showLeftFade && (
              <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#ffffff] to-transparent z-10 pointer-events-none" />
            )}
            {showRightFade && (
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#ffffff] to-transparent z-10 pointer-events-none" />
            )}

            <div
              ref={filterScrollRef}
              onScroll={handleFilterScroll}
              className="overflow-x-auto scrollbar-none px-8 pb-2 max-w-full"
              style={{
                display: "block",
                textAlign: "center",
              }}
            >
              <div
                className="inline-flex items-center p-1 gap-1.5"
                style={{
                  borderRadius: "9999px",
                  border: "1px solid rgba(197, 162, 125, 0.15)",
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
                }}
              >
                {filters.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setActive(f)}
                    className="filter-pill relative px-6 text-[10px] font-bold tracking-[0.18em] uppercase cursor-pointer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "38px",
                      borderRadius: "9999px",
                      background: active === f ? "var(--color-charcoal)" : "transparent",
                      color: active === f ? "#ffffff" : "var(--color-muted)",
                      border: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (active !== f) {
                        e.currentTarget.style.color = "var(--color-charcoal)";
                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (active !== f) {
                        e.currentTarget.style.color = "var(--color-muted)";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Horizontal scroll track ────────────── */}
        <div style={{ position: "relative" }}>
          {/* Gradient overlays to prevent arrows overlapping text/images */}
          <div
            className="hidden md:block absolute top-0 left-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, #ffffff 15%, rgba(255, 255, 255, 0))",
            }}
          />
          <div
            className="hidden md:block absolute top-0 right-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, #ffffff 15%, rgba(255, 255, 255, 0))",
            }}
          />

          {/* Arrow buttons — desktop only */}
          {filtered.length > 1 && (
            <>
              <button
                aria-label="Previous portfolio item"
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
                aria-label="Next portfolio item"
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
                  opacity: activeIndex === filtered.length - 1 ? 0.35 : 1,
                  pointerEvents: activeIndex === filtered.length - 1 ? "none" : "auto",
                }}
              >
                <ChevronRightIcon size={18} stroke="var(--color-charcoal)" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="portfolio-scroll-track reveal"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: isDragging ? "none" : "auto",
            }}
          >
            {filtered.map((item, i) => (
              <div
                key={item.title}
                style={{
                  flex: "0 0 min(330px, 75vw)",
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="card-premium rounded-3xl overflow-hidden flex flex-col flex-grow group cursor-pointer animate-fade-in"
                  onClick={() => setSelected(item)}
                >
                  <div
                    className="relative overflow-hidden bg-cream"
                    style={{ height: "340px" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 75vw, 330px"
                      className="object-cover transition-transform duration-600 group-hover:scale-[1.06]"
                    />
                    {/* Gradient overlay on hover */}
                    <div
                      className="absolute inset-0 transition-all duration-400 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(to top, rgba(26, 24, 21, 0.6), transparent 60%)",
                      }}
                    >
                      <span className="text-white text-[10px] font-bold tracking-[0.16em] uppercase transform translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                        View Look
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-5 flex-grow flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-6 h-px"
                        style={{ background: "var(--color-gold)" }}
                      />
                      <span className="text-[10px] text-muted capitalize tracking-[0.12em] font-bold uppercase">
                        {item.cat}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-foreground group-hover:text-gold transition-colors duration-300 block">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pagination dots ──────────────────────── */}
        {filtered.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {filtered.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to item ${i + 1}`}
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
        )}
      </section>

      {/* Lightbox */}
      {selected && (
        <PortfolioModal
          selected={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
