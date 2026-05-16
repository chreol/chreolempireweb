import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import RateTicker from "@/components/RateTicker";
import { CONTACT } from "@/lib/services";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Chreol Empire — Cartes Cadeaux & Crypto au Cameroun",
  description: "Achetez vos cartes cadeaux PSN, iTunes, Roblox, Steam et échangez vos crypto (USDT, BTC) au meilleur taux. Livraison express 15-30 min via WhatsApp. Douala, Cameroun.",
  keywords: ["cartes cadeaux cameroun", "PSN cameroun", "USDT FCFA", "crypto douala", "PCS transcash"],
  openGraph: {
    title: "Chreol Empire",
    description: "Cartes cadeaux & crypto au Cameroun — livraison express",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <RateTicker />
          <Navbar />
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer style={{ background: "#0D0D0D", borderTop: "1px solid #1A1A1A" }} className="mt-16">
            <div className="max-w-6xl mx-auto px-4 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                  <p className="font-black text-xl mb-2">
                    Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {CONTACT.address}
                  </p>
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}`}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-bold text-white"
                    style={{ background: "#25D366" }}
                    target="_blank" rel="noopener noreferrer"
                  >
                    💬 {CONTACT.whatsappDisplay}
                  </a>
                </div>

                {/* Links */}
                <div>
                  <p className="font-bold text-sm mb-3" style={{ color: "var(--gold)" }}>SERVICES</p>
                  <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <a href="/services/cartes-cadeaux" className="hover:text-white transition-colors">Cartes Cadeaux</a>
                    <a href="/services/crypto" className="hover:text-white transition-colors">Crypto & MoMo</a>
                    <a href="/services/coupons" className="hover:text-white transition-colors">Coupons PCS / Transcash</a>
                    <a href="/services/uba" className="hover:text-white transition-colors">UBA Cameroun</a>
                    <a href="/services/paypal" className="hover:text-white transition-colors">PayPal Europe</a>
                    <a href="/services/factures" className="hover:text-white transition-colors">Paiement Factures</a>
                  </div>
                </div>

                {/* Info links */}
                <div>
                  <p className="font-bold text-sm mb-3" style={{ color: "var(--gold)" }}>INFORMATIONS</p>
                  <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <a href="/paiement" className="hover:text-white transition-colors">Modes de paiement</a>
                    <a href="/a-propos" className="hover:text-white transition-colors">À propos</a>
                    <a href="/sitemap" className="hover:text-white transition-colors">Plan du site</a>
                  </div>
                </div>

                {/* Trust */}
                <div>
                  <p className="font-bold text-sm mb-3" style={{ color: "var(--gold)" }}>CONFIANCE</p>
                  <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span>✅ Codes authentiques garantis</span>
                    <span>⚡ Livraison express 15–30 min</span>
                    <span>🔒 Paiement sécurisé Mobile Money</span>
                    <span>💬 Support WhatsApp 7j/7</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: "1px solid #1F1F1F", color: "var(--text-muted)" }}>
                © {new Date().getFullYear()} Chreol Empire. Tous droits réservés.
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
