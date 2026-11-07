import { motion } from "framer-motion";
import { FileText, Eye, MousePointerClick } from "lucide-react";

const stats = [
  { icon: FileText, value: "+200K", label: "Articles published" },
  { icon: Eye, value: "1.2 billion", label: "Impressions" },
  { icon: MousePointerClick, value: "30 million", label: "Clicks received" },
];

const sites = [
  {
    name: "devhunt.org",
    logo: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=160&h=48&fit=crop",
  },
  {
    name: "filmgrail.com",
    logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=160&h=48&fit=crop",
  },
  {
    name: "nextjsstarter.com",
    logo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=160&h=48&fit=crop",
  },
  {
    name: "llmmodels.org",
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=160&h=48&fit=crop",
  },
];

export default function Stats() {
  return (
    <section className="border-t border-gray-100 bg-gray-50/70 py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            // SEO-optimized blog generation
          </span>
          <h2 className="section-title">Seobot has created over 200,000 articles!</h2>
          <p className="mt-4 text-lg text-gray-500">
            With 1.2 billion impressions and 30 million clicks to date.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card flex flex-col items-center gap-3 p-8 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <s.icon className="h-6 w-6" />
              </span>
              <div className="text-2xl font-extrabold text-ink-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80 grayscale">
          {sites.map((site) => (
            <div key={site.name} className="flex items-center gap-2">
              <img
                src={site.logo}
                alt={site.name}
                loading="lazy"
                className="h-8 w-8 rounded-md object-cover"
              />
              <span className="text-sm font-semibold text-gray-500">
                {site.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
