"use client";

import { useEffect } from "react";

export function useRevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04 } // Safe low threshold to guarantee trigger on all viewport sizes
    );

    const observeElements = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        observer.observe(el);
      });
    };

    observeElements();

    // Watch for dynamically added components or list updates (e.g. Portfolio filtering)
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldObserve = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains("reveal") && !node.classList.contains("visible")) {
              shouldObserve = true;
            }
            if (node.querySelector(".reveal")) {
              shouldObserve = true;
            }
          }
        });
      });

      if (shouldObserve) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
