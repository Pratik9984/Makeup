"use client";

import ContactDetails from "./ContactDetails";
import ContactForm from "./ContactForm";

export default function Contact({ content }: { content?: any }) {
  return (
    <section
      id="contact"
      className="pt-24 pb-24 md:pt-40 md:pb-40 relative"
      style={{
        background: "#ffffff",
      }}
    >
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16 lg:gap-28 items-start">
          <ContactDetails content={content} />
          <ContactForm whatsappNumber={content?.whatsappNumber} />
        </div>
      </div>
    </section>
  );
}
