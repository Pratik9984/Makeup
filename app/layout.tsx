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
  title: "Rupali Shinde — Professional Makeup Artist, Ahilyanagar",
  description:
    "Professional makeup artist based in Ahilyanagar, Maharashtra. Bridal, airbrush, party, and editorial makeup looks crafted with care, precision, and artistry.",
  keywords:
    "makeup artist, bridal makeup, Ahilyanagar, Maharashtra, airbrush makeup, wedding makeup, professional MUA",
  openGraph: {
    title: "Rupali Shinde — Professional Makeup Artist",
    description:
      "Transforming faces and creating unforgettable looks for brides, events, and editorial shoots across Ahilyanagar and Maharashtra.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}
    >
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">{children}</body>
    </html>
  );
}
