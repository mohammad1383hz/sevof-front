import { motion } from "framer-motion";
import { Twitter } from "lucide-react";

export default function TestimonialSpotlight() {
  return (
    <section className="py-20">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 rounded-xl2 border border-gray-100 bg-white p-8 shadow-card md:grid-cols-2 md:p-12"
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces"
                alt="Santiago Poli"
                loading="lazy"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold text-ink-900">Santiago Poli</div>
                <div className="text-xs text-gray-400">santiagopoli@</div>
              </div>
              <Twitter className="ml-auto h-5 w-5 text-gray-300" />
            </div>
            <p className="text-lg font-semibold leading-8 text-ink-900">
              John, I’ve got some great news for you!
            </p>
            <ul className="mt-5 space-y-2 text-gray-600">
              <li>1. We get 500 clicks a day</li>
              <li>2. Each article used to cost $1,000</li>
              <li>3. We landed a $6,500 client before officially launching the business</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl2">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=500&fit=crop"
              alt="Traffic growth chart"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
