import { plural } from "../../plural";

const analyze = {
  "failed": "The analysis didn't finish",
  "phase": {
    "queued": "Request received",
    "crawling": "Reading your site's pages…",
    "analyzing": "Analyzing your content…",
    "done": "Analysis complete"
  },
  "ideaSteps": {
    "connecting": "Connecting to data sources (Google Trends, Autocomplete, SERP)",
    "keywords": "Scoring keywords around your main topics",
    "generating": "Writing article ideas with AI",
    "scoring": "Checking competition and calculating SEO scores"
  },
  "empty": {
    "title": "Analyze your site",
    "body": "Enter a domain below and we'll work out your industry, summarize your content and map out the key topics (entities) you cover.",
    "tagEntities": "Entity analysis",
    "tagIdeas": "Article ideas"
  },
  "input": {
    "placeholder": "example.com — your website address",
    "submit": "Analyze"
  },
  "progress": {
    "title": "Working on it",
    "inProgress": "In progress…",
    "done": "Done",
    "hint": "This usually takes a few minutes."
  },
  "ideasBar": {
    "limit": "You've hit your limit for idea generation",
    "generating": "Writing…",
    "cta": "Find article opportunities"
  },
  "ideas": {
    "ready": plural({"one":"{count} idea ready","other":"{count} ideas ready"}),
    "preparing": "Getting ready…",
    "generatingTitle": "Coming up with article ideas",
    "retrying": "Trying again…",
    "retry": "Try again"
  },
  "chat": {
    "yourRequest": "Your request",
    "preparingIdeas": "Putting together ideas for your site…",
    "articleHeader": "Writing an article in this chat",
    "assistant": "Content strategy assistant",
    "selectedEntity": "Focus topic: {name}",
    "preparing": "Starting a new chat…"
  },
  "research": {
    "failed": "Content research didn't finish",
    "clustersTitle": "Building keyword clusters",
    "gapsTitle": "Analyzing competitors and content gaps",
    "clusters": "Keyword clusters",
    "gapsResult": "Content gaps & competitor analysis",
    "clusterSteps": {
      "read": "Reading your site's topics and keywords",
      "build": "Grouping searches into clusters",
      "estimate": "Estimating opportunity and trends"
    },
    "gapSteps": {
      "context": "Understanding your business",
      "competitors": "Finding real competitors",
      "gaps": "Spotting content gaps"
    },
    "intent": {
      "informational": "Informational",
      "commercial": "Commercial",
      "transactional": "Transactional",
      "navigational": "Navigational"
    },
    "coverage": {
      "missing": "Not in Google results",
      "weak": "Ranking poorly",
      "low": "Ranking low"
    },
    "level": {
      "low": "low",
      "medium": "medium",
      "high": "high"
    },
    "priority": {
      "high": "High priority",
      "medium": "Medium priority",
      "low": "Low priority"
    },
    "difficulty": {
      "unavailable": "Not available from this source",
      "estimated": "{score}/100 · AI estimate"
    },
    "volumeEstimate": "AI estimate",
    "volumeObserved": "Real impressions",
    "trend": "Trend",
    "trendNeedsTwo": "Needs two periods to compare",
    "trendUnavailable": "No trend estimate",
    "stats": {
      "competitors": "Real competitors",
      "opportunities": "Content opportunities",
      "avgScore": "Avg. opportunity score",
      "highThreat": "High-threat competitors"
    },
    "strengths": "What your site does well",
    "weaknesses": "Where you can improve",
    "visibility": "Search visibility",
    "depth": "Content depth",
    "opportunitiesTitle": "Content opportunities (ranked against real Google results)",
    "takeAction": "Act on this",
    "recommendedAction": "Suggested approach",
    "competitorSites": "Competitor sites ({count})",
    "rank": "Position {rank}",
    "rankUnavailable": "Position unknown",
    "sharedKeywords": plural({"one":"{count} shared keyword","other":"{count} shared keywords"}),
    "moreDetails": "More details",
    "missing": "What your site is missing",
    "recommendations": "Overall recommendations",
    "action": "Next step: {action}",
    "fullReport": "Open the full research report",
    "opportunityScore": "Opportunity {score}/100",
    "threat": "Threat: {level}",
    "received": "Got it! The research results will show up right here in this chat."
  },
  "entities": {
    "title": "Topics we found",
    "empty": "No topics found yet."
  },
  "request": {
    "title": "Content analysis request",
    "body": "AI looks at your content and your competitors to uncover new content opportunities"
  },
  "summary": {
    "title": "Analysis results",
    "industry": "Industry: {niche}"
  },
  "user": {
    "start": "Analyze this site"
  },
  "idea": {
    "edit": "Edit idea",
    "editShort": "Edit",
    "save": "Save changes",
    "category": "Category:",
    "noLinks": "No internal links found",
    "linksLabel": "Internal links:",
    "linksHint": "The finished article will link to these pages",
    "viewArticle": "View article",
    "viewArticleHint": "Open the article written from this idea",
    "generatingHint": "An article is being written from this idea",
    "fields": {
      "title": "Title",
      "titlePlaceholder": "Idea title",
      "hook": "Hook",
      "hookPlaceholder": "An opening line that grabs the reader",
      "meta": "Meta description",
      "metaPlaceholder": "A short summary for search results",
      "tags": "Tags",
      "tagsHint": "(comma-separated)",
      "tagsPlaceholder": "SEO, marketing, content",
      "links": "Internal links",
      "linkTitle": "Link text",
      "related": "Related",
      "removeLink": "Remove link",
      "addLink": "Add related link",
      "outline": "Outline",
      "outlineHint": "(one heading per line)"
    },
    "score": {
      "entity": "Topic relevance",
      "intent": "Search intent",
      "business": "Business value",
      "serp": "Room to compete in Google",
      "summary": "Summary:"
    },
    "errors": {
      "save": "We couldn't save your changes. Please try again."
    }
  },
  "gsc": {
    "connect": "Connect Google Search Console",
    "reconnect": "Reconnect Google Search Console",
    "title": "Live data from Google Search Console",
    "body": "Bring your real queries, impressions, clicks, CTR and rankings into your content research — read-only access.",
    "connected": "Account connected",
    "showProperties": "Show my verified sites",
    "selectProperty": "Choose a property",
    "connectProperty": "Use this site",
    "lastSynced": "Last synced: {date}",
    "noData": "No data yet.",
    "syncing": "Fetching…",
    "sync": "Sync now",
    "impressions": "Impressions",
    "clicks": "Clicks",
    "topQueries": "Top queries by impressions",
    "queryStats": "{impressions} impressions · position {position}",
    "errors": {
      "start": "We couldn't start the Google Search Console connection.",
      "properties": "We couldn't load your Search Console sites.",
      "select": "We couldn't connect that property.",
      "sync": "We couldn't start the Search Console sync.",
      "disconnect": "We couldn't disconnect Search Console."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Suggest article topics",
      "prompt": "Give me specific, actionable content opportunities based on trends relevant to this site."
    },
    "gap": {
      "label": "Competitor content gap analysis",
      "prompt": "Analyze this site's relevant competitors and its main content gaps. For each gap, explain why it matters, how big the threat is, and suggest an angle to cover it."
    },
    "limit": "Upgrade your plan to keep going.",
    "choosePath": "Choose a research type",
    "gscConnect": "Connect Search Console",
    "connectGoogle": "Connect Google account",
    "loadingSites": "Loading sites…",
    "showSites": "Show my sites",
    "select": "Choose",
    "queriesReceived": "{count} queries received",
    "loadingData": "Loading data…",
    "readyToFetch": "Connected — ready to fetch data",
    "fetch": "Fetch data",
    "connectedQueries": "Search Console connected · {count} queries",
    "fetchingGsc": "Fetching data from Search Console…",
    "gscConnected": "Search Console connected",
    "placeholder": "Ask a question or describe what you need…",
    "send": "Send"
  },
  "credits": {
    "banner": "You've used up your free chat credits for the content assistant. {still} Pick a plan to keep chatting.",
    "bannerStill": "You can still write articles from the ideas you already have.",
    "viewPlans": "See plans",
    "chatFree": "You've used up your free chat credits for the content assistant, so you can't ask new questions — but you can still write articles from the ideas you already have. To keep chatting, pick a plan on the subscription page (/subscription).",
    "chatPaid": "You're out of credits for the content assistant, but you can still write articles from the ideas you already have. Top up or upgrade on the subscription page (/subscription).",
    "shortFree": "You've used up your free credits. Subscribe to keep going.",
    "shortPaid": "You're out of credits. Top up or upgrade your plan.",
    "barFree": "Your free content-assistant credits are used up. Subscribe to keep going.",
    "barPaid": "Not enough credits for content analysis. Top up or upgrade your plan."
  },
  "entity": {
    "pick": "Choose a topic",
    "pickPrompt": "To find precise content opportunities and build the right internal links, pick the topic (entity) to focus on.",
    "confirmed": "Great — your request is in! Results will focus only on the topic you picked, and every article will link to its matching page on your site."
  },
  "gapPrompt": "Create a content idea and plan for this opportunity, found by comparing against real Google results:\nOpportunity: {title}\nTarget query: {query}\nDetails: {details}\nSuggested angle: {angle}",
  "gapLabel": "Act on: {title}",
  "article": {
    "request": "Write an article for the idea “{title}”.",
    "started": "The article is being written in this chat."
  },
  "nav": {
    "previous": "Previous message",
    "next": "Next message",
    "latest": "Jump to latest message",
    "latestShort": "Latest"
  },
  "welcome": {
    "title": "SEO agent for {domain}",
    "hello": "Hi! I'm the SEO assistant for {domain}.",
    "what": "I can dig into the keywords that matter, uncover fresh content opportunities, size up your competitors and suggest topics that help your site grow.",
    "ask": "Ask me anything about SEO or your site's content."
  },
  "errors": {
    "saveMessage": "We couldn't save that message.",
    "researchResults": "We couldn't load the research results.",
    "history": "We couldn't load this chat's history.",
    "startSession": "We couldn't start the analysis chat for this site.",
    "research": "The content research request didn't go through.",
    "opportunities": "The content opportunities request didn't go through.",
    "retry": "Retrying didn't work.",
    "status": "We couldn't get the analysis status.",
    "domainRequired": "Enter a domain, like example.com.",
    "domainInvalid": "Enter just the domain — no http:// or path — like example.com.",
    "addDomain": "We couldn't add this domain."
  }
};

export default analyze;
