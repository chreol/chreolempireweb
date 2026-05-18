"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/services";
import WAPopover from "./WAPopover";

export default function MobileWACTA() {
  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3"
      style={{
        background: "linear-gradient(to top, var(--bg-primary) 70%, transparent)",
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <WAPopover
        title="Commander via WhatsApp"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-black text-white"
        style={{ background: "#25D366", boxShadow: "0 4px 24px rgba(37,211,102,0.35)" }}
      >
        <Image src={IMAGES.whatsapp} alt="" width={22} height={22} unoptimized className="shrink-0" />
        Commander sur WhatsApp
      </WAPopover>
    </div>
  );
}
