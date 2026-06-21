export interface ServiceItem {
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
  desc: string;
  inclusions: string[];
  /* Extended detail fields for the service modal */
  fullDescription: string;
  process: { step: string; detail: string }[];
  products: string[];
  gallery: string[];
  duration: string;
  idealFor: string[];
  startingAt?: string;
}

export const mainServices: ServiceItem[] = [
  {
    title: "Bridal Makeup",
    subtitle: "Signature Experience",
    image: "/portfolio_maharashtrian_bride.png",
    tag: "Most Popular",
    desc: "A complete, personalized bridal beauty journey designed to make you feel radiant and confident.",
    inclusions: [
      "Traditional or contemporary bridal makeup",
      "Premium false lashes & custom extensions",
      "Bridal hair styling & dupatta/saree draping",
      "Pre-wedding trial session & skin preparation consult",
    ],
    fullDescription:
      "Your wedding day deserves nothing short of perfection. My Signature Bridal Experience is a deeply personal, end-to-end beauty journey — from the initial consultation to the final touch-up before you walk down the aisle. I work with you to understand your outfit, jewellery, venue lighting, and personal style to craft a look that is uniquely yours. Whether you envision a traditional Maharashtrian nath-adorned bridal look or a modern, dewy-skin aesthetic, every detail is meticulously planned and executed with the finest products available.",
    process: [
      {
        step: "Consultation",
        detail:
          "We discuss your vision, outfit details, jewellery, venue lighting, and skin concerns to create a personalized beauty plan.",
      },
      {
        step: "Trial Session",
        detail:
          "A full trial run 2–4 weeks before the wedding day, so you can see and refine the final look in advance.",
      },
      {
        step: "Skin Preparation",
        detail:
          "A tailored pre-wedding skincare regimen recommendation to ensure your skin is at its best on the big day.",
      },
      {
        step: "Wedding Day",
        detail:
          "On-site arrival 3–4 hours before the ceremony. Flawless application, hair styling, draping, and final touch-ups.",
      },
    ],
    products: [
      "MAC Studio Fix",
      "Charlotte Tilbury Flawless Filter",
      "NARS Radiant Creamy Concealer",
      "Huda Beauty Lashes",
      "Bobbi Brown Luxe Lipstick",
      "Urban Decay All Nighter Setting Spray",
    ],
    gallery: [
      "/portfolio_maharashtrian_bride.png",
      "/portfolio_fusion_bride.png",
      "/portfolio_reception_glam.png",
    ],
    duration: "3–4 hours",
    idealFor: [
      "Hindu & Maharashtrian weddings",
      "Christian ceremonies",
      "Court & intimate weddings",
      "Destination weddings",
    ],
    startingAt: "₹15,000",
  },
  {
    title: "Airbrush Makeup",
    subtitle: "Flawless HD Finish",
    image: "/portfolio_fusion_bride.png",
    tag: "Flawless HD",
    desc: "A premium, weightless silicone-based formulation sprayed on for an ultra-fine, flawless finish.",
    inclusions: [
      "12+ Hour transfer-resistant long-wear formula",
      "Perfect for 4K/8K photography & video lighting",
      "Dewy or matte skin finish adjusted to skin type",
      "Includes lash application & basic hair setting",
    ],
    fullDescription:
      "Airbrush makeup uses a specialized compressor to mist ultra-fine, silicone-based pigment onto your skin in thin, buildable layers. The result is a poreless, second-skin finish that is virtually invisible to HD cameras and lasts 12+ hours without touch-ups. It's the gold-standard technique used in film, fashion, and editorial shoots — and I bring that same studio-grade precision to your special day. Ideal for brides who want a lightweight feel with maximum photographic impact.",
    process: [
      {
        step: "Skin Assessment",
        detail:
          "Analysis of your skin type, undertone, and any areas that need extra attention or coverage.",
      },
      {
        step: "Primer & Base",
        detail:
          "A hydrating, pore-minimising primer is applied to create the perfect canvas for the airbrush.",
      },
      {
        step: "Airbrush Application",
        detail:
          "Layer-by-layer misting of foundation, concealer, contour, and blush for a seamless, buildable coverage.",
      },
      {
        step: "Finishing Touches",
        detail:
          "Eye makeup, lash application, lip colour, and a long-wear setting mist to lock everything in place.",
      },
    ],
    products: [
      "Temptu Airbrush System",
      "Dior Backstage Foundation",
      "Too Faced Better Than Sex Mascara",
      "Anastasia Beverly Hills Brow Wiz",
      "Pat McGrath Lip Fetish",
      "Charlotte Tilbury Setting Spray",
    ],
    gallery: [
      "/portfolio_fusion_bride.png",
      "/portfolio_maharashtrian_bride.png",
      "/portfolio_fashion_editorial.png",
    ],
    duration: "2–3 hours",
    idealFor: [
      "HD & 4K photo/video shoots",
      "Outdoor & destination weddings",
      "Oily or combination skin types",
      "Brides wanting a lightweight feel",
    ],
    startingAt: "₹12,000",
  },
  {
    title: "Party & Festive Glam",
    subtitle: "Celebration Styling",
    image: "/portfolio_sangeet_glam.png",
    tag: "Special Event",
    desc: "Glamorous and custom looks designed for receptions, sangeets, cocktail parties, and festive occasions.",
    inclusions: [
      "Custom eye makeup (glitter, cut-crease, or smoky)",
      "Flawless HD product base matching outfit theme",
      "Saree draping or styling as requested",
      "Includes premium lash application",
    ],
    fullDescription:
      "From sangeet nights dripping in glitter to elegant cocktail affairs and festive celebrations — Party & Festive Glam is all about turning heads. I design bold, statement-making looks that perfectly complement your outfit, the event's mood, and the lighting. Think dramatic cut-crease eyes, sculpted cheekbones, and statement lips — or a soft, radiant glow that lets your natural beauty shine through. Every look is fully customised, never cookie-cutter.",
    process: [
      {
        step: "Style Discussion",
        detail:
          "Share your outfit photos and event details — I'll suggest looks that complement the theme and lighting.",
      },
      {
        step: "Base & Sculpt",
        detail:
          "Flawless HD foundation, contour, and highlight tailored to your skin tone and the event ambiance.",
      },
      {
        step: "Eye & Lip Artistry",
        detail:
          "Custom eye design — glitter, smoky, cut-crease, or soft glam — paired with the perfect lip colour.",
      },
      {
        step: "Final Styling",
        detail:
          "Lash application, saree draping or hair touch-ups, and a final setting spray for long-lasting wear.",
      },
    ],
    products: [
      "Huda Beauty Rose Gold Palette",
      "MAC Fix+ Setting Spray",
      "Fenty Beauty Gloss Bomb",
      "Inglot AMC Eyeliner Gel",
      "Kryolan HD Foundation",
      "Ardell Wispies Lashes",
    ],
    gallery: [
      "/portfolio_sangeet_glam.png",
      "/portfolio_navratri_festive.png",
      "/portfolio_reception_glam.png",
    ],
    duration: "1.5–2.5 hours",
    idealFor: [
      "Sangeet & mehendi functions",
      "Reception & cocktail parties",
      "Navratri & festival celebrations",
      "Birthday & anniversary events",
    ],
    startingAt: "₹5,000",
  },
];
