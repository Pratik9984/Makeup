"use client";

import { useState, useEffect } from "react";

export default function Navbar({ content }: { content?: any }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const sectionIds = ["hero", "services", "about", "expertise", "portfolio", "reviews", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#portfolio" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[92%] max-w-5xl rounded-full border backdrop-blur-xl ${
          scrolled
            ? "bg-white/96 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-gold/20"
            : "bg-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-gold/15"
        }`}
        style={{ padding: scrolled ? "10px 20px" : "16px 24px" }}
      >
        <div className="flex w-full items-center justify-between px-2 sm:px-4">
          {/* Logo */}
          <a
            href="#hero"
            className="text-xl tracking-tight flex items-center gap-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="font-semibold" style={{ color: "var(--color-charcoal)" }}>
              Rupali
            </span>
            <span
              className="text-[10px] font-light opacity-40 mx-0.5"
              style={{ color: "var(--color-gold)" }}
            >
              ✦
            </span>
            <span className="font-normal" style={{ color: "var(--color-gold)" }}>
              Shinde
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map((l) => {
              const isActive = activeSection === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 py-1"
                  style={{
                    color: isActive ? "var(--color-gold)" : "var(--color-muted)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--color-charcoal)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--color-muted)";
                  }}
                >
                  {l.label}
                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--color-gold)" }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {/* CTA Button */}
            <a
              href="#contact"
              className="hidden lg:inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full transition-all duration-400 cursor-pointer"
              style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))",
                color: "#fff",
                border: "none",
                boxShadow: "0 4px 16px rgba(197, 162, 125, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(197, 162, 125, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(197, 162, 125, 0.25)";
              }}
            >
              Book Now
            </a>

            {/* Hamburger */}
            <button
              className="flex lg:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <span
                className={`block w-5 h-[1.5px] rounded transition-all duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
                style={{ background: "var(--color-charcoal)" }}
              />
              <span
                className={`block w-5 h-[1.5px] rounded transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
                style={{ background: "var(--color-charcoal)" }}
              />
              <span
                className={`block w-5 h-[1.5px] rounded transition-all duration-300 ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
                style={{ background: "var(--color-charcoal)" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — Full screen overlay (moved outside nav container to fix containing block constraint) */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-8 invisible pointer-events-none"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 z-50 flex items-center justify-center bg-transparent border-none cursor-pointer"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-charcoal)" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-5 sm:gap-6">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="mobile-menu-link text-2xl font-medium transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                color: activeSection === l.href ? "var(--color-gold)" : "var(--color-charcoal)",
                animationDelay: open ? `${i * 60 + 100}ms` : "0ms",
                opacity: open ? undefined : 0,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mobile-menu-link mt-2 btn-primary !px-10 !py-3.5 !text-xs"
            style={{
              animationDelay: open ? `${links.length * 60 + 100}ms` : "0ms",
              opacity: open ? undefined : 0,
            }}
          >
            Book Now
          </a>
        </div>
      </div>
    </>
  );
}
