import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rupali Shinde — Best Beauty Parlor & Bridal Makeup Artist in Ahilyanagar",
  description:
    "Rupali Shinde is the best beauty parlor and professional bridal makeup artist in Ahilyanagar, Maharashtra. Premium beauty salon services, bridal HD makeup, airbrush, and party styling.",
  keywords:
    "beauty parlor in ahilyanagar, best beauty parlor in ahilyanagar, beauty salon in ahilyanagar, best beauty salon in ahilyanagar, makeup artist in ahilyanagar, bridal makeup artist in ahilyanagar, best makeup artist in ahilyanagar, bridal beauty parlor ahilyanagar, salon services ahilyanagar, airbrush makeup ahilyanagar, rupali shinde makeup",
  alternates: {
    canonical: "https://rupalishindemakeup.netlify.app",
  },
  openGraph: {
    title: "Rupali Shinde — Best Beauty Parlor & Bridal Makeup Artist in Ahilyanagar",
    description:
      "Transforming faces and offering premium beauty parlor, salon services, and bridal makeup styling across Ahilyanagar and Maharashtra.",
    url: "https://rupalishindemakeup.netlify.app",
    siteName: "Rupali Shinde MUA",
    images: [
      {
        url: "/about.png",
        width: 800,
        height: 600,
        alt: "Rupali Shinde - Best Beauty Parlor & Makeup Artist in Ahilyanagar",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rupali Shinde — Best Beauty Parlor & Bridal Makeup Artist in Ahilyanagar",
    description:
      "Transforming faces and offering premium beauty parlor, salon services, and bridal makeup styling across Ahilyanagar and Maharashtra.",
    images: ["/about.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Rupali Shinde Makeup Artist & Beauty Parlor",
    "image": "https://rupalishindemakeup.netlify.app/about.png",
    "@id": "https://rupalishindemakeup.netlify.app/#makeup-artist",
    "url": "https://rupalishindemakeup.netlify.app",
    "telephone": "+919876543210",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ahilyanagar",
      "addressLocality": "Ahilyanagar",
      "addressRegion": "Maharashtra",
      "postalCode": "414001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.0948,
      "longitude": 74.7480
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://instagram.com/rupalishinde.mua",
      "https://facebook.com/"
    ],
    "description": "Professional bridal makeup artist and premium beauty parlor in Ahilyanagar, Maharashtra. Offering best Maharashtrian bridal HD makeup, airbrush makeup, salon services, and beauty parlor styling."
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}
    >
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
