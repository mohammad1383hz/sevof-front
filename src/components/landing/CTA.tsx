import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpLeft, ChevronDown } from "lucide-react";

const cmsOptions = [
  "Custom website",
  "Next.js",
  "Shopify",
  "Unicorn Platform",
  "Webflow",
  "Wix",
  "WordPress",
  "Other",
];

export default function CTA() {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <section id="cta" className="border-t border-gray-100 bg-ink-900 py-20 text-white">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Which content management system do you use?
          </h2>
          <p className="mt-4 text-gray-400">
            Choose your blog's content management system to get started.
          </p>

          <div className="relative mx-auto mt-8 max-w-sm">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm"
            >
              <span className={selected ? "text-white" : "text-gray-400"}>
                {selected || "Select..."}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-800 text-left shadow-card">
                {cmsOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelected(opt);
                      setOpen(false);
                    }}
                    className="block w-full px-6 py-3 text-sm text-gray-200 transition-colors hover:bg-white/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://app.seobotai.com/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-base font-bold text-ink-900 shadow-card transition-all hover:-translate-y-0.5 hover:bg-brand-400"
          >
            Start getting SEO traffic
            <ArrowUpLeft className="h-5 w-5" />
          </a>
          <div className="mt-3 text-xs text-gray-500">
            Plans start at $49 per month
          </div>
        </motion.div>
      </div>
    </section>
  );
}
