import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.chreolempire.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/historique", "/api/", "/admin", "/checkout"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
