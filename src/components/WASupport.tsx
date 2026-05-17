"use client";

import Image from "next/image";
import WAPopover from "./WAPopover";
import { IMAGES } from "@/lib/services";

export default function WASupport() {
  return (
    <WAPopover
      title="Support WhatsApp"
      align="left"
      dropDown={false}
      className="flex items-center gap-1.5 text-sm px-2 py-1 -mx-2 rounded-lg transition-all hover:bg-white/5 hover:text-white"
      style={{ color: "var(--text-secondary)", border: "1px solid transparent" }}
    >
      <Image src={IMAGES.whatsapp} alt="WhatsApp" width={14} height={14} unoptimized className="shrink-0" />
      Support WhatsApp 7j/7
    </WAPopover>
  );
}
