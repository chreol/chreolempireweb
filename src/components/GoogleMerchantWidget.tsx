"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    merchantwidget?: {
      start: (config: { merchant_id: number; position?: string; region?: string }) => void;
    };
  }
}

export default function GoogleMerchantWidget() {
  useEffect(() => {
    const existing = document.getElementById("merchantWidgetScript");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "merchantWidgetScript";
    script.src = "https://www.gstatic.com/shopping/merchant/merchantwidget.js";
    script.defer = true;

    script.addEventListener("load", () => {
      window.merchantwidget?.start({
        merchant_id: 5500634687,
        position: "BOTTOM_LEFT",
      });
    });

    document.head.appendChild(script);
  }, []);

  return null;
}
