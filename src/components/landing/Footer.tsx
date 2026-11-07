import { Bot, Mail, Twitter } from "lucide-react";

const columns = [
  {
    title: "Contact the Founders",
    links: [
      { label: "support@seobotai.com", icon: Mail },
      { label: "x.com/johnrushx", icon: Twitter },
      { label: "x.com/vitalik_may", icon: Twitter },
      { label: "x.com/seobotai", icon: Twitter },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Affiliate Program" },
      { label: "Knowledge Base" },
      { label: "Blog" },
      { label: "News" },
      { label: "AI SEO Agent" },
      { label: "Free Tools" },
    ],
  },
  {
    title: "API & Integrations",
    links: [
      { label: "REST API" },
      { label: "Next.js Integration" },
      { label: "Webhooks" },
      { label: "Unicorn Platform" },
      { label: "WordPress" },
      { label: "Webflow" },
      { label: "Shopify" },
      { label: "Ghost" },
      { label: "HubSpot" },
    ],
  },
  {
    title: "The World of Mars",
    links: [
      { label: "John Rush" },
      { label: "MarsX" },
      { label: "Unicorn Platform" },
      { label: "Marketsy AI" },
      { label: "Flout UI" },
      { label: "DoHunt" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 pt-16 text-gray-400">
      <div className="container-app">
        <div className="flex items-center gap-2 border-b border-white/10 pb-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink-900">
            <Bot className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold text-white">Seobot</span>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold text-white">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                    >
                      {"icon" in link && link.icon ? (
                        <link.icon className="h-3.5 w-3.5" />
                      ) : null}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs sm:flex-row">
          <span>© 2025 Seobot. All rights reserved.</span>
          <span>Built with Unicorn Platform</span>
        </div>
      </div>
    </footer>
  );
}
