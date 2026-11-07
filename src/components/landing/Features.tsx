import { motion } from "framer-motion";
import {
  Link2,
  LayoutGrid,
  Newspaper,
  Wrench,
  FileText,
  Network,
  ImageIcon,
  Video,
  Search,
  ShieldCheck,
  BrainCircuit,
  RefreshCcw,
  ArrowUpLeft,
} from "lucide-react";

const features = [
  // { icon: Youtube, title: "تبدیل ویدیوی یوتیوب به مقاله", isNew: true },
  { icon: Link2, title: "Backlinks to boost your Domain Rating", isNew: true },
  { icon: LayoutGrid, title: "Programmatic SEO", isNew: true },
  { icon: Newspaper, title: "News Generation", isNew: true },
  { icon: Wrench, title: "Interactive SEO Tools", isNew: true },
  { icon: FileText, title: "3,000-Word Articles on Average", isNew: false },
  { icon: Network, title: "Internal and External Link Building", isNew: false },
  { icon: ImageIcon, title: "Images in Every Article", isNew: false },
  { icon: Video, title: "Relevant YouTube Videos", isNew: false },
  { icon: Search, title: "Google Data Extraction and Research", isNew: false },
  { icon: ShieldCheck, title: "Fact-Checking", isNew: false },
  { icon: BrainCircuit, title: "AI Hallucination Prevention", isNew: false },
  { icon: RefreshCcw, title: "Monthly Article Reviews and Link Building", isNew: false },
];

export default function Features() {
  return (
    <section className="border-t border-gray-100 bg-gray-50/70 py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">Built-in Features</span>
          <h2 className="section-title">Powerful Features Built Into Seobot</h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
              className="card relative flex flex-col items-start gap-4 p-6 transition-shadow hover:shadow-card"
            >
              {f.isNew && (
                <span className="absolute right-4 top-4 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  New
                </span>
              )}
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-bold leading-6 text-ink-900">
                {f.title}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <a href="#cta" className="btn-primary px-8 py-4 text-base">
            Try It Now
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
