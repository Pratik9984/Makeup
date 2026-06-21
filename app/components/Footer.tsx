import {
  InstagramIcon,
  WhatsappIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
} from "./Icons";

export default function Footer({ content }: { content?: any }) {
  const contact = content?.contact || {
    phone: "+91 98765 43210",
    email: "rupalishinde.mua@gmail.com",
    address: "Ahilyanagar, Maharashtra, India",
    whatsappNumber: "919876543210",
    instagram: "https://instagram.com/rupalishinde.mua",
    facebook: "https://facebook.com/"
  };

  const whatsappUrl = `https://wa.me/${contact.whatsappNumber ? contact.whatsappNumber.replace(/\D/g, "") : "919876543210"}`;

  return (
    <footer className="site-footer">
      <div className="wrap">
        {/* Main Footer Grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-12 pb-10 md:pb-16"
          style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          {/* Column 1: Brand Info */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-3 md:gap-4">
            <div>
              <a
                href="#hero"
                className="text-xl tracking-tight flex items-center gap-1"
                style={{
                  fontFamily: "var(--font-display)",
                  textDecoration: "none",
                  color: "var(--color-charcoal)",
                }}
              >
                <span style={{ fontWeight: 600 }}>Rupali</span>
                <span style={{ color: "var(--color-gold)", fontSize: "8px", opacity: 0.5 }}>✦</span>
                <span style={{ color: "var(--color-gold)", fontWeight: 400 }}>
                  {" "}Shinde
                </span>
              </a>
            </div>

            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "280px",
              }}
            >
              Professional Makeup Artist based in Ahilyanagar, Maharashtra.
              Specializing in high-end bridal transformations, luxury event
              makeup, and creative fashion editorials.
            </p>

            {/* Tagline */}
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontStyle: "italic",
                fontSize: "13px",
                color: "var(--color-gold)",
                opacity: 0.8,
              }}
            >
              &ldquo;Where beauty meets artistry&rdquo;
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                {
                  name: "Instagram",
                  href: contact.instagram || "https://instagram.com/rupalishinde.mua",
                  icon: <InstagramIcon size={14} />,
                },
                {
                  name: "WhatsApp",
                  href: whatsappUrl,
                  icon: <WhatsappIcon size={14} />,
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    color: "var(--color-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-gold)";
                    e.currentTarget.style.borderColor = "var(--color-gold)";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(197, 162, 125, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
                    e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1 flex flex-col gap-3 md:gap-5 md:pl-8">
            <h4
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              Explore
            </h4>
            <div className="flex flex-col gap-1 md:gap-3.5">
              {[
                { label: "Home", href: "#hero" },
                { label: "About Me", href: "#about" },
                { label: "Our Services", href: "#services" },
                { label: "Selected Work", href: "#portfolio" },
                { label: "Client Reviews", href: "#reviews" },
                { label: "Book Appointment", href: "#contact" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[12px] font-medium transition-all duration-300 py-1.5 md:py-0"
                  style={{
                    textDecoration: "none",
                    color: "var(--color-muted)",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-gold)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="col-span-1 flex flex-col gap-3 md:gap-5">
            <h4
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              Services
            </h4>
            <div className="flex flex-col gap-1 md:gap-3.5">
              {[
                "Bridal Makeup",
                "Airbrush Makeup",
                "Party & Festive Glam",
              ].map((s) => (
                <a
                  key={s}
                  href="#services"
                  className="text-[12px] font-medium transition-all duration-300 py-1.5 md:py-0"
                  style={{
                    textDecoration: "none",
                    color: "var(--color-muted)",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-gold)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Details */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-col gap-3 md:gap-5">
            <h4
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              Contact Details
            </h4>
            <div className="flex flex-col gap-2 md:gap-5">
              {/* Phone */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 transition-colors duration-300 py-1.5 md:py-0"
                style={{ textDecoration: "none", color: "var(--color-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
              >
                <PhoneIcon size={13} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span className="text-[12px] font-medium leading-relaxed">{contact.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-3.5 transition-colors duration-300 py-1.5 md:py-0"
                style={{ textDecoration: "none", color: "var(--color-muted)", wordBreak: "break-all" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
              >
                <MailIcon size={13} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span className="text-[12px] font-medium leading-relaxed">{contact.email}</span>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3.5 py-1.5 md:py-0" style={{ color: "var(--color-muted)" }}>
                <MapPinIcon size={13} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span className="text-[12px] font-medium leading-relaxed">{contact.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 md:pt-8"
          style={{ color: "var(--color-muted)", opacity: 0.8 }}
        >
          <p className="text-[10px] md:text-[11px]">
            © 2026 Rupali Shinde Makeup Artist. Crafted with{" "}
            <span style={{ color: "var(--color-gold)" }}>♥</span>{" "}
            All rights reserved.
          </p>
          {/* Terms & Conditions / Privacy Policy links removed until real pages exist */}
        </div>
      </div>
    </footer>
  );
}
