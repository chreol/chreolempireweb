import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control",    value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },

  async redirects() {
    return [
      { source: "/home",          destination: "/",                        permanent: true },
      { source: "/index",         destination: "/",                        permanent: true },
      { source: "/shop",          destination: "/services",                permanent: true },
      { source: "/boutique",      destination: "/services",                permanent: true },
      { source: "/gift-cards",    destination: "/services/cartes-cadeaux", permanent: true },
      { source: "/cartes-cadeaux", destination: "/services/cartes-cadeaux", permanent: true },
      { source: "/crypto",        destination: "/services/crypto",         permanent: true },
      { source: "/paypal",        destination: "/services/paypal",         permanent: true },
      { source: "/coupons",       destination: "/services/coupons",        permanent: true },
      { source: "/uba",           destination: "/services/uba",            permanent: true },
      { source: "/factures",      destination: "/services/factures",       permanent: true },
      { source: "/contact",       destination: "/a-propos",                permanent: true },
      { source: "/faq",           destination: "/comment-ca-marche",       permanent: true },
      { source: "/about",         destination: "/a-propos",                permanent: true },
      { source: "/cgv",           destination: "/cgu",                     permanent: true },
      { source: "/privacy",       destination: "/confidentialite",         permanent: true },
      { source: "/legal",         destination: "/mentions-legales",        permanent: true },
      { source: "/services/autre", destination: "/services",               permanent: true },
    ];
  },
};

export default nextConfig;
