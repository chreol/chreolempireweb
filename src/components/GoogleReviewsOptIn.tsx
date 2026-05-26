"use client";

import { useEffect } from "react";

interface Props {
  orderId: string;
  email: string;
  deliveryCountry?: string;
  estimatedDeliveryDate?: string;
}

declare global {
  interface Window {
    gapi?: {
      load: (lib: string, cb: () => void) => void;
      surveyoptin?: {
        render: (config: Record<string, unknown>) => void;
      };
    };
  }
}

export default function GoogleReviewsOptIn({
  orderId,
  email,
  deliveryCountry = "CM",
  estimatedDeliveryDate,
}: Props) {
  useEffect(() => {
    if (!email || !orderId) return;

    const today = new Date();
    const deliveryDate =
      estimatedDeliveryDate ??
      today.toISOString().split("T")[0]; // livraison le jour même (15-30 min)

    function render() {
      window.gapi?.load("surveyoptin", () => {
        window.gapi?.surveyoptin?.render({
          merchant_id: 5500634687,
          order_id: orderId,
          email,
          delivery_country: deliveryCountry,
          estimated_delivery_date: deliveryDate,
        });
      });
    }

    if (window.gapi) {
      render();
    } else {
      // Script pas encore chargé — attendre l'event renderOptIn
      (window as unknown as Record<string, unknown>).renderOptIn = render;
    }
  }, [orderId, email, deliveryCountry, estimatedDeliveryDate]);

  return null;
}
