import { motion } from "framer-motion";
import {
  Globe,
  Layers,
  Ghost,
  Feather,
  Layout,
  ShoppingBag,
  StickyNote,
  Building2,
  Code2,
  Webhook,
  Server,
  Sparkles,
  ArrowUpLeft,
} from "lucide-react";

const integrations = [
  { icon: Sparkles, name: "Unicorn Platform" },
  { icon: Layout, name: "Webflow" },
  { icon: Ghost, name: "Ghost" },
  { icon: Globe, name: "WordPress" },
  { icon: Feather, name: "Framer" },
  { icon: Layers, name: "Wix" },
  { icon: ShoppingBag, name: "Shopify" },
  { icon: StickyNote, name: "Notion" },
  { icon: Building2, name: "HubSpot" },
  { icon: Code2, name: "Next.js" },
  { icon: Webhook, name: "Webhook" },
  { icon: Server, name: "REST API" },
];

export default function Integrations() {
  return (
    <section id="integrations" className="border-t border-gray-100 bg-gray-50/70 py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            // Automatic sync with popular content management systems
          </span>
          <h2 className="section-title">Integrations</h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {integrations.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
              className="card flex flex-col items-center gap-3 p-6 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink-900 ring-1 ring-gray-200">
                <it.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold text-gray-600">
                {it.name}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <a href="#cta" className="btn-primary px-8 py-4 text-base">
            Try it now
            <ArrowUpLeft className="h-5 w-5" />
          </a>
          <span className="text-xs text-gray-400">
            Plans start at $49/month
          </span>
        </div>
      </div>
    </section>
  );
}
