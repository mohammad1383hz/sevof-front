import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function WhyChoose() {
  return (
    <section className="py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            // Why choose Seobot?
          </span>
          <h2 className="section-title">
            SEO for busy founders
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Seobot is an all-in-one AI agent for SEO that saves you time and energy.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl2 border border-gray-100 shadow-card"
        >
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop"
            alt="Seobot dashboard preview"
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
          <button
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-card">
              <PlayCircle className="h-10 w-10 text-brand-600" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
