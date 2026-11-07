import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Menu, X, ArrowUpLeft } from "lucide-react";

const navLinks = [
  { label: "Refer a Friend & Earn", href: "#refer" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container-app flex h-20 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
            <Bot className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold">Seobot</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink-700 transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#cta" className="btn-primary">
            Try it now
            <ArrowUpLeft className="h-4 w-4" />
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 md:hidden"
          >
            <div className="container-app flex flex-col gap-4 py-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-ink-700"
                >
                  {link.label}
                </a>
              ))}
              <a href="#cta" className="btn-primary w-full">
                Try it now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
