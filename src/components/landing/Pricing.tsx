import { motion } from "framer-motion";
import { Check, ArrowUpLeft, Quote } from "lucide-react";

const perks = [
  "Fully automated onboarding—just enter your website URL and click Start",
  "Seobot analyzes your website, audience, and keywords",
  "Creates a content plan and starts writing articles in the first week",
  "You can approve, reject, or manage your articles",
  "Builds internal links between your website’s articles and pages",
  "Up to 4,000 words, YouTube video embeds, image generation, Google Images, tables, lists, and more",
  "Fact-checking and safeguards against typos and AI hallucinations, with sources cited. AI agents perform hundreds of tasks for every article.",
  "Full support and ongoing feature updates",
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-gray-100 bg-gray-50/70 py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">// Pricing</span>
          <h2 className="section-title">Maybe the best ROI on the market</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-0 overflow-hidden rounded-xl2 border border-gray-100 bg-white shadow-card lg:grid-cols-5"
        >
          {/* Founder quote */}
          <div className="flex flex-col justify-center gap-5 bg-ink-900 p-10 text-white lg:col-span-2">
            <Quote className="h-8 w-8 text-brand-400" />
            <p className="text-sm leading-7 text-gray-300">
              I built Seobot because I needed it myself. I use it for 11 SaaS projects and 20 of my own directories. Our mission is to build AI agents that create helpful content for readers and drive SEO traffic for founders. So far, our users have generated 600 million impressions and 15 million clicks.
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=faces"
                alt="John Rush"
                loading="lazy"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold">John Rush</div>
                <div className="text-xs text-gray-400">Founder of Seobot</div>
              </div>
            </div>
          </div>

          {/* Price card */}
          <div className="flex flex-col gap-6 p-10 lg:col-span-3">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-ink-900">$</span>
              <span className="text-5xl font-extrabold text-ink-900">49</span>
              <span className="pb-1 text-gray-400">/ month</span>
            </div>
            <span className="text-sm text-gray-400">Plans start at this price</span>

            <a href="https://app.seobotai.com/" className="btn-primary w-fit">
              Get SEO traffic
              <ArrowUpLeft className="h-4 w-4" />
            </a>

            <ul className="mt-2 space-y-3">
              <li className="text-sm font-bold text-ink-900">What you get:</li>
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-6 text-gray-600">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
