import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is Seobot an AI SEO agent?",
    a: "Yes. Seobot is an AI-powered agent that automates SEO tasks, including keyword research, content optimization, internal linking, and backlink building.",
  },
  {
    q: "Are blog posts created automatically?",
    a: "Everything is automated. You can provide input or take control whenever you like, but by default, Seobot runs fully autonomously.",
  },
  {
    q: "Does it work in languages other than English?",
    a: "Yes. It can create high-quality SEO articles in many modern languages. We currently support 50 languages and are continually adding more.",
  },
  {
    q: "How do I access the Seobot platform?",
    a: "Simply sign up at app.seobotai.com.",
  },
  {
    q: "Can I manage the articles?",
    a: "Yes. You can always ask Seobot to email you a list of articles to approve or reject. That way, you stay in full control.",
  },
  {
    q: "How good are the results?",
    a: "Our article quality varies compared with human writers. It can be on par with an average human writer, lower, or even better. We’re continually improving.",
  },
  {
    q: "Which integrations and CMS platforms are supported?",
    a: "CMS platforms: Framer, Ghost, HubSpot, Notion, Shopify, Unicorn Platform, Webflow, Wix, and WordPress. Integrations: REST API, webhooks, Next.js, Zapier, Make, and more.",
  },
  {
    q: "Can I edit the articles?",
    a: "Yes. You can edit articles in Seobot before publishing them to your CMS.",
  },
  {
    q: "How does Seobot handle internal linking?",
    a: "Seobot automatically scans your content for relevant anchor text opportunities and links to your most important pages. As your content grows, it continually optimizes these connections.",
  },
  {
    q: "Does Seobot support programmatic SEO?",
    a: "Yes. Seobot creates data-driven templates, gathers data, and publishes pages at scale through your CMS.",
  },
  {
    q: "Can Seobot create news articles?",
    a: "Yes. Seobot has an AI-powered news article module that finds relevant news, writes headlines and drafts, and publishes them directly to your CMS.",
  },
  {
    q: "Can Seobot build SEO tools?",
    a: "Yes. Seobot builds custom SEO tools to drive organic traffic to your site, from analytics tools to generators and calculators.",
  },
  {
    q: "Can Seobot turn videos into articles?",
    a: "Yes. Seobot can turn YouTube videos into SEO-optimized articles. Just enter the video URL, and the AI will analyze its content.",
  },
  {
    q: "Can Seobot use AI to build backlinks?",
    a: "Yes. Seobot uses AI to build high-quality backlinks and automatically finds relevant link-building opportunities by analyzing your industry.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund on the $49 plan if you’re not satisfied with the results after your first article.",
  },
  {
    q: "Does Seobot work for crypto and adult websites?",
    a: "Yes for crypto, with no specific restrictions. Adult content is more limited because language models have built-in safety filters and may decline to generate some content.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="text-sm font-bold text-ink-900 sm:text-base">
          {faq.q}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-7 text-gray-500">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">// Frequently Asked Questions</span>
          <h2 className="section-title">Have a question?</h2>
          <p className="mt-4 text-gray-500">
            Connect with me on LinkedIn, Twitter, or email, or find your answer in the FAQs below 👇
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-4">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
