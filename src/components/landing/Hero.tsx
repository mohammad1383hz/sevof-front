import { motion } from "framer-motion";
import { Sparkles, ArrowUpLeft, TrendingUp, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl" />
      </div>

      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="section-eyebrow justify-center">
            <Sparkles className="h-4 w-4" />
            Powered by AI and GPT agents
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.3] tracking-tight text-ink-900 sm:text-5xl sm:leading-[1.25]">
            Seobot — <span className="gradient-text">“Seobot”</span>{" "}
            Fully automated with AI agents
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Seobot takes 100% of SEO off your plate, so you can focus on building your product.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3">
            <a href="#cta" className="btn-primary px-8 py-4 text-base">
              Get more traffic from SEO
              <ArrowUpLeft className="h-5 w-5" />
            </a>
            <span className="text-xs text-gray-400">
              Plans start at $49/month
            </span>
          </div>
        </motion.div>

        {/* Secondary promo pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-soft"
        >
          <TrendingUp className="h-4 w-4 text-brand-600" />
          <span className="text-sm text-gray-600">
            <strong className="text-ink-900">ListingBot:</strong> Improve your domain authority
          </span>
          <a href="#" className="text-sm font-bold text-brand-600 underline">
            Get started now
          </a>
        </motion.div>

        {/* Founder note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces"
            alt="Seobot founder"
            loading="lazy"
            className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-card"
          />
          <p className="text-sm text-gray-500">
            Have a question? Find us on{" "}
            <a href="#" className="font-semibold text-ink-900 underline">
              LinkedIn
            </a>
            ,{" "}
            <a href="#" className="font-semibold text-ink-900 underline">
              Twitter
            </a>{" "}
            or reach out by{" "}
            <a href="#" className="font-semibold text-ink-900 underline">
              email
            </a>{" "}
             us.
          </p>
        </motion.div>

        {/* Product Hunt badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex h-14 w-56 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-ink-900 px-4 text-white">
            <Award className="h-6 w-6 text-brand-300" />
            <div className="text-left leading-tight">
              <div className="text-[11px] text-gray-300">Top Product of the Day</div>
              <div className="text-xs font-bold">Product Hunt</div>
            </div>
          </div>
          <div className="flex h-14 w-56 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-ink-900 px-4 text-white">
            <Award className="h-6 w-6 text-brand-300" />
            <div className="text-left leading-tight">
              <div className="text-[11px] text-gray-300">Top topic of the week</div>
              <div className="text-xs font-bold">Product Hunt</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
