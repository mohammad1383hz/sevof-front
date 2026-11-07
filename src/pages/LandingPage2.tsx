import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import WhyChoose from "../components/landing/WhyChoose";
import Features from "../components/landing/Features";
import TestimonialSpotlight from "../components/landing/TestimonialSpotlight";
import Integrations from "../components/landing/Integrations";
import Languages from "../components/landing/Languages";
import ArticlesExamples from "../components/landing/ArticlesExamples";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div dir="ltr" className="overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Stats />
        <WhyChoose />
        <Features />
        <TestimonialSpotlight />
        <Integrations />
        <Languages />
        <ArticlesExamples />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
