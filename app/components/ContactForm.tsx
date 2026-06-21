import { useState } from "react";
import {
  UserIcon,
  PhoneIcon,
  Sparkle4Icon,
  CalendarIcon,
  MessageSquareIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  CheckIcon,
  WhatsappIcon,
} from "./Icons";

export default function ContactForm({ whatsappNumber }: { whatsappNumber?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    occasion: "",
    date: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getWhatsappUrl = () => {
    const text = `Hi Rupali Shinde,

I would like to book a makeup session! Here are my details:
• Name: ${formData.name}
• Phone: ${formData.phone}
• Occasion: ${formData.occasion}
• Date: ${formatDate(formData.date)}
• Message: ${formData.message || "None"}

Please let me know if you are available!`;
    const targetNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, "") : "919876543210";
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const inputGroupStyle = (field: string) => {
    const isFocused = focusedField === field;
    return {
      display: "flex",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#ffffff",
      border: isFocused ? "1px solid var(--color-gold)" : "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "14px",
      padding: "16px 20px",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow: isFocused ? "0 0 0 4px rgba(197, 162, 125, 0.12)" : "none",
    };
  };

  const labelStyle = (field: string) => {
    const isFocused = focusedField === field;
    return {
      display: "block",
      fontFamily: "var(--font-accent)",
      fontStyle: "italic",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: "0.03em",
      color: isFocused ? "var(--color-accent-dark)" : "var(--color-muted)",
      marginBottom: "8px",
      transition: "color 0.3s ease",
    };
  };

  const iconStroke = (field: string) =>
    focusedField === field ? "var(--color-accent)" : "#A09A93";

  return (
    <div
      className="reveal contact-form-card"
      style={{
        transitionDelay: "100ms",
      }}
    >
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <h3
            className="text-2xl font-semibold mb-2 text-charcoal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Book a session
          </h3>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            Fill in your details below. I will contact you to discuss details and secure your booking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* Full Name */}
            <div>
              <label style={labelStyle("name")}>Full Name</label>
              <div style={inputGroupStyle("name")}>
                <UserIcon
                  stroke={iconStroke("name")}
                  style={{ marginRight: "12px", flexShrink: 0, transition: "stroke 0.3s" }}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={{
                    flex: 1,
                    width: "100%",
                    minWidth: "0",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "var(--color-foreground)",
                    outline: "none",
                    padding: 0,
                  }}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle("phone")}>Phone / WhatsApp</label>
              <div style={inputGroupStyle("phone")}>
                <PhoneIcon
                  stroke={iconStroke("phone")}
                  style={{ marginRight: "12px", flexShrink: 0, transition: "stroke 0.3s" }}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 ..."
                  required
                  style={{
                    flex: 1,
                    width: "100%",
                    minWidth: "0",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "var(--color-foreground)",
                    outline: "none",
                    padding: 0,
                  }}
                  onFocus={() => handleFocus("phone")}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* Occasion */}
            <div>
              <label style={labelStyle("occasion")}>Occasion</label>
              <div style={inputGroupStyle("occasion")}>
                <Sparkle4Icon
                  stroke={iconStroke("occasion")}
                  style={{ marginRight: "12px", flexShrink: 0, transition: "stroke 0.3s" }}
                />
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    width: "100%",
                    minWidth: "0",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: formData.occasion === "" ? "var(--color-muted)" : "var(--color-foreground)",
                    outline: "none",
                    padding: 0,
                    cursor: "pointer",
                    appearance: "none",
                    marginRight: "8px",
                  }}
                  onFocus={() => handleFocus("occasion")}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>Select occasion</option>
                  <option value="Bridal (Full Day)">Bridal (Full Day)</option>
                  <option value="Engagement Ceremony">Engagement Ceremony</option>
                  <option value="Sangeet / Mehendi">Sangeet / Mehendi</option>
                  <option value="Reception Night">Reception Night</option>
                  <option value="Party / Event">Party / Event</option>
                  <option value="Editorial / Shoot">Editorial / Shoot</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDownIcon
                  stroke="#A09A93"
                  style={{ marginLeft: "auto", pointerEvents: "none" }}
                />
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label style={labelStyle("date")}>Event Date</label>
              <div style={inputGroupStyle("date")}>
                <CalendarIcon
                  stroke={iconStroke("date")}
                  style={{ marginRight: "12px", flexShrink: 0, transition: "stroke 0.3s" }}
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    width: "100%",
                    minWidth: "0",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "var(--color-foreground)",
                    outline: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  onFocus={() => handleFocus("date")}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-10">
            <label style={labelStyle("message")}>Message</label>
            <div style={{ ...inputGroupStyle("message"), alignItems: "flex-start" }}>
              <MessageSquareIcon
                stroke={iconStroke("message")}
                style={{ marginRight: "12px", marginTop: "4px", flexShrink: 0, transition: "stroke 0.3s" }}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell me about your preferred look, styling references, wedding venue..."
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: "0",
                  border: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "var(--color-foreground)",
                  outline: "none",
                  padding: 0,
                  resize: "vertical",
                  minHeight: "80px",
                  lineHeight: "1.6",
                }}
                onFocus={() => handleFocus("message")}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer group"
            style={{
              padding: "16px 32px",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "9999px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))",
              color: "#fff",
              border: "none",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 4px 16px rgba(197, 162, 125, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(197, 162, 125, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(197, 162, 125, 0.15)";
            }}
          >
            Send Booking Request
            <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>
      ) : (
        <div className="text-center py-6">
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(197, 162, 125, 0.06)",
              border: "2px solid var(--color-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <CheckIcon size={28} />
          </div>
          <h3
            className="text-2xl font-semibold mb-2 text-charcoal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Request Received!
          </h3>
          <p
            className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6"
          >
            Thank you for reaching out. Please click below to send your details via WhatsApp and secure your booking.
          </p>

          {/* Summary card */}
          <div
            style={{
              background: "#fafafa",
              border: "1.5px solid rgba(197, 162, 125, 0.12)",
              borderRadius: "18px",
              padding: "20px",
              textAlign: "left",
              maxWidth: "360px",
              margin: "0 auto 24px",
            }}
          >
            <span
              className="block text-[10px] font-bold tracking-[0.15em] uppercase text-accent mb-3 pb-2"
              style={{ borderBottom: "1px solid rgba(184, 149, 106, 0.12)" }}
            >
              Summary of details:
            </span>
            <div style={{ fontSize: "13px", color: "var(--color-charcoal)", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div><strong>Name:</strong> {formData.name}</div>
              <div><strong>Phone:</strong> {formData.phone}</div>
              <div><strong>Occasion:</strong> {formData.occasion}</div>
              <div><strong>Date:</strong> {formatDate(formData.date)}</div>
              {formData.message && (
                <div style={{ wordBreak: "break-word" }}><strong>Message:</strong> {formData.message}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-full cursor-pointer transition-all duration-300"
              style={{
                padding: "15px 28px",
                fontSize: "14px",
                fontWeight: 700,
                backgroundColor: "#25D366",
                color: "#fff",
                border: "none",
                letterSpacing: "0.02em",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 211, 102, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <WhatsappIcon size={18} />
              Continue to WhatsApp
            </a>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  phone: "",
                  occasion: "",
                  date: "",
                  message: "",
                });
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-muted)",
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              Edit details / Send another request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
