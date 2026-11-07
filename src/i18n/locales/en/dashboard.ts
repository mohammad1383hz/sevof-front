const dashboard = {
  "view": "View",
  "noResults": "Nothing matches your search.",
  "page": {
    "title": "Articles dashboard",
    "subtitle": "What your AI agent is doing on this site",
    "noSiteTitle": "No site added yet",
    "noSiteBody": "Add a site to see its ideas, articles and Autopilot activity."
  },
  "errors": {
    "load": "We couldn't load the dashboard.",
    "network": "Network problem — the dashboard couldn't load.",
    "autopilot": "We couldn't update Autopilot.",
    "ideas": "Something went wrong while generating ideas.",
    "invalidSite": "This site link isn't valid.",
    "ideasLoad": "We couldn't load the content ideas.",
    "writtenLoad": "We couldn't load the written articles.",
    "publishedLoad": "We couldn't load the published articles.",
    "keywordsLoad": "We couldn't load the keywords."
  },
  "articleStatus": {
    "completed": "Completed",
    "failed": "Failed",
    "pending": "Queued",
    "generating": "Writing…"
  },
  "ideaStatus": {
    "approved": "Approved",
    "rejected": "Rejected",
    "used": "Used",
    "recommended": "Suggested"
  },
  "publishStatus": {
    "published": "Published",
    "draft": "Draft",
    "failed": "Failed"
  },
  "stats": {
    "totalArticles": "Total articles",
    "published": "Published",
    "generating": "In progress",
    "failed": "Failed",
    "avgSeo": "Avg. SEO score",
    "totalWords": "Words written"
  },
  "recent": {
    "title": "Latest articles",
    "empty": "No articles yet.",
    "publishedOn": "Published {date}"
  },
  "connection": {
    "checking": "Checking your site connection…",
    "switchBack": "Switch back to {platform}",
    "connectVia": "Connect with {platform} instead",
    "apiTitle": "Connect with the public API",
    "apiBody": "Create and read articles from your own app, even without WordPress or Shopify. Full docs, code samples and API key guide.",
    "docs": "Docs",
    "platform": "Publishing platform",
    "comingSoon": "Coming soon",
    "soon": "soon"
  },
  "opportunities": {
    "title": "New opportunities",
    "discovering": "Looking…",
    "discover": "Find new opportunities",
    "empty": "No opportunities yet. Hit “Find new opportunities” to get started.",
    "generatedHint": "Article ready — you'll find it in your Articles list",
    "generated": "Written",
    "generate": "Write article",
    "keywords": "Keywords found",
    "entities": "Topics identified"
  },
  "opportunitiesPage": {
    "title": "Content opportunities",
    "subtitle": "Article ideas picked for your site",
    "topic": "Topic",
    "entity": "Main entity",
    "competitor": "Competitors",
    "search": "Search topics or entities…",
    "empty": "No content ideas yet."
  },
  "gap": {
    "uncovered": "Not covered yet",
    "covered": "Already covered",
    "reviewing": "Checking"
  },
  "columns": {
    "title": "Article title",
    "keyword": "Target keyword",
    "words": "Words",
    "status": "Status",
    "publishStatus": "Publishing status",
    "date": "Date",
    "url": "Live URL"
  },
  "written": {
    "title": "Written articles",
    "subtitle": "Everything Autopilot has written for your site so far",
    "empty": "No articles written yet."
  },
  "published": {
    "title": "Published articles",
    "subtitleShort": "Every publishing attempt by your agent",
    "subtitle": "Every publishing attempt by your agent — published, saved as draft, or failed",
    "empty": "Nothing has been published yet.",
    "errorDetails": "Show error details"
  },
  "keywords": {
    "title": "Keywords",
    "subtitle": "Keywords Autopilot found for your site",
    "keyword": "Keyword",
    "primary": "Main",
    "difficulty": "Difficulty",
    "analyzing": "We're analyzing your site to find keywords. This can take a moment…",
    "empty": "No keywords found yet."
  },
  "difficulty": {
    "Low": "Easy",
    "Medium": "Medium",
    "High": "Hard",
    "Unknown": "Unknown"
  },
  "agent": {
    "status": {
      "idle": "Idle",
      "working": "Working",
      "generatingIdeas": "Coming up with ideas",
      "writing": "Writing an article",
      "waitingIdeas": "Waiting for scored ideas",
      "dailyLimit": "Daily limit reached",
      "needsAnalysis": "Site analysis needed first",
      "unknown": "Unknown"
    },
    "features": {
      "research": "Competitor and keyword research",
      "daily": "Fresh ideas and articles every day",
      "autoPublish": "Automatic publishing",
      "scheduling": "Smart scheduling",
      "wordpress": "One-click WordPress publishing"
    },
    "pipeline": {
      "badge": "Content pipeline",
      "intro": "Autopilot runs these four steps back to back — no work needed on your side.",
      "keywordsTitle": "Find keywords",
      "keywordsDesc": "Scans your site and finds the keywords that matter",
      "ideasTitle": "Plan ideas",
      "ideasDesc": "Turns every opportunity into an article idea",
      "writeTitle": "Write articles",
      "writeDesc": "Writes complete, SEO-optimized articles",
      "publishTitle": "Publish",
      "publishDesc": "Publishes the articles to your WordPress site"
    },
    "stats": {
      "keywords": "Keywords found",
      "opportunities": "Opportunities found",
      "written": "Articles written",
      "published": "Articles published"
    },
    "locked": {
      "badge": "Pro feature",
      "title": "Put your SEO on autopilot with Pro",
      "body": "Watches your site 24/7, researches competitors and keywords, then writes and publishes SEO-optimized articles for you.",
      "cta": "Upgrade to Pro"
    },
    "enableTitle": "Turn on Autopilot",
    "enable": "Turn on",
    "enabling": "Turning on…",
    "onTitle": "Autopilot is on",
    "settings": "Settings"
  },
  "settings": {
    "title": "Autopilot settings",
    "publishStatus": "When an article is ready",
    "publishHint": "Articles go live as soon as they're written.",
    "draftHint": "Articles wait as drafts until you review and publish them.",
    "publishOptions": {
      "draft": "Save as draft",
      "publish": "Publish automatically"
    },
    "perCycle": "Articles per run",
    "perCycleHint": "How many articles are written each run.",
    "schedule": "How often",
    "scheduleHint": "How often should Autopilot run?",
    "customInterval": "Every how many days",
    "customIntervalHint": "For example, 5 means once every 5 days.",
    "startTime": "Start time",
    "startTimeHint": "Autopilot starts working at this time of day.",
    "sectionCount": "Article length",
    "sectionCountHint": "Sets the overall structure of each article.",
    "sections": {
      "short": "6–8 sections (short)",
      "medium": "8–10 sections (medium)",
      "long": "10–12 sections (long)"
    },
    "intervalOptions": {
      "d1": "Every day",
      "d2": "Every other day",
      "d3": "Every 3 days",
      "d7": "Once a week",
      "custom": "Custom"
    },
    "interval": {
      "everyDay": "every day",
      "everyOtherDay": "every other day",
      "everyWeek": "once a week",
      "everyNDays": "every {days} days"
    },
    "preview": {
      "short": "Your schedule: {count} articles {interval}",
      "publish": "Autopilot starts at {time} and, {interval}, writes {count} articles and publishes them automatically.",
      "draft": "Autopilot starts at {time} and, {interval}, writes {count} articles and saves them as drafts for you to review.",
      "publishWithImages": "Autopilot starts at {time} and, {interval}, writes {count} articles with {images} images each and publishes them automatically.",
      "draftWithImages": "Autopilot starts at {time} and, {interval}, writes {count} articles with {images} images each and saves them as drafts for you to review."
    },
    "articleModel": "Writing model",
    "imagesTitle": "Images for your articles",
    "imageModel": "Image model",
    "imagesPerArticle": "Images per article",
    "perImage": "per image",
    "perArticle": "per article",
    "credits": "{count} credits",
    "recommended": "Recommended",
    "decrease": "Decrease",
    "increase": "Increase",
    "advanced": "Advanced",
    "advancedHint": "Your own instructions for articles and images (optional)",
    "articlePrompt": "Article instructions",
    "articlePromptHint": "Leave empty and articles are written the usual way.",
    "articlePromptPlaceholder": "e.g. A friendly, casual tone for beginners",
    "imagePrompt": "Featured image instructions",
    "imagePromptHint": "Leave empty and the prompt is created from the article.",
    "imagePromptPlaceholder": "e.g. Warm colors, no text on the image",
    "summary": "At a glance",
    "save": "Save settings"
  },
  "wp": {
    "title": "WordPress connection",
    "subtitle": "Publish articles straight to your WordPress site",
    "status": {
      "connected": "Connected",
      "pending": "Waiting for setup",
      "disconnected": "Not connected"
    },
    "health": {
      "healthy": "Healthy",
      "unhealthy": "Error",
      "unreachable": "Unreachable"
    },
    "verified": "Listed on WordPress.org",
    "shownOnce": "Shown only once",
    "copy": "Copy {label}",
    "downloadLatest": "Download the latest plugin",
    "plugin": "WordPress plugin",
    "pluginBody": "Install the plugin on your site. Once it's connected, articles are written and published for you.",
    "download": "Download plugin",
    "credentials": {
      "title": "Your connection details",
      "body": "Paste these three values into the plugin settings on your site — that's all it takes to start publishing automatically.",
      "warning": "Once you close this window, the Client Secret won't be shown again. If you lose it, use “Reconnect” to get new details.",
      "done": "I've saved them"
    },
    "checking": "Checking connection…",
    "empty": "No WordPress site connected yet",
    "emptyBody": "Connecting gives you a Client ID and Client Secret to enter in the WordPress plugin on your site.",
    "connect": "Connect WordPress",
    "waiting": "Waiting for the WordPress plugin to connect",
    "waitingBody": "Enter your Client ID, API Key and Client Secret in the plugin settings to finish. Lost them? Click “Reconnect” to get new ones.",
    "check": "Check connection",
    "newCredentials": "Get new credentials",
    "siteUrl": "Site URL",
    "versions": "WordPress / plugin version",
    "pluginVersion": "plugin {version}",
    "healthTitle": "Health",
    "lastCheck": "Last checked",
    "test": "Test connection",
    "reconnect": "Reconnect",
    "disconnect": "Disconnect",
    "disconnected": "WordPress disconnected",
    "testOk": "All good — your WordPress site is reachable.",
    "testBad": "Your WordPress site didn't respond as expected.",
    "confirmReconnectTitle": "Create new connection details?",
    "confirmReconnectBody": "Your current details will stop working, and you'll need to enter the new ones in the WordPress plugin.",
    "confirmDisconnectTitle": "Disconnect WordPress?",
    "confirmDisconnectBody": "Articles will no longer be published to this site automatically. You'll need to set the connection up again to reconnect.",
    "errors": {
      "load": "We couldn't check your WordPress connection.",
      "loadNetwork": "Network problem while checking your WordPress connection.",
      "connect": "We couldn't connect to WordPress.",
      "reconnect": "Reconnecting didn't work.",
      "disconnect": "We couldn't disconnect.",
      "testNetwork": "Network problem while testing the connection."
    }
  },
  "mixin": {
    "title": "Mixin connection",
    "subtitle": "Publish articles straight to your Mixin store",
    "connected": "Mixin connected",
    "disconnected": "Mixin disconnected",
    "testOk": "All good — Mixin is reachable.",
    "testBad": "Mixin didn't respond as expected.",
    "changeIntro": "Enter a new token. We'll test it before saving — your current token stays active unless the test passes.",
    "connectIntro": "Enter your Mixin token. We'll test the connection to your store before saving and tell you if anything's off.",
    "siteUrl": "Store URL",
    "currentToken": "Current token",
    "token": "Mixin token",
    "tokenShort": "Token",
    "newToken": "New token",
    "tokenPlaceholder": "Paste your token here",
    "newTokenPlaceholder": "Paste your new token here",
    "hideToken": "Hide token",
    "showToken": "Show token",
    "testing": "Testing connection…",
    "testAndConnect": "Test & connect",
    "changeToken": "Change token",
    "confirmTitle": "Disconnect Mixin?",
    "confirmBody": "Articles will no longer be published to Mixin automatically. To reconnect, you'll need to enter your token again.",
    "errors": {
      "load": "We couldn't check your Mixin connection.",
      "loadNetwork": "Network problem while checking your Mixin connection.",
      "tokenShort": "Please paste the full token.",
      "connect": "We couldn't connect to Mixin. Check the store URL and token."
    }
  },
  "kwAnalysis": {
    "title": "Keyword finder",
    "steps": {
      "pending": "Request received",
      "processing": "Pulling data from Google Trends",
      "selecting": "AI is picking the best keyword",
      "done": "Preparing your results"
    },
    "progress": "Analyzing keywords ({done}/{total} checked)",
    "starting": "Getting started…",
    "note": "Heads-up: Google Trends limits requests, so each keyword can take up to a minute.",
    "processing": "In progress…",
    "completed": "Done",
    "failed": "Keyword analysis failed",
    "finalBadge": "Your keyword",
    "suggestedTitle": "Suggested title",
    "checked": "Keywords checked ({count})",
    "finalSelection": "Chosen",
    "fetched": "Data received",
    "fetchError": "Couldn't fetch data",
    "topQueries": "Top related searches",
    "risingQueries": "Rising searches",
    "noData": "No data",
    "breakout": "Breakout",
    "backToAnalysis": "Back to site analysis",
    "errors": {
      "status": "We couldn't get the analysis status.",
      "start": "We couldn't start the keyword analysis.",
      "site": "We couldn't load the site details."
    }
  },
  "shopify": {
    "title": "Shopify connection",
    "subtitle": "Publish blog articles and product SEO fixes straight to your Shopify store",
    "connected": "Connected",
    "loadFailed": "Couldn't load the Shopify connection.",
    "connectedBanner": "Your Shopify store is connected. We're importing your products now.",
    "invalidShop": "Enter your store address, e.g. your-store.myshopify.com.",
    "installFailed": "Couldn't start the Shopify connection. Please try again.",
    "testOk": "All good — your store is reachable.",
    "testBad": "Shopify didn't respond as expected.",
    "disconnected": "Shopify store disconnected.",
    "disconnectFailed": "Couldn't disconnect the store.",
    "store": "Store",
    "storefront": "Storefront",
    "connectedHelp": "Articles are published to your store's blog, and approved product fixes update your Shopify products. Your products sync automatically every night.",
    "confirmTitle": "Disconnect Shopify?",
    "confirmBody": "The Sevof app will be removed from your store. Articles already published stay on your blog.",
    "disconnecting": "Disconnecting…",
    "disconnect": "Disconnect",
    "cancel": "Cancel",
    "test": "Test connection",
    "notConfigured": "Shopify publishing isn't available on this server yet. Please contact support.",
    "intro": "Enter your store address and approve the Sevof app in Shopify. You'll come right back here when it's done.",
    "shopLabel": "Store address",
    "shopHint": "Your myshopify.com address — you'll find it in Shopify admin under Settings → Domains.",
    "redirecting": "Opening Shopify…",
    "connect": "Connect Shopify",
    "permissions": "Sevof only asks for access to your blog, products and files. You can remove the app from Shopify at any time.",
    "pickTitle": "Connect your Shopify store",
    "pickBody": "Choose the Sevof site this store belongs to. You'll approve the app in Shopify next.",
    "noSites": "You don't have a site in Sevof yet. Add your store's domain first, then come back.",
    "addSite": "Add a site"
  }
};

export default dashboard;
