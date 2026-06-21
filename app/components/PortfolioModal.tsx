import { useState } from "react";
import Image from "next/image";
import { PortfolioItem } from "../data/portfolio";
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  SparklesIcon,
  PlayIcon,
} from "./Icons";

type PortfolioModalProps = {
  selected: PortfolioItem;
  onClose: () => void;
};

export default function PortfolioModal({ selected, onClose }: PortfolioModalProps) {
  // Build list of all media items (video first, then images)
  const mediaList: { type: "image" | "video"; url: string }[] = [];
  
  if (selected.video) {
    mediaList.push({ type: "video", url: selected.video });
  }
  
  const images = selected.images || [selected.image];
  images.forEach((img) => {
    mediaList.push({ type: "image", url: img });
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const activeMedia = mediaList[activeIndex];
  const details = selected.details;

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
        className="bg-white rounded-3xl max-w-4xl w-full relative overflow-y-auto"
        style={{
          maxHeight: "calc(100vh - 80px)",
          animation: "fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid rgba(197, 162, 125, 0.12)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(197, 162, 125, 0.03)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
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

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Media Viewer */}
          <div className="p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 bg-cream/30">
            <div>
              {/* Main Display Box */}
              <div 
                className="w-full relative overflow-hidden bg-black rounded-2xl flex items-center justify-center"
                style={{ height: "360px" }}
              >
                {activeMedia.type === "video" ? (
                  <video
                    key={activeMedia.url}
                    src={activeMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={activeMedia.url}
                    alt={selected.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover"
                  />
                )}

                {/* Left/Right Navigation Chevrons (only show if multiple media exists) */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md z-10"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Media Index Counter */}
              {mediaList.length > 1 && (
                <div className="text-center text-[10px] text-muted font-bold tracking-[0.15em] mt-3">
                  {activeIndex + 1} / {mediaList.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation List */}
            {mediaList.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none pt-4 pb-1 mt-4">
                {mediaList.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 border-2"
                    style={{
                      borderColor: activeIndex === idx ? "var(--color-gold)" : "transparent",
                      boxShadow: activeIndex === idx ? "0 4px 10px rgba(197, 162, 125, 0.2)" : "none",
                      opacity: activeIndex === idx ? 1 : 0.6,
                    }}
                  >
                    {media.type === "video" ? (
                      <div className="w-full h-full relative bg-charcoal/90 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" />
                        {selected.image ? (
                          <Image
                            src={selected.image}
                            alt="Video thumbnail background"
                            fill
                            sizes="64px"
                            className="object-cover opacity-60"
                          />
                        ) : null}
                        <div className="absolute z-10 text-white w-6 h-6 rounded-full bg-gold flex items-center justify-center shadow-md">
                          <PlayIcon size={10} style={{ marginLeft: "1px" }} />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={media.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Detailed Project Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category tag */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px" style={{ background: "var(--color-gold)" }} />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gold">
                  {selected.cat}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-bold mb-4 text-charcoal leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selected.title}
              </h3>

              {/* Description */}
              <p
                className="text-[13.5px] text-muted mb-6 leading-relaxed"
                style={{ lineHeight: 1.85 }}
              >
                {selected.desc}
              </p>

              {/* Details Metagrid */}
              {details && (
                <div className="border-t border-b border-gray-100 py-5 mb-6">
                  <h4 className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-gold mb-3.5">
                    Project Details
                  </h4>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
                    {details.client && (
                      <div className="flex items-center gap-2.5">
                        <UserIcon size={13} className="text-accent" />
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted/65 tracking-wider leading-none mb-0.5">Client</span>
                          <span className="text-[11.5px] font-semibold text-charcoal">{details.client}</span>
                        </div>
                      </div>
                    )}
                    {details.date && (
                      <div className="flex items-center gap-2.5">
                        <CalendarIcon size={13} className="text-accent" />
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted/65 tracking-wider leading-none mb-0.5">Date</span>
                          <span className="text-[11.5px] font-semibold text-charcoal">{details.date}</span>
                        </div>
                      </div>
                    )}
                    {details.location && (
                      <div className="flex items-center gap-2.5">
                        <MapPinIcon size={13} className="text-accent" />
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted/65 tracking-wider leading-none mb-0.5">Location</span>
                          <span className="text-[11.5px] font-semibold text-charcoal">{details.location}</span>
                        </div>
                      </div>
                    )}
                    {details.role && (
                      <div className="flex items-center gap-2.5">
                        <SparklesIcon size={13} className="text-accent" />
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted/65 tracking-wider leading-none mb-0.5">Role</span>
                          <span className="text-[11.5px] font-semibold text-charcoal">{details.role}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Products Used */}
              {details?.products && details.products.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-gold mb-2.5">
                    Products Used
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {details.products.map((prod) => (
                      <span
                        key={prod}
                        className="text-[9.5px] font-semibold px-2.5 py-1 rounded bg-[#FAF7F2] text-muted border border-gray-100/50"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom tags */}
            <div className="flex gap-1.5 flex-wrap pt-4 border-t border-gray-50">
              {selected.tags.map((t) => (
                <span
                  key={t}
                  className="text-[9.5px] font-bold px-3.5 py-1.5 rounded-full bg-gold-light text-gold-dark tracking-wide uppercase"
                  style={{ border: "1px solid rgba(197, 162, 125, 0.12)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
