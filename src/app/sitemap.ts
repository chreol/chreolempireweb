import { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chreolempire.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { url: string; priority: number; freq: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { url: "",                         priority: 1.0, freq: "weekly"  },
    { url: "/services",                priority: 0.9, freq: "weekly"  },
    { url: "/services/cartes-cadeaux", priority: 0.9, freq: "weekly"  },
    { url: "/services/crypto",         priority: 0.9, freq: "daily"   },
    { url: "/services/coupons",        priority: 0.8, freq: "weekly"  },
    { url: "/services/uba",            priority: 0.8, freq: "weekly"  },
    { url: "/services/paypal",         priority: 0.8, freq: "weekly"  },
    { url: "/services/factures",       priority: 0.8, freq: "weekly"  },
    { url: "/blog",                    priority: 0.8, freq: "weekly"  },
    { url: "/promo",                   priority: 0.7, freq: "daily"   },
    { url: "/comment-ca-marche",       priority: 0.7, freq: "monthly" },
    { url: "/paiement",                priority: 0.7, freq: "monthly" },
    { url: "/a-propos",                priority: 0.6, freq: "monthly" },
    { url: "/cgu",                     priority: 0.3, freq: "yearly"  },
    { url: "/confidentialite",         priority: 0.3, freq: "yearly"  },
    { url: "/mentions-legales",        priority: 0.3, freq: "yearly"  },
  ];

  const blogRoutes: MetadataRoute.Sitemap = POSTS.map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map(r => ({
      url: `${BASE}${r.url}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...blogRoutes,
  ];
}
