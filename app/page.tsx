"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, isConfigured } from "./lib/firebase";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Expertise from "./components/Expertise";
import Portfolio from "./components/Portfolio";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  useRevealOnScroll();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (!isConfigured) return;
    const fetchContent = async () => {
      try {
        const docSnap = await getDoc(doc(db, "content", "global"));
        if (docSnap.exists()) {
          setContent(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching content copy:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <>
      <Navbar content={content} />
      <Hero content={content?.hero} />
      <Services />
      <About content={content?.about} />
      <Expertise content={content?.specialties} />
      <Portfolio />
      <Reviews />
      <Contact content={content?.contact} />
      <Footer content={content} />
      <WhatsAppButton content={content?.contact} />
      <BackToTop />
    </>
  );
}
