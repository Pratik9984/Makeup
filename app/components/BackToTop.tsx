"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "./Icons";

export default function BackToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const update = () => {
      // Toggle visibility
      btn.classList.toggle("show", window.scrollY > 400);

      // Calculate scroll progress (0 to 1)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // SVG circle progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <button
      id="backToTop"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      {/* Progress ring */}
      <svg
        viewBox="0 0 48 48"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: "rotate(-90deg)",
        }}
      >
        {/* Background ring */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
        />
        {/* Progress ring */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-circle"
        />
      </svg>

      {/* Arrow icon */}
      <ChevronUpIcon
        size={16}
        style={{ position: "relative", zIndex: 1 }}
      />
    </button>
  );
}
