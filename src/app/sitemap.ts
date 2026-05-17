import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chreolempire.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { url: string; priority: number; freq: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { url: "",                        priority: 1.0, freq: "weekly"  },
    { url: "/services",               priority: 0.9, freq: "weekly"  },
    { url: "/services/cartes-cadeaux",priority: 0.9, freq: "weekly"  },
    { url: "/services/crypto",        priority: 0.9, freq: "daily"   },
    { url: "/services/coupons",       priority: 0.8, freq: "weekly"  },
    { url: "/services/uba",           priority: 0.8, freq: "weekly"  },
    { url: "/services/paypal",        priority: 0.8, freq: "weekly"  },
    { url: "/services/factures",      priority: 0.8, freq: "weekly"  },
    { url: "/paiement",               priority: 0.7, freq: "monthly" },
    { url: "/a-propos",               priority: 0.6, freq: "monthly" },
  ];

  return routes.map(r => ({
    url: `${BASE}${r.url}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
