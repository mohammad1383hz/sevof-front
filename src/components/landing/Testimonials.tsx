import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ali Mohammadi",
    handle: "SaaS startup founder",
    text: "Within three months of launch, our organic traffic tripled. The articles are genuinely high-quality and relevant.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
  },
  {
    name: "Sara Ahmadi",
    handle: "Content marketing manager",
    text: "We no longer need to hire writers. Seobot writes fresh, optimized articles for us every week.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
  },
  {
    name: "Reza Karimi",
    handle: "Independent developer",
    text: "Automatic internal linking saves me so much time. I recommend giving it a try.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
  },
  {
    name: "Maryam Hosseini",
    handle: "Online store owner",
    text: "With Shopify integration, articles are published automatically. A seamless experience.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
  },
  {
    name: "Amir Rostami",
    handle: "Multi-directory founder",
    text: "I use Seobot for 11 projects. It scales incredibly well.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces",
  },
  {
    name: "Negar Sadeghi",
    handle: "SEO specialist",
    text: "Its fact-checking and safeguards against AI hallucinations set this tool apart.",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=faces",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">// Wall of love 😍</span>
          <h2 className="section-title">Thousands of users</h2>
          <p className="mt-4 text-lg text-gray-500">
            have used Seobot to drive traffic to their blogs.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              className="card flex flex-col gap-4 p-6"
            >
              <div className="flex gap-1 text-brand-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-7 text-gray-600">"{t.text}"</p>
              <div className="mt-auto flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-bold text-ink-900">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.handle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
