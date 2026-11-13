const steps = [
  {
    title: "It analyzes your website and competitors first",
    desc: (
      <>
        Before writing each article,{" "}
        <strong className="text-[#0D0F23] font-semibold">
          it analyzes your website, existing content, and competitors
        </strong>{" "}
        to find important topics and new opportunities to grow your SEO.
      </>
    ),
  },
  {
    title: "It creates content tailored to your website",
    desc: (
      <>
        Each article is written based on{" "}
        <strong className="text-[#0D0F23] font-semibold">
          your industry, website content, and what people are searching for
        </strong>{" "}
        —not recycled text.
      </>
    ),
  },
  {
    title: "You decide when to publish",
    desc: (
      <>
        Before publishing, you can{" "}
        <strong className="text-[#0D0F23] font-semibold">
          read, edit, or approve the article
        </strong>
        —or leave publishing entirely to Seobot.
      </>
    ),
  },
  {
    title: "Every article is written to deliver results",
    desc: (
      <>
        Content is created with{" "}
        <strong className="text-[#0D0F23] font-semibold">
          SEO best practices and internal linking
        </strong>{" "}
        and{" "}
        <strong className="text-[#0D0F23] font-semibold">
          user search intent
        </strong>{" "}
        in mind to help your site’s pages get discovered.
      </>
    ),
  },
];
const HowItWorksSection = () => {
  return (
    <div
      className="min-h-screen bg-[#F3F2FB] text-[#0D0F23] flex items-center justify-center px-6 py-20"
    >
      <section className="pt-10 pb-10 w-full flex flex-col items-center text-center max-w-6xl">
     <p
  className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono"
>
  // How does Youtix Seobot work?
</p>

<h2 className="text-3xl md:text-4xl font-bold mb-5 text-[#0D0F23]">
  From site analysis to content publishing, it’s all one seamless process
</h2>



<p className="text-[#0D0F23] text-lg leading-relaxed max-w-3xl mb-16">
  Before writing each article, Seobot analyzes your site and competitors, finds relevant topics, and creates content designed to grow your site’s SEO.
</p>
        {/*
          Timeline treatment: reuses the exact divider language already
          established in the "Articles Examples" section (hairline +
          teal accent segment), instead of introducing a new icon-card
          pattern. Numbering here is justified because the content really
          is a 4-step process, not decorative.
        */}
        <div className="w-full max-w-5xl">
          <div className="relative">
            {/* full-width hairline, desktop only */}
            <div className="hidden md:block absolute top-6 start-0 end-0 h-[1px] bg-[#E4E5F0]" />
            {/* teal accent segment, echoes the divider in "نمونه مقالات" */}
            <div className="hidden md:block absolute top-6 start-0 h-[1px] w-1/2 bg-[#5B47FB]" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-8">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* vertical connector for mobile stacked layout */}
                  {idx !== 0 && (
                    <div className="md:hidden absolute -top-8 h-8 w-[1px] bg-[#E4E5F0]" />
                  )}

                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#F3F2FB] border border-[#5B47FB] text-[#5B47FB] font-mono text-sm font-bold flex items-center justify-center mb-6">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <h3 className="text-lg font-bold text-[#0D0F23] mb-3 max-w-[240px]">
                    {step.title}
                  </h3>

                  <p className="text-[#0D0F23] text-sm leading-7 max-w-[260px]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksSection;