/*
  این سکشن بر اساس ساختار واقعی پلن‌ها در SubscriptionPage.tsx ساخته شده:
  هر پلن = نام، قیمت، سقف توکن/مقاله/سایت + لیست فیچرهای اختصاصی.
  عددهای token_limit / article_limit / price اینجا نمونه‌ان — جایگزینشون
  کن با مقادیر واقعی پلن‌هات (همونایی که از subscriptionService.plans()
  میان). چیزی که واقعاً مهمه چیدمان و لحن مارکتینگیشه، نه خودِ عددها.
*/

const CheckBadge = () => (
  <span className="bg-[#EFEDFF] text-[#5B47FB] text-xs font-bold rounded-full flex items-center justify-center min-w-[22px] h-[22px] shrink-0">
    ✓
  </span>
);

interface PlanCardData {
  slug: "free" | "pro";
  name: string;
  tagline: string;
  price: number | null; // null => رایگان
  tokenLimit: number;
  articleLimit: number;
  siteLimit: number;
  features: string[];
  isPro?: boolean;
}

const plans: PlanCardData[] = [
  {
    slug: "free",
    name: "Free",
    tagline: "Try it out and see your first results",
    price: null,
    tokenLimit: 5000,
    articleLimit: 2,
    siteLimit: 1,
    features: ["AI-powered article generation", "Basic SEO analysis", "Automatic publishing to WordPress"],
  },
  {
    slug: "pro",
    name: "Pro",
    tagline: "For serious, scalable website growth",
    price: 1490000,
    tokenLimit: 100000,
    articleLimit: 30,
    siteLimit: 5,
    isPro: true,
    features: [
      "Full content creation automation",
      "Competitor analysis",
      "Keyword analysis",
      "AI image generation",
      "Schedule article publishing",
      "Faster content generation",
      "Priority support",
    ],
  },
];

const formatToman = (n: number) => n.toLocaleString("en-US");

const PricingSection = () => {
  return (
    <div className="min-h-screen bg-[#F3F2FB] flex items-center justify-center px-6 py-20">
      <section className="pt-10 pb-10 w-full flex flex-col items-center text-center max-w-5xl">
        <p className="text-[#5B47FB] font-semibold mb-4 text-sm font-mono" dir="ltr">
          // Subscription plans
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0D0F23]">
          Choose the plan that helps your website grow
        </h2>
        <p className="text-[#0D0F23] text-lg leading-relaxed max-w-2xl mb-14">
          Create SEO-optimized articles with AI and publish them automatically to WordPress. Change or cancel your plan anytime, with no commitment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`relative flex flex-col text-start rounded-xl p-8 md:p-10 bg-[#FAFAFE] transition-all ${
                plan.isPro
                  ? "border-2 border-[#5B47FB] shadow-lg"
                  : "border border-[#E4E5F0]"
              }`}
            >
              {plan.isPro && (
                <span className="absolute -top-3 start-8 bg-[#EDE3CF] text-[#8A6A2F] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Recommended
                </span>
              )}

              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-xl font-bold text-[#0D0F23]">{plan.name}</h3>
              </div>
              <p className="text-[#0D0F23] text-sm mb-6">{plan.tagline}</p>

              <div className="mb-7">
                {plan.price === null ? (
                  <span className="text-3xl font-bold text-[#0D0F23]">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1.5" dir="ltr">
                    <span className="text-3xl font-bold text-[#0D0F23]">
                      {formatToman(plan.price)}
                    </span>
                    <span className="text-[#9A9DB8] text-sm font-semibold">
                      Toman / month
                    </span>
                  </div>
                )}
              </div>

              {/* سقف‌های اصلی پلن، مثل چیپ‌های امکانات بخش Features */}
              <div className="flex flex-wrap gap-2 mb-7">
                <span className="border border-[#E4E5F0] bg-[#F3F2FB] text-[#3B3F5C] text-xs font-bold px-3 py-1.5 rounded">
                  {formatToman(plan.tokenLimit)} monthly tokens
                </span>
                <span className="border border-[#E4E5F0] bg-[#F3F2FB] text-[#3B3F5C] text-xs font-bold px-3 py-1.5 rounded">
                  {formatToman(plan.articleLimit)} articles per month
                </span>
                <span className="border border-[#E4E5F0] bg-[#F3F2FB] text-[#3B3F5C] text-xs font-bold px-3 py-1.5 rounded">
                  {formatToman(plan.siteLimit)} connected sites
                </span>
              </div>

              <div className="flex flex-col gap-3 mb-8 flex-grow">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckBadge />
                    <span className="text-[#3B3F5C] text-sm font-medium leading-relaxed">
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3.5 rounded font-bold text-sm transition-colors ${
                  plan.isPro
                    ? "bg-[#5B47FB] hover:bg-[#4935E0] text-white shadow-md"
                    : "border border-[#E4E5F0] text-[#0D0F23] hover:bg-[#F6F6FB]"
                }`}
              >
                {plan.isPro ? "Start Pro subscription" : "Get started free"}
              </button>

              {plan.isPro && (
                <p className="text-[#9A9DB8] text-xs font-medium mt-3 text-center">
                  If you’re not satisfied after your first article, we’ll refund you in full.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* نوار اعتماد/سوشال‌پروف پایین کارت‌ها — پنل تیره‌ی امضادار سایت */}
        <div className="mt-10 w-full bg-[#0D0F23] rounded-xl px-8 py-7 flex flex-col md:flex-row items-center md:items-start gap-5 text-start">
          <p className="text-[#C9CBDD] italic leading-relaxed font-light text-sm md:text-base">
            Jan Rausch: “I built Seobot because I desperately needed a tool like this myself. I now use the same system for 11 SaaS projects and 20 personal directories. Our users have received over 600 million visits so far.”
          </p>
        </div>
      </section>
    </div>
  );
};

export default PricingSection;