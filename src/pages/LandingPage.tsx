import { useState } from 'react';
import HowItWorksSection from "../components/HowItWorksSection";
import PricingSection from "../components/PricingSection";

import { Link } from "react-router-dom";


interface FeatureTagProps {
  icon: string;
  title: string;
  isNew?: boolean;
}

interface ArticleCardProps {
  tag: string;
  title: string;
  description: string;
}

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
}

/*
  Palette (warm neutral, medium contrast — built for trust, not for "SaaS pastel"):
  --ink        #0D0F23   deep teal-charcoal, primary text & dark panel
  --ink-soft   #5A5F80   secondary text
  --paper      #F3F2FB   page background, warm stone (not white, not blue)
  --surface    #FAFAFE   card surface
  --line       #E4E5F0   hairline borders
  --teal       #5B47FB   primary accent (trust / growth)
  --teal-dark  #4935E0   accent hover
  --teal-tint  #EFEDFF   accent background tint (checkmarks, chips)
  --bronze     #B08D57   secondary accent (badges, highlights)
  --bronze-tint#EDE3CF   secondary accent tint
  --cream      #F6F6FB   text-on-dark
*/

const faqData = [
  { q: "Is Seobot an AI SEO agent?", a: "Yes. Seobot is an AI-powered assistant that fully automates SEO, from keyword research and content optimization to internal linking and backlink building." },
  { q: "Are blog posts created automatically?", a: "Everything is fully automated. You can step in during content creation or take full control if you prefer, but the system is designed to run autonomously by default." },
  { q: "Does the platform work in languages other than English?", a: "Yes! Seobot can create high-quality, SEO-friendly articles in most major languages. We currently support more than 50 languages, and the list is continually growing." },
  { q: "How do I get started with Seobot?", a: "It’s easy! Just add your website at app.seobotai.com to get started." },
  { q: "Can I review the articles before they’re published?", a: "Absolutely! You can set Seobot to email you a list of articles for approval before they’re published. You’re always in control." },
  { q: "How good is the content Seobot creates?", a: "Article quality can vary. Sometimes it’s on par with an average writer, sometimes a little lower, and often it’s more insightful and effective. Our models are also continually learning and improving." },
  { q: "Which content management systems (CMS) do you support?", a: "CMS platforms: WordPress, Webflow, Wix, Framer, Ghost, HubSpot, Notion, Shopify, and Unicorn Platform. Other integrations: REST API, webhooks, Next.js, Zapier, Make, and more." },
  { q: "Can I edit articles before they’re published?", a: "Yes. Seobot’s built-in editor lets you make changes to an article before sending it to your CMS." },
  { q: "How does Seobot handle internal linking?", a: "Our bot scans all your site’s content to find the best anchor text and link pages together. As your site grows, its internal linking network gets smarter." },
  { q: "Does Seobot support programmatic SEO?", a: "Yes. Seobot can create data-driven templates, gather information, and publish thousands of targeted pages on your site at scale." },
  { q: "Can the platform create timely news content?", a: "Yes. Seobot includes a news-writing module that monitors news relevant to your industry, drafts articles, and publishes them to your site right away." },
  { q: "Can Seobot build interactive SEO tools?", a: "Absolutely! Seobot can build custom mini-tools, such as calculators and analytics tools, to help attract organic traffic." },
  { q: "Can I turn a video into an article?", a: "Yes. One of our most exciting features turns YouTube videos into SEO-friendly articles. Just provide a video link, and our AI will turn its content into a comprehensive article." },
  { q: "Can AI build backlinks for me?", a: "Yes. Our AI analyzes your competitors to uncover untapped link-building opportunities and build high-quality, authoritative backlinks for your site." },
  { q: "Do you offer a refund policy?", a: "Yes. If you purchase our $49 plan and aren’t satisfied with the results after your first article, we’ll refund your full payment, no questions asked." },
  { q: "Does Seobot work for specialized industries like cryptocurrency?", a: "There are no restrictions on cryptocurrency projects. However, some sensitive content, such as adult websites, may be restricted because language models use robust safety filters to prevent generating this type of content." },
];

/*
  --- Ambient "rain line" effect ---
  Thin, faint, slow-moving vertical strokes that drift from top to bottom,
  sitting behind all content and in front of the paper background.
  Generated once at module load so positions/timings stay stable across
  re-renders (no re-shuffling every time state changes elsewhere on the page).
*/
const RAIN_LINE_COUNT = 18;

interface RainLineConfig {
  left: number;      // horizontal position, %
  height: number;     // stroke length, px
  duration: number;   // fall duration, s (slow = luxurious, not stormy)
  delay: number;       // negative delay so lines are already mid-fall on load
  opacity: number;     // barely-there
  width: number;       // thicker strokes for a bit more visual presence
}

const generateRainLines = (count: number): RainLineConfig[] =>
  Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    height: 90 + Math.random() * 170,
    duration: 3 + Math.random() * 5, // 16s–32s
    delay: -(Math.random() * 32),
    opacity: 0.05 + Math.random() * 0.08, // 0.05–0.13

width: 3 + Math.random() * 6, // 6px–12px, عرض بخش گرد پایین قطره
  }));

const rainLines = generateRainLines(RAIN_LINE_COUNT);

const RainOverlay = () => (
  <div
    className="fixed inset-0 z-[3] overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    {rainLines.map((line, i) => {
      const w = line.width;
      const h = line.height;
      const r = w / 2;
      const path = `M ${w / 2} 0 Q 0 ${(h - r) * 0.55} 0 ${h - r} A ${r} ${r} 0 0 0 ${w} ${h - r} Q ${w} ${(h - r) * 0.55} ${w / 2} 0 Z`;

      return (
        <svg
          key={i}
          className="Seobot-rain-line absolute top-[-15%]"
          style={{
            left: `${line.left}%`,
            opacity: line.opacity,
            animationDuration: `${line.duration}s`,
            animationDelay: `${line.delay}s`,
          }}
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
        >
          <path d={path} fill="#5B47FB" />
        </svg>
      );
    })}
    <style>{`
      @keyframes Seobot-rain-fall {
        0%   { transform: translateY(-15vh); }
        100% { transform: translateY(115vh); }
      }
      .Seobot-rain-line {
        animation-name: Seobot-rain-fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        will-change: transform;
      }
      @media (prefers-reduced-motion: reduce) {
        .Seobot-rain-line {
          animation: none;
          opacity: 0 !important;
        }
      }
    `}</style>
  </div>
);

const FeatureTag = ({ icon, title, isNew }: FeatureTagProps) => (
  <div className="flex items-center justify-center gap-3 border border-[#E4E5F0] bg-[#FAFAFE] shadow-sm px-4 py-3 rounded hover:border-[#5B47FB]/50 transition-colors cursor-default">
    <span className="text-[#5B47FB] font-bold">{icon}</span>
    <span className="text-[#0D0F23] text-sm md:text-base">{title}</span>
    {isNew && (
      <span className="bg-[#EDE3CF] text-[#8A6A2F] text-xs px-2 py-0.5 rounded ml-2 font-semibold">
        New
      </span>
    )}
  </div>
);

const ArticleCard = ({ tag, title, description }: ArticleCardProps) => (
  <div className="border border-[#E4E5F0] bg-[#FAFAFE] shadow-sm rounded-lg p-6 hover:border-[#5B47FB]/50 hover:shadow-md transition-all flex flex-col items-center text-center h-full">
    <div className="bg-[#5B47FB] text-white font-bold text-xs inline-block px-3 py-1 mb-4 rounded-sm">
      {tag}
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#0D0F23]">{title}</h3>
    <p className="text-[#0D0F23] text-sm mb-6 flex-grow leading-relaxed">
      {description}
    </p>
    <a href="#" className="text-[#5B47FB] font-bold text-sm hover:underline flex items-center justify-center gap-2">
      Read more <span className="text-lg">←</span>
    </a>
  </div>
);

const FaqAccordionItem = ({ question, answer, index }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#E4E5F0] rounded-lg bg-[#FAFAFE] shadow-sm overflow-hidden mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F6F6FB] transition-colors focus:outline-none"
      >
        <span className="font-bold text-sm md:text-base text-[#0D0F23] flex-grow">
          {index + 1}. {question}
        </span>
        <span className={`text-[#5B47FB] transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 text-[#0D0F23] text-sm md:text-base leading-relaxed border-t border-[#E4E5F0] mt-2 text-left text-justify">
          {answer}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <>
      <div dir="ltr" className="min-h-screen bg-[#F3F2FB] text-[#0D0F23] selection:bg-[#D9D4FF] selection:text-[#0D0F23] pb-20">
        {/* Background Overlay */}
        <div className="fixed inset-0 z-0 opacity-50 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E6E5F1] via-[#F3F2FB] to-[#FAFAFE]"></div>

        {/* Ambient rain-line overlay — sits above the paper background, below all content */}
        <RainOverlay />

        {/* Main Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 flex flex-col items-center">

          {/* --- Navbar --- */}
<div className="sticky top-0 z-50 w-full">
  <nav className="flex items-center justify-between w-full max-w-6xl mx-auto px-6 lg:px-8 py-4">
    
    <div className="text-2xl font-bold text-[#5B47FB] tracking-tighter" dir="ltr">
      Seobot
    </div>

    <div className="hidden md:flex items-center justify-center gap-8 text-sm">
      <a 
        href="#" 
        className="text-[#0D0F23] hover:text-[#5B47FB] transition-colors font-medium"
      >
        Plans
      </a>

      <Link
        to="/login"
        className="bg-[#5B47FB] hover:bg-[#4935E0] text-white font-semibold py-2 px-6 rounded transition-colors shadow-sm"
      >
        Get started for free
      </Link>
    </div>

  </nav>
</div>
          {/* --- Hero Section --- */}
        <section className="pt-24 pb-10 max-w-3xl flex flex-col items-center text-center">
<p className="text-[#5B47FB] font-semibold mb-6 text-sm font-mono" dir="ltr">
  // Powered by AI and GPT agents
</p>

  

<h1
  className="text-4xl md:text-5xl font-bold mb-8 text-[#0D0F23] leading-[1.35]"
   style={{ lineHeight: "1.3" }}
>
  Seobot{" "}
  <span className="text-[#5B47FB] font-extrabold">
    Youtix
  </span>
  <br />
  AI-powered SEO content assistant
</h1>
<p className="text-[#0D0F23] mb-10 text-lg leading-relaxed max-w-2xl">
  <span className="font-semibold text-[#5B47FB]">Youtix Seobot</span>{" "}
  It analyzes your website and competitors, uncovers new opportunities, writes SEO-optimized articles, and can publish them directly to your site.
</p>
  <div className="flex flex-col items-center gap-4 mb-12">
    <button className="bg-[#5B47FB] hover:bg-[#4935E0] text-white font-bold py-3 px-8 rounded transition-colors shadow-md">
  Get started for free
    </button>
  </div>

 
</section>
          {/* --- Stats Section --- */}
          {/* <section className="pt-20 pb-16 w-full flex flex-col items-center text-center">
            <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono" dir="ltr">// ساخت وبلاگ بهینه‌شده برای سئو</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0D0F23]">سئوبات تاکنون بیش از ۲۰۰ هزار مقاله تولید کرده است!</h2>
            <p className="text-[#0D0F23] mb-16 text-lg">خلق ارزش با ایجاد ۱.۲ میلیارد بازدید و ۳۰ میلیون کلیک ارگانیک.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative w-full max-w-5xl mx-auto" dir="ltr">
               <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                 <div className="absolute -top-4 -left-4 bg-[#B08D57] text-white font-bold px-4 py-1 z-10 rotate-6 shadow-md rounded-sm">devhunt.org</div>
                 <div className="bg-[#FAFAFE] border border-[#E4E5F0] shadow-sm rounded overflow-hidden"><img src="/final.jpg" alt="Chart" className="w-full" /></div>
               </div>
               <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
                 <div className="absolute -top-4 -left-4 bg-[#B08D57] text-white font-bold px-4 py-1 z-10 rotate-[10deg] shadow-md rounded-sm">filmgrail.com</div>
                 <div className="bg-[#FAFAFE] border border-[#E4E5F0] shadow-sm rounded overflow-hidden"><img src="/final.jpg" alt="Chart" className="w-full" /></div>
               </div>
               <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
                 <div className="absolute -top-4 left-10 bg-[#B08D57] text-white font-bold px-4 py-1 z-10 rotate-[-5deg] shadow-md rounded-sm">nextjsstarter.com</div>
                 <div className="bg-[#FAFAFE] border border-[#E4E5F0] shadow-sm rounded overflow-hidden"><img src="/final.jpg" alt="Chart" className="w-full" /></div>
               </div>
               <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                 <div className="absolute -top-4 -left-2 bg-[#B08D57] text-white font-bold px-4 py-1 z-10 rotate-[8deg] shadow-md rounded-sm">llmmodels.org</div>
                 <div className="bg-[#FAFAFE] border border-[#E4E5F0] shadow-sm rounded overflow-hidden"><img src="/final.jpg" alt="Chart" className="w-full" /></div>
               </div>
            </div>
          </section> */}


<section className="pt-24 pb-24 w-full flex flex-col items-center">

  <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono">
    // Seobot demo
  </p>

  <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-[#0D0F23]">
What does Youtix do?
  </h2>

  <div
    className="
      w-full
      max-w-4xl
      rounded-2xl
      overflow-hidden
      border border-[#E4E5F0]
      bg-[#FAFAFE]
      shadow-xl
    "
  >
    {/* Header */}
    <div
      className="
        h-14
        px-5
        flex
        items-center
        justify-between
        border-b
        border-[#E4E5F0]
      "
    >
      <span className="font-semibold text-[#0D0F23]">
        Demo.mp4
      </span>

      <span className="text-sm text-[#0D0F23]">
        About 2 minutes
      </span>
    </div>

    {/* Video */}
    <div
      className="
        relative
        aspect-video
        max-h-[520px]
        bg-[#E9E5D9]
      "
    >
      <video
        controls
        preload="metadata"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-contain
        "
      >
        <source src="/demo.mp4" type="video/mp4" />
      </video>
    </div>
  </div>

</section>
      <HowItWorksSection />


          {/* --- Features Section --- */}
          <section className="pt-20 pb-20 w-full flex flex-col items-center text-center">
            <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono" dir="ltr">// Youtix Seobot features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#0D0F23]">Powerful features to grow your website</h2>
            <div className="flex flex-wrap justify-center gap-4 items-center max-w-4xl mx-auto">
              <FeatureTag icon="+" title="Turn YouTube videos into articles" isNew={true} />
              <FeatureTag icon="+" title="Build backlinks to boost domain authority" isNew={true} />
              <FeatureTag icon="+" title="Programmatic SEO" isNew={true} />
              <FeatureTag icon="+" title="Dedicated news module" isNew={true} />
              <FeatureTag icon="+" title="Interactive SEO mini-tools" isNew={true} />
              <FeatureTag icon="+" title="Create comprehensive articles (3,000 words on average)" />
              <FeatureTag icon="+" title="Powerful internal and external link building" />
              <FeatureTag icon="+" title="Generate custom images for articles" />
              <FeatureTag icon="+" title="Embed relevant YouTube videos" />
              <FeatureTag icon="+" title="Web scraping and in-depth Google research" />
              <FeatureTag icon="+" title="Fact-checking and information verification" />
              <FeatureTag icon="+" title="Reflective system to reduce AI hallucinations" />
              <FeatureTag icon="+" title="Update links and articles monthly" />
            </div>
          </section>

          {/* --- Integrations Section --- */}
          <section className="pt-10 pb-20 w-full flex flex-col items-center text-center">
            <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono" dir="ltr">// Connect automatically to popular platforms</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#0D0F23]">Integrations</h2>

           <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20" dir="ltr">
  {[
    {
      name: "WordPress",
      image: "/wp.webp",
    },
    {
      name: "API",
      image: "/api.webp",
    },
    {
      name: "Google Search Console",
      image: "/google-console.png",
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="flex flex-col items-center justify-center gap-4"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-contain"
      />

      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#5B47FB]"></div>
        <span className="font-bold text-sm md:text-base text-[#0D0F23] text-center">
          {item.name}
        </span>
      </div>
    </div>
  ))}
</div>
          </section>

          {/* --- Articles Examples Section --- */}
          <section className="pt-10 pb-20 w-full flex flex-col items-center text-center">
            <p className="text-[#5B47FB] font-semibold mb-6 text-sm font-mono" dir="ltr">// Sample articles</p>
            <div className="w-full max-w-4xl h-[1px] bg-[#E4E5F0] mb-12 relative flex justify-center">
              <div className="absolute left-0 top-0 h-full bg-[#5B47FB] w-1/4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
               <ArticleCard
                 tag="Listicles"
                 title="Best CMS for SEO: 12 Top Platforms..."
                 description="Choosing the right content management system directly affects your site's SEO performance. In this article, we compare the available options..."
               />
               <ArticleCard
                 tag="Listicles"
                 title="10 Proven Strategies for Independent Developers..."
                 description="These practical strategies will help you engage your users, build a loyal audience, and more..."
               />
               <ArticleCard
                 tag="How-to Guide"
                 title="The Complete Guide to SEO with robots.txt"
                 description="Have you ever wondered how search engine crawlers decide which pages on your site to index?..."
               />
            </div>
          </section>
      <PricingSection />

          {/* --- Pricing Section --- */}
          <section className="pt-10 pb-20 w-full flex flex-col items-center text-center">
            <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono" dir="ltr">// Subscription pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#0D0F23]">The best ROI for your business</h2>

            <div className="border border-[#E4E5F0] rounded-xl bg-[#FAFAFE] shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
              {/* Right Column (Features Checklist) */}
              <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center items-center md:order-1 order-2 border-l border-[#E4E5F0]">
                 <div className="flex flex-col gap-6 text-left">
                   {[
                     'Fully automated setup—just enter your website URL and click "Start."',
                     'Seobut analyzes your target audience and keywords in detail.',
                     'Create a targeted content calendar and start publishing articles every week.',
                     'Approve, reject, or edit and customize articles before they’re published.',
                     'Build a network of internal links between your articles and key website pages.',
                     'Create articles up to 4,000 words, complete with AI-generated images, videos, tables, and more...',
                     'An intelligent fact-checking system that reduces hallucinations and cites credible sources.'
                   ].map((text, idx) => (
                     <div key={idx} className="flex items-start justify-start gap-3">
                       <span className="bg-[#EFEDFF] text-[#5B47FB] text-xs font-bold rounded-full flex items-center justify-center mt-1 min-w-[24px] h-[24px]">
                         ✓
                       </span>
                       <span className="text-[#3B3F5C] text-sm md:text-base leading-relaxed font-medium">{text}</span>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Left Column (Quote & Price) — the signature dark panel */}
              <div className="p-8 md:p-12 md:w-5/12 flex flex-col items-center text-center bg-[#0D0F23] md:order-2 order-1">
                <div className="flex-grow flex flex-col items-center">
                  <p className="text-[#C9CBDD] italic mb-4 leading-relaxed font-light">
                    Jon Rausch: “I created Seobut because I desperately needed a tool like this myself.
                  </p>
                  <p className="text-[#C9CBDD] italic mb-4 leading-relaxed font-light">
                    I currently use this system for 11 SaaS projects and 20 personal directories.
                  </p>
                  <p className="text-[#C9CBDD] italic mb-10 leading-relaxed font-light">
                    Our mission is to lead the way in AI assistants that create useful content for readers while driving organic traffic for founders. Our users have generated more than 600 million visits so far.”
                  </p>
                </div>
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-start justify-center mb-2" dir="ltr">
                    <span className="text-[#B08D57] mt-1 ml-1 text-lg font-bold">$</span>
                    <span className="text-6xl font-bold text-[#F6F6FB]">49</span>
                    <span className="self-end mb-2 mr-1 text-[#9A9DB8] text-sm font-semibold">/ month</span>
                  </div>
                  <p className="text-[#9A9DB8] text-xs md:text-sm mb-8 font-medium">Plans start at</p>
                  <button className="w-full max-w-xs bg-[#B08D57] hover:bg-[#9A7A49] text-white font-bold py-4 px-6 rounded transition-colors text-center shadow-md flex justify-center items-center gap-2">
                    Start growing your traffic <span>←</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- FAQ Section --- */}
          <section className="pt-10 pb-20 w-full max-w-3xl flex flex-col items-center text-center">
            <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono" dir="ltr">// Frequently asked questions</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0D0F23]">Have a question?</h2>
            <p className="text-[#0D0F23] mb-2 font-medium">
              Via <a href="#" className="underline hover:text-[#5B47FB] transition-colors">LinkedIn</a>,  <a href="#" className="underline hover:text-[#5B47FB] transition-colors">Twitter</a>, or <a href="#" className="underline hover:text-[#5B47FB] transition-colors">email</a> get in touch with me directly.
            </p>
            <p className="text-[#0D0F23] mb-10">
              Or find your answer in the FAQs below 👇
            </p>

            <div className="flex flex-col w-full">
               {faqData.map((faq, index) => (
                 <FaqAccordionItem
                   key={index}
                   index={index}
                   question={faq.q}
                   answer={faq.a}
                 />
               ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default LandingPage;