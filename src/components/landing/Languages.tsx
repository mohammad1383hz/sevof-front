import { motion } from "framer-motion";
import { Languages as LanguagesIcon } from "lucide-react";

const languages = [
  "Arabic", "Basque", "Bengali", "Bulgarian", "Catalan", "Chinese", "Croatian", "Czech",
  "Danish", "Dutch", "English", "Estonian", "Finnish", "French", "Galician",
  "German", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Italian", "Japanese",
  "Korean", "Latvian", "Portuguese", "Russian", "Spanish", "Swedish", "Turkish",
  "Ukrainian", "Persian",
];

export default function Languages() {
  return (
    <section className="py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <LanguagesIcon className="h-4 w-4" />
            Supported Languages
          </span>
          <h2 className="section-title">Seobot supports more than 50 languages</h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3"
        >
          {languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-brand-400 hover:text-brand-600"
            >
              {lang}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
