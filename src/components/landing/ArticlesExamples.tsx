import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";

const articles = [
  {
    tag: "Listicle",
    title: "The Best Content Management Systems for SEO: A Comparison of 12 Top Platforms",
    desc: "Choosing a content management system directly affects your site’s SEO performance.",
  },
  {
    tag: "Practical guide",
    title: "10 Tips for Indie Makers to Increase Product Visibility in 2024",
    desc: "These strategies help you connect with users and get noticed.",
  },
  {
    tag: "Practical Guide",
    title: "Robots.txt SEO Guide: 10 Best Practices",
    desc: "Ever wonder how search engines know which parts of your site to crawl?",
  },
  {
    tag: "Checklist",
    title: "Google Core Update Checklist: Get Your Site Ready",
    desc: "Google core updates can affect your rankings and traffic.",
  },
  {
    tag: "Q&A",
    title: "getServerSideProps in Next.js: Uses, Examples, and FAQs",
    desc: "getServerSideProps is a function for server-side rendering in Next.js.",
  },
  {
    tag: "Comparison",
    title: "Subdomain vs. Subdirectory vs. ccTLD for SEO",
    desc: "Choosing the right URL structure is essential for your multilingual site.",
  },
  {
    tag: "Roundup",
    title: "10 Proven Movie Theater Marketing Tactics for 2024",
    desc: "Want to sell more tickets and fill your theater?",
  },
  {
    tag: "Complete Guide",
    title: "Next.js 14 Project Structure: Best Practices",
    desc: "The right project structure is essential for maintainability, performance, and scalability.",
  },
];

export default function ArticlesExamples() {
  return (
    <section className="border-t border-gray-100 bg-gray-50/70 py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">// Article Examples</span>
          <h2 className="section-title">Sample Articles</h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a, i) => (
            <motion.a
              href="#"
              key={a.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="card group flex flex-col gap-3 p-6"
            >
              <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
                {a.tag}
              </span>
              <h3 className="text-sm font-bold leading-6 text-ink-900 group-hover:text-brand-600">
                {a.title}
              </h3>
              <p className="text-xs leading-6 text-gray-500">{a.desc}</p>
              <span className="mt-auto flex items-center gap-1 text-xs font-bold text-brand-600">
                Read more
                <ArrowUpLeft className="h-3.5 w-3.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
