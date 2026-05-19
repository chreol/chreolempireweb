"use client";

import Image from "next/image";
import { CONTACT, IMAGES } from "@/lib/services";

export default function MobileWACTA() {
  return (
    <a
      href={`https://wa.me/${CONTACT.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center"
      style={{
        background: "#25D366",
        boxShadow: "0 4px 24px rgba(37,211,102,0.5)",
      }}
    >
      <Image src={IMAGES.whatsapp} alt="WhatsApp" width={32} height={32} unoptimized />
    </a>
  );
}
