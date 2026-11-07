import { plural } from "../../plural";

const product = {
  "clearSearch": "Clear search",
  "errors": {
    "server": "We couldn't reach the server. Please try again.",
    "serverShort": "We couldn't reach the server."
  },
  "styles": {
    "price": "Price & budget",
    "comparison": "Product comparison",
    "buying_guide": "Buying guide"
  },
  "steps": {
    "brief": "Analysis & brief",
    "briefHint": "Studying products and audience",
    "plan": "Planning",
    "planHint": "Matching products to sections",
    "sections": "Writing",
    "sectionsHint": "One section at a time",
    "written": "{done} of {total} sections written"
  },
  "idea": {
    "internalLink": "Internal link",
    "viewProgress": "See progress",
    "generated": "Article ready",
    "failed": "Writing failed",
    "viewRetry": "View & retry",
    "paused": "Paused (out of credits)"
  },
  "outline": {
    "title": "Article outline",
    "building": "Building the outline…",
    "approxWords": "≈ {count} words",
    "written": "{done} of {total} written",
    "untitled": "Untitled",
    "target": "Target: {count} words",
    "keyPoints": "Key points",
    "types": {
      "product": "Product spotlight",
      "products": "Product spotlights",
      "comparison": "Comparison",
      "buyingGuide": "Buying guide",
      "guide": "Guide"
    }
  },
  "editIdea": {
    "subtitle": "Set the article's title, products and internal link.",
    "titleHint": "Put the main keyword at the start. Titles under {max} characters show in full on Google.",
    "products": "Products in this article",
    "needProduct": "Add at least one product.",
    "removeProduct": "Remove {name}",
    "changeProducts": "Add or change products",
    "link": "Internal link",
    "linkHint": "The article will link to this store page — ideally the main category of those products.",
    "categoriesError": "We couldn't load your categories, so the current link stays as it is.",
    "missingCategory": "The category behind the current link no longer exists. Please pick another.",
    "pickTitle": "Choose products for the article",
    "pickSubtitle": "The products this article will feature.",
    "pickConfirm": "Use these products"
  },
  "category": {
    "filterPrefix": "Category:",
    "linkPrefix": "Links to:",
    "all": "All categories",
    "home": "Store homepage",
    "filterNote": "Picking a category includes the products in its subcategories too.",
    "linkNote": "The article will link to this page.",
    "none": "No categories",
    "select": "Choose a category",
    "search": "Search categories",
    "searchPlaceholder": "Search categories…",
    "empty": "No categories found",
    "emptyHint": "Try a different search.",
    "collapse": "Hide subcategories",
    "expand": "Show subcategories",
    "removeFilter": "Remove category filter",
    "backHome": "Back to store homepage"
  },
  "picker": {
    "loadFailed": "We couldn't load your products.",
    "addFailed": "We couldn't add this product.",
    "alreadySelected": "This product is already selected.",
    "addedAtLimit": "The product was added, but you've hit the selection limit. Remove one, then pick this product from the list.",
    "existingSelected": "This product was already in your catalog — it's now selected.",
    "addedSelected": "Product added and selected.",
    "manualTitle": "Add a product by URL",
    "manualHint": "Can't find a product? Paste its page URL to add and select it.",
    "manualBody": "Copy the product's page URL from your store and paste it here. We'll pull in the details and select it for you.",
    "closeManual": "Close",
    "url": "Product URL",
    "add": "Add",
    "search": "Search products",
    "searchPlaceholder": "Search by product name…",
    "selected": "Selected products",
    "limit": "limit reached",
    "count": "{count} of {max} selected",
    "clear": "Clear",
    "empty": "No products found",
    "emptyHint": "Try another search or category.",
    "more": "Load more products"
  },
  "modal": {
    "title": "Choose how your product article is written",
    "imageModel": "Featured image model",
    "featuredImage": "Featured image",
    "articlePromptPlaceholder": "e.g. Focus on the product's benefits, keep it conversational, and add an FAQ at the end",
    "imagePromptPlaceholder": "e.g. The product on a wooden table in soft morning light"
  },
  "body": {
    "saveFailed": "We couldn't save.",
    "product": "Product",
    "productNumber": "Product #{id}",
    "inStock": "In stock",
    "outOfStock": "Out of stock",
    "viewProduct": "View & buy",
    "recommended": "Recommended products",
    "seoScore": "SEO score: {score}",
    "writingSection": "Writing this section…",
    "noContent": "Nothing written yet.",
    "schema": "Product schema"
  },
  "seo": {
    "defaultPrompt": "Suggest SEO article ideas and recommend products, based on the store's best-selling products and main categories.",
    "manualPrompt": "Suggest SEO article ideas for the products I selected.",
    "benefits": {
      "introTitle": "Show off your products",
      "introText": "Articles that introduce your products to shoppers.",
      "googleTitle": "Get found on Google",
      "googleText": "Bring more shoppers to your store from search.",
      "salesTitle": "Sell more",
      "salesText": "Turn readers into customers, effortlessly."
    },
    "heroTitle": "Articles that sell {store}'s products",
    "yourStore": "your store",
    "heroBody": "This tool suggests and writes articles around your store's products — articles that introduce them, bring shoppers in from Google and help you sell more.",
    "working": "I'm going through your products and coming up with ideas. This usually takes less than a minute.",
    "editIdea": "Edit idea (title, products, internal link)",
    "backToIdeas": "Back to ideas",
    "selectionMethod": "How to pick products",
    "auto": "Pick for me",
    "manual": "Choose products",
    "autoHint": "We'll pick the best products for you.",
    "manualHint": "Ideas will only cover the products you pick.",
    "requestAria": "Ask for article ideas",
    "placeholderManual": "Optional: what angle should the articles take?",
    "placeholderAuto": "What kind of article do you want? (Leave it empty and I'll suggest one)",
    "generate": "Get ideas",
    "keyHint": "Enter to send · Shift+Enter for a new line",
    "pickTitle": "Choose products for your ideas",
    "pickSubtitle": "Article ideas will be created only for the products you pick here.",
    "pickConfirm": "Confirm",
    "selectedCount": plural({"one":"{count} product selected","other":"{count} products selected"}),
    "requestIn": "Got it — your ideas are on the way.",
    "errors": {
      "slow": "Ideas are taking longer than usual. Please try again.",
      "open": "We couldn't open this chat.",
      "create": "We couldn't start a new chat."
    }
  },
  "page": {
    "preparing": "Getting your product article ready…"
  }
};

export default product;
