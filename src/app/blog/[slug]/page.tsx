import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost, type BlogSection } from "@/lib/blog";
import { CONTACT } from "@/lib/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://chreolempire.com/blog/${post.slug}`;
  return {
    title: { absolute: `${post.title} | Chreol Empire` },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, url, type: "article", publishedTime: post.dateISO },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

function renderSection(s: BlogSection, i: number) {
  switch (s.type) {
    case "h2":
      return <h2 key={i} className="text-xl font-black text-white mt-8 mb-3">{s.text}</h2>;
    case "h3":
      return <h3 key={i} className="text-base font-black text-white mt-5 mb-2">{s.text}</h3>;
    case "p":
      return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{s.text}</p>;
    case "ul":
      return (
        <ul key={i} className="flex flex-col gap-2 mb-4 pl-4">
          {s.items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed flex gap-2" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--gold)" }} className="shrink-0 mt-0.5">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div key={i} className="rounded-xl p-4 mb-4"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
          <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: "var(--gold)" }}>
            💡 {s.title}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.text}</p>
        </div>
      );
    case "cta":
      return (
        <div key={i} className="my-6">
          <Link href={s.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-opacity hover:opacity-85"
            style={{ background: "var(--gold)", color: "#0A0A0A" }}>
            {s.label}
          </Link>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const postUrl = `https://chreolempire.com/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: { "@type": "Organization", name: "Chreol Empire", url: "https://chreolempire.com" },
    publisher: { "@type": "Organization", name: "Chreol Empire", url: "https://chreolempire.com" },
    url: postUrl,
    keywords: post.keywords.join(", "),
    inLanguage: "fr-FR",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }} className="truncate">{post.category}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "var(--gold)22", color: "var(--gold)" }}>
            {post.emoji} {post.category}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {post.date} · {post.readTime} min de lecture
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">{post.title}</h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{post.headline}</p>
      </div>

      {/* Content */}
      <article className="prose-custom">
        {post.sections.map((s, i) => renderSection(s, i))}
      </article>

      {/* FAQ */}
      <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
        <h2 className="text-xl font-black text-white mb-5">Questions fréquentes</h2>
        <div className="flex flex-col gap-3">
          {post.faq.map((item, i) => (
            <details key={i} className="group rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none font-black text-white text-sm">
                {item.q}
                <span className="shrink-0 text-base transition-transform group-open:rotate-45" style={{ color: "var(--gold)" }}>+</span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl p-6 text-center"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}>
        <p className="font-black text-white mb-1">Prêt à commander ?</p>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          Service disponible 7j/7, livraison en 15–30 min via WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={post.relatedService.href}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full font-black text-sm transition-opacity hover:opacity-85"
            style={{ background: "var(--gold)", color: "#0A0A0A" }}>
            {post.relatedService.label}
          </Link>
          <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Bonjour, j'ai lu votre article "${post.title}" et je voudrais passer une commande.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-sm text-white transition-opacity hover:opacity-85"
            style={{ background: "#25D366" }}>
            💬 Commander via WhatsApp
          </a>
        </div>
      </div>

      {/* Related posts */}
      <div className="mt-8">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          Voir aussi
        </p>
        <div className="flex flex-col gap-3">
          {POSTS.filter(p => p.slug !== post.slug).map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl transition-opacity hover:opacity-75"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="text-xl">{p.emoji}</span>
              <span className="text-sm font-semibold text-white leading-snug flex-1">{p.title}</span>
              <span className="text-xs shrink-0" style={{ color: "var(--gold)" }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
