import { PhoneIcon, MailIcon, MapPinIcon } from "./Icons";

export default function ContactDetails({ content }: { content?: any }) {
  const phoneVal = content?.phone || "+91 98765 43210";
  const whatsappUrl = `https://wa.me/${content?.whatsappNumber ? content.whatsappNumber.replace(/\D/g, "") : "919876543210"}`;
  const emailVal = content?.email || "rupalishinde.mua@gmail.com";
  const addressVal = content?.address || "Ahilyanagar, Maharashtra";

  return (
    <div className="reveal">
      <span className="section-subtitle" style={{ fontSize: "18px" }}>Get in touch</span>
      <h2 className="section-title mb-3">
        Let&apos;s create your
        <br />
        perfect look
      </h2>
      <div className="section-ornament mb-8" />
      <p
        className="text-muted mb-12"
        style={{ fontSize: "15px", lineHeight: 1.9, maxWidth: "460px" }}
      >
        Reach out for bookings, trials, or just to chat about your vision.
        I&apos;d love to hear from you and help make your special day
        unforgettable.
      </p>

      {/* Contact details cards */}
      <div className="space-y-4">
        
        {/* Phone Card */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          style={{ textDecoration: "none" }}
        >
          <div
            className="card-premium contact-info-card flex items-center gap-3.5 sm:gap-5 transition-all duration-400"
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{
                background: "var(--color-gold-light)",
                border: "1px solid rgba(197, 162, 125, 0.18)",
              }}
            >
              <PhoneIcon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" stroke="var(--color-accent)" />
            </div>
            <div>
              <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase text-accent mb-0.5 sm:mb-1">
                Phone / WhatsApp
              </span>
              <span className="text-[13.5px] sm:text-[15px] font-semibold text-charcoal block break-all sm:break-normal">
                {phoneVal}
              </span>
            </div>
          </div>
        </a>

        {/* Email Card */}
        <a
          href={`mailto:${emailVal}`}
          className="group block"
          style={{ textDecoration: "none" }}
        >
          <div
            className="card-premium contact-info-card flex items-center gap-3.5 sm:gap-5 transition-all duration-400"
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{
                background: "var(--color-gold-light)",
                border: "1px solid rgba(197, 162, 125, 0.18)",
              }}
            >
              <MailIcon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" stroke="var(--color-accent)" />
            </div>
            <div>
              <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase text-accent mb-0.5 sm:mb-1">
                Email
              </span>
              <span className="text-[13.5px] sm:text-[15px] font-semibold text-charcoal block break-all sm:break-normal">
                {emailVal}
              </span>
            </div>
          </div>
        </a>

        {/* Location Card */}
        <div
          className="card-premium contact-info-card flex items-center gap-3.5 sm:gap-5 transition-all duration-400"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "var(--color-gold-light)",
              border: "1px solid rgba(197, 162, 125, 0.18)",
            }}
          >
            <MapPinIcon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" stroke="var(--color-accent)" />
          </div>
          <div>
            <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase text-accent mb-0.5 sm:mb-1">
              Location
            </span>
            <span className="text-[13.5px] sm:text-[15px] font-semibold text-charcoal block break-all sm:break-normal">
              {addressVal}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
