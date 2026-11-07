import { plural } from "../../plural";

const billing = {
  "hero": {
    "title": "Pick the plan that fits your growth",
    "subtitle": "SEO articles, automatic publishing to WordPress and Shopify, and product page fixes for your store."
  },
  "price": {
    "free": "Free",
    "currency": "USD",
    "amount": "{amount}"
  },
  "plans": {
    "alwaysFree": "Free forever",
    "perMonth": "per month",
    "credits": "credits",
    "popular": "Most popular",
    "newBadge": "New",
    "choose": "Choose plan",
    "paidArticles": "articles with Sevof 2 Pro",
    "free": {
      "articles": "full article with Sevof Mini",
      "cta": "Start for free",
      "tagline": "Try it out, no payment needed"
    },
    "pro": {
      "cta": "Get Pro",
      "tagline": "For sites that want to grow steadily"
    },
    "proPlus": {
      "cta": "Get Pro+",
      "tagline": "The complete plan for sites and stores"
    },
    "features": {
      "editor": "Full access to the Sevof editor",
      "initialAnalysis": "First analysis of your site and competitors",
      "oneArticle": "1 SEO-optimized AI article",
      "preview": "Preview every article before it goes live",
      "automation": "Hands-free content autopilot",
      "multiImage": "Several images per article",
      "api": "Developer API",
      "imageModels": "Create and edit images with multiple AI models",
      "wpPublish": "Publish straight to WordPress or Shopify",
      "duplicates": "Duplicate-idea detection",
      "internalLinks": "Smart internal linking",
      "advancedLinks": "Advanced internal linking",
      "priority": "Priority article processing",
      "customHtml": "Custom HTML that matches your site",
      "productSeo": "Product SEO",
      "productFixes": "Find and fix product page issues",
      "productArticles": "SEO articles for your products",
      "allPro": "Everything in Pro"
    },
    "creditsForMonths": "credits for all {months} months",
    "notes": {
      "tryFew": "a few products to try",
      "upTo100": "up to 100 products per run"
    }
  },
  "cta": {
    "activating": "Activating…",
    "queued": "Queued — starts next",
    "otherQueued": "Another plan is queued",
    "alreadyUsed": "Already used",
    "unavailable": "Not available",
    "renew": "Renew this plan",
    "getFree": "Get it free",
    "buyPeriod": "Buy {period}"
  },
  "badges": {
    "current": "Your plan",
    "next": "Up next",
    "percentOff": "{percent} off"
  },
  "hints": {
    "queued": "You've already bought this plan. It starts automatically when your current plan ends.",
    "otherQueued": "You already have a plan waiting to start. You can buy another one once it's active.",
    "freeUsed": "You've already used the free plan. Pick a paid plan to keep going.",
    "freeDowngrade": "You can switch to the free plan once your paid subscription ends.",
    "renew": "Buying this plan again renews it automatically when your current period ends."
  },
  "usage": {
    "remaining": "credits left ({percent} used)",
    "until": "until {date}"
  },
  "lowCredit": {
    "title": "You're running low on credits",
    "body": "Only {percent} of your plan's credits are left. Pick your next plan now and it will kick in the moment this one runs out — no interruptions.",
    "cta": "Choose my next plan"
  },
  "queued": {
    "withCredits": "Your {plan} plan ({credits} credits) is paid for and reserved. It starts automatically when your current plan ends — by date or by credits — and the credits are added to your account then. Nothing else to do.",
    "noCredits": "Your {plan} plan is paid for and reserved. It starts automatically when your current plan ends — by date or by credits. Nothing else to do."
  },
  "faq": {
    "title": "Frequently asked questions",
    "subtitle": "Everything worth knowing before you start",
    "q1": "How is Sevof different from ChatGPT and other AI tools?",
    "a1": "General-purpose models like ChatGPT are built to do a bit of everything, not SEO specifically. Sevof is a dedicated SEO agent: it analyzes your site, writes and optimizes content in your site's language, and runs the whole SEO workflow for you.",
    "q2": "Is auto-publishing safe for my site?",
    "a2": "Yes. Connections are encrypted: the WordPress plugin can only reach the publishing side of your site, and the Shopify app only asks for blog, product and file permissions — nothing else.",
    "q3": "What are credits and how do they work?",
    "a3": "Each article uses a number of credits based on its length and the AI model you pick. An article written with Sevof Mini costs fewer credits than one written with Sevof 2 Pro, so you decide whether to go for more articles or higher quality within your budget.",
    "qProducts": "What exactly does product SEO do for my store?",
    "aProducts": "Sevof checks every product page in your WooCommerce or Shopify store and finds its SEO gaps — a missing description, image alt text, meta description, FAQ and more. It writes the missing copy, you review it, and with one click it's published to your store.",
    "qPlatforms": "Does it only work with WordPress?",
    "aPlatforms": "No. Sevof works with any website for analysis and writing. Automatic publishing is available for WordPress (with our plugin) and Shopify today, with Wix, Webflow and Notion coming next."
  },
  "discountModal": {
    "title": "Have a discount code?",
    "body": "There's an active discount code on your account. Apply it to the {plan} plan, or head straight to checkout.",
    "placeholder": "Discount code",
    "apply": "Apply",
    "applied": "Discount applied",
    "planPrice": "{plan} plan price",
    "finalNote": "Your final price, with the discount, is calculated at checkout.",
    "toPayment": "Continue to payment",
    "redirecting": "Redirecting…",
    "required": "Please enter a discount code.",
    "invalid": "That discount code isn't valid."
  },
  "success": {
    "activated": "Your subscription is now active."
  },
  "errors": {
    "load": "We couldn't load your subscription details.",
    "purchase": "The purchase didn't go through.",
    "purchaseRetry": "The purchase didn't go through. Please try again.",
    "alreadyOnPlan": "You're already on this plan."
  },
  "payment": {
    "successTitle": "Payment successful",
    "successBody": "Your subscription is active and ready to go.",
    "failedTitle": "Payment didn't go through",
    "failedBody": "The transaction wasn't completed, so you haven't been charged.",
    "unknownTitle": "We couldn't confirm your payment",
    "unknownBody": "We didn't get enough details back to show the result.",
    "reference": "Reference number",
    "toDashboard": "Go to dashboard",
    "tryAgain": "Try again",
    "backToDashboard": "Back to dashboard",
    "checking": "Confirming your payment…",
    "cancelled": "You cancelled the checkout. You haven't been charged."
  },
  "upgrade": {
    "freeTitle": "You've used up your free credits",
    "paidTitle": "Not enough credits",
    "freeBody": "Choose a plan to keep going.",
    "paidBody": "You don't have enough credits for this. Top up or upgrade your plan.",
    "unlockTitle": "Subscribe and unlock:",
    "subscribe": "See plans",
    "addCredits": "Top up or upgrade",
    "later": "Maybe later",
    "features": {
      "automation": "Let autopilot do the busywork for you",
      "images": "Create and edit images with multiple AI models",
      "wordpress": "Publish articles straight to WordPress",
      "duplicates": "Never end up with duplicate ideas",
      "links": "Smart internal links between your articles",
      "priority": "Your articles jump the queue"
    }
  },
  "discount": {
    "offJustForYou": "{percent} off — just for you",
    "fifteenMinutes": "Your personal code is valid for the next 15 minutes only.",
    "copied": "Code copied ✓",
    "timeLeft": "{time} left"
  },
  "exitSurvey": {
    "title": "Before you go…",
    "question": "Mind telling us the main reason you didn't subscribe?",
    "reasons": {
      "price": "It's too expensive for me",
      "quality": "I'm not convinced about the quality yet",
      "noWebsite": "I don't have a website yet, or don't need one right now",
      "other": "Something else"
    },
    "offerTitle": "We've got a special offer for you",
    "offerBody": "Since price is the issue, we've unlocked an exclusive {percent} discount for you.",
    "stay": "Claim my discount",
    "leave": "No thanks, I'll leave"
  },
  "groups": {
    "content": "Content creation",
    "product": "Store product SEO"
  },
  "period": {
    "label": "Billing period",
    "monthly": "Monthly",
    "months": "{months} months",
    "upTo": "up to {percent} off",
    "noCommitment": "No commitment",
    "popular": "Most popular",
    "payOnce": "Pay {amount} once for {months} months",
    "saving": "You save {amount}"
  },
  "productSeo": {
    "title": "We find and fix the issues on your product pages",
    "body": "Product pages without a description, optimized images and meta tags don't show up on Google. Sevof finds what each product is missing and fixes it.",
    "sampleProduct": "Men's running shoe",
    "published": "Published",
    "issues": plural({"one":"{count} issue","other":"{count} issues"}),
    "caption": "A sample product, before and after the fix",
    "whatFixed": "What gets checked and fixed?",
    "approval": "Nothing is published on your store without your approval.",
    "step1Title": "Pick your products",
    "step1Text": "Choose the products from your WooCommerce or Shopify store that you want checked.",
    "step2Title": "See the issues",
    "step2Text": "Sevof checks every product page and tells you exactly what's missing.",
    "step3Title": "Fix them in one click",
    "step3Text": "Review the suggested copy, edit it if you like, and publish it straight to your store.",
    "sample": {
      "shortBefore": "No short description",
      "shortAfter": "Short description written",
      "altBefore": "Image alt text is empty",
      "altAfter": "Image alt text written",
      "metaBefore": "No meta description",
      "metaAfter": "Meta description added",
      "faqBefore": "No FAQ",
      "faqAfter": "FAQ added"
    }
  },
  "referral": {
    "title": "Earn by referring Sevof",
    "body": "Have a page, channel, website or clients? Recommend Sevof and earn from your referrals. Send a partnership request and we'll get in touch.",
    "cta": "Request partnership"
  }
};

export default billing;
