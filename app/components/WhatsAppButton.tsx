"use client";

export default function WhatsAppButton({ content }: { content?: any }) {
  const phone = content?.whatsappNumber ? content.whatsappNumber.replace(/\D/g, "") : "919876543210";
  const url = `https://wa.me/${phone}?text=Hi%20Rupali!%20I%E2%80%99d%20like%20to%20know%20more%20about%20your%20makeup%20services.`;

  return (
    <a
      id="whatsappButton"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: 84,
        right: 28,
        zIndex: 9999,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(197, 162, 125, 0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        textDecoration: "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = "rgba(197, 162, 125, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.06)";
        e.currentTarget.style.borderColor = "rgba(197, 162, 125, 0.18)";
      }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 20, height: 20 }}
      >
        <path
          d="M16.004 2.002C8.28 2.002 2.004 8.278 2.004 16.002c0 2.474.646 4.89 1.876 7.024L2 30l7.168-1.88A13.947 13.947 0 0 0 16.004 30c7.724 0 13.998-6.276 13.998-14S23.728 2.002 16.004 2.002Zm0 25.58a11.55 11.55 0 0 1-5.896-1.614l-.422-.252-4.374 1.148 1.168-4.266-.276-.44a11.543 11.543 0 0 1-1.77-6.156c0-6.39 5.2-11.588 11.59-11.588 6.39 0 11.578 5.198 11.578 11.588 0 6.39-5.2 11.58-11.598 11.58Z"
          fill="#6b8f71"
        />
        <path
          d="M23.338 19.174c-.39-.196-2.312-1.14-2.67-1.272-.36-.13-.622-.196-.884.196-.26.392-1.016 1.272-1.246 1.534-.23.262-.46.294-.852.098-.39-.196-1.65-.608-3.142-1.938-1.162-1.036-1.946-2.314-2.176-2.706-.228-.392-.024-.604.172-.798.178-.176.392-.458.588-.688.196-.23.262-.392.392-.654.132-.262.066-.49-.032-.688-.098-.196-.884-2.132-1.212-2.918-.32-.766-.644-.662-.884-.674-.228-.012-.49-.014-.752-.014s-.688.098-1.048.49c-.36.392-1.374 1.342-1.374 3.272 0 1.932 1.406 3.798 1.602 4.06.196.262 2.768 4.224 6.706 5.922.938.404 1.67.646 2.24.826.942.3 1.8.258 2.478.156.756-.112 2.312-.944 2.638-1.856.326-.914.326-1.696.228-1.858-.098-.164-.36-.262-.752-.458Z"
          fill="#6b8f71"
        />
      </svg>
    </a>
  );
}

