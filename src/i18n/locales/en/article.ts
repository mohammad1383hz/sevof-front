import { plural } from "../../plural";

const article = {
  "words": plural({"one":"{count} word","other":"{count} words"}),
  "actions": {
    "chat": "Chat",
    "save": "Save"
  },
  "steps": {
    "brief": "Brief",
    "briefHint": "Audience & competitor research",
    "outline": "Outline",
    "outlineHint": "Planning the structure",
    "sections": "Writing",
    "sectionsHint": "Section by section",
    "meta": "Metadata & SEO",
    "metaHint": "Title, summary & FAQ schema",
    "review": "SEO review",
    "reviewHint": "Checking and scoring",
    "done": "Final article",
    "doneHint": "Ready to publish"
  },
  "status": {
    "generated": "Done",
    "pending": "Waiting"
  },
  "sectionType": {
    "introduction": "Introduction",
    "section": "Main section",
    "faq": "Frequently asked questions",
    "conclusion": "Conclusion"
  },
  "breakdown": {
    "intent_match": "Matches search intent",
    "keyword_usage": "Keyword usage",
    "entity_coverage": "Topic coverage",
    "completeness": "Completeness",
    "readability": "Readability",
    "structure": "Structure"
  },
  "target": {
    "title": "Article title",
    "meta_title": "SEO title",
    "meta_description": "Meta description",
    "excerpt": "Excerpt",
    "general": "Whole article",
    "section": "Section",
    "faq": "FAQ",
    "article": "Whole article",
    "metaTitleLong": "SEO title (meta title)",
    "metaDescriptionLong": "Meta description",
    "excerptLong": "Excerpt",
    "question": "Question {index}"
  },
  "models": {
    "choose": "Choose an AI model",
    "upgrade": "Upgrade your plan to unlock Pro models.",
    "nano": "Fast and budget-friendly",
    "mini": "More precise for complex edits",
    "luna": "The best writing quality and the most natural tone — our pick for top results."
  },
  "imageModels": {
    "flux": "Fast and affordable — great for everyday article images.",
    "banana": "Rich visuals, ideal for creative, varied images.",
    "gpt": "Follows your prompt closely and nails the fine details."
  },
  "styles": {
    "minimal": "Minimal",
    "infographic": "Infographic",
    "conceptual": "Conceptual",
    "realistic": "Realistic",
    "product": "Product"
  },
  "editor": {
    "placeholder": "Write or edit this section…"
  },
  "copy": {
    "failed": "Copying didn't work.",
    "failedRetry": "Copying didn't work. Please try again."
  },
  "errors": {
    "request": "The request didn't go through.",
    "invalidResponse": "The server sent back an unexpected response."
  },
  "error": {
    "paused": "Article writing is paused",
    "pausedCredit": "Article writing is paused — you're out of credits",
    "savedCredit": "Don't worry — everything finished so far is saved. Once you top up, it picks up right where it stopped.",
    "savedRetry": "Don't worry — everything finished so far is saved. Try again and it picks up right where it stopped.",
    "buyCredits": "Buy or renew credits",
    "resume": "Resume writing"
  },
  "seo": {
    "title": "SEO review",
    "evaluating": "Checking the full article against the brief…",
    "failed": "The SEO review didn't finish (your article is ready, just without a score).",
    "outOf100": "out of 100",
    "overall": "Overall SEO score",
    "suggestions": "How to improve"
  },
  "image": {
    "featured": "Featured image",
    "failed": "Image generation failed",
    "noBlock": "No worries — this doesn't stop the article text from being written or published.",
    "creating": "AI is writing a prompt and creating your featured image…",
    "tip": "For higher-quality images, try GPT Image or Nano Banana",
    "generating": "Creating a new image…",
    "generatingShort": "Generating…",
    "closeEditor": "Close editor",
    "retryPrompt": "Try again with a new prompt",
    "editPrompt": "Edit prompt & regenerate",
    "promptPlaceholder": "Describe the image you want…",
    "modelLocked": "The “{model}” model is for Pro users. Taking you to the plans page…",
    "editLocked": "Editing and regenerating images is a Pro feature. Taking you to the plans page…",
    "promptShort": "That prompt is too short.",
    "assistant": "Image assistant — edit the prompt and send",
    "proOnly": "Editing the prompt and regenerating images is available on Pro.",
    "introExisting": "Here's the prompt we used for this image. Change it however you like:",
    "introNew": "There's no prompt yet. Write one to generate the image:",
    "submit": "Regenerate",
    "proOnlyShort": "Pro only"
  },
  "meta": {
    "title": "SEO settings",
    "empty": "empty",
    "focusKeyword": "Focus keyword",
    "slug": "URL slug",
    "slugHint": "The URL part of the address — lowercase letters and hyphens only",
    "ogTitle": "Social title (og:title)",
    "ogDescription": "Social description (og:description)"
  },
  "faq": {
    "title": "Frequently asked questions",
    "count": plural({"one":"{count} question","other":"{count} questions"}),
    "question": "Question",
    "answer": "Answer",
    "saveFailed": "We couldn't save this question."
  },
  "sections": {
    "title": "Article sections",
    "designing": "Designing the outline from the brief…",
    "none": "The outline hasn't been created yet.",
    "editManually": "Edit manually",
    "progress": "{done} of {total} sections",
    "regenerate": "Rewrite this section"
  },
  "banner": {
    "title": "Article banner",
    "designing": "Designing your banner…",
    "failed": "Regenerating the banner didn't work.",
    "failedRetry": "Regenerating the banner didn't work. Please try again.",
    "generationFailed": "Banner generation failed.",
    "regenerate": "Regenerate"
  },
  "brief": {
    "title": "Article brief",
    "analyzing": "AI is studying your audience, the search intent and the gaps in competitors' content…",
    "notYet": "Not created yet.",
    "audience": "Audience",
    "tone": "Tone",
    "length": "Target length",
    "goal": "Article goal",
    "mustCover": "Must-cover topics",
    "gaps": "Competitor gaps (your edge)",
    "linkPlan": "“{anchor}” in the “{section}” section"
  },
  "chat": {
    "title": "Chat with AI",
    "selectSection": "Pick a section",
    "or": "or",
    "orDrag": "or drag a section here",
    "selectAll": "select the whole article",
    "useSelect": "Pick a section with “Select section”",
    "drop": "Drop to chat about this section",
    "dropHere": "Drop here to add it to the chat",
    "loading": "Loading chat…",
    "empty": "No chats about this article yet.",
    "applied": "Applied",
    "clearTarget": "Clear",
    "placeholder": "e.g. Make this section more formal and concise…",
    "placeholderShort": "e.g. Make this section more formal…",
    "placeholderEmpty": "Pick a section of the article first, or drop one here",
    "selectFirst": "Pick a section first",
    "disabledUntilDone": "Chat opens once the article is finished…",
    "waitForArticle": "Writing the article… Chat opens as soon as it's ready",
    "noCredits": "Your plan isn't active or you're out of credits.",
    "sendFailed": "Your message didn't go through. Please try again.",
    "sendAria": "Send message",
    "previous": "Earlier chats about this article ({count})",
    "loadingPrevious": "Loading earlier chats…",
    "firstDraft": "First draft",
    "draft": "Draft {index}",
    "withAgent": "Chat with the agent"
  },
  "final": {
    "article": "Article",
    "ready": "Your article is ready",
    "section": "Section {index}",
    "waiting": "Waiting",
    "sectionFailed": "This section couldn't be written.",
    "sectionTitle": "Section title",
    "saveFailed": "We couldn't save the article.",
    "dragToChat": "Drag into the chat",
    "dragShort": "Drag to chat",
    "dragArticle": "Drag the whole article into the chat",
    "dragSection": "Drag this section into the chat",
    "chatArticle": "Chat about the whole article",
    "editArticle": "Edit the whole article",
    "copyMarkdown": "Copy as Markdown"
  },
  "modal": {
    "title": "Choose how your article is written",
    "subtitle": "The model you pick shapes the article's quality and SEO. The most advanced models come with Pro.",
    "writingModel": "Writing model",
    "writingModelDesc": "This model writes the article's text and structure.",
    "images": "Article images",
    "imagesDesc": "Pick the image model and how many images to create for this article.",
    "qualityTip": "For the best quality, use GPT Image or Nano Banana",
    "imageCount": "Number of images",
    "upToImages": "Create up to {count} images",
    "firstImage": "The first image becomes the featured image.",
    "sectionCount": "Number of sections",
    "rangePro": "This range is available on Pro",
    "sectionRange": "Your article will have {min} to {max} sections.",
    "advanced": "Advanced (optional)",
    "advancedHint": "Image style and your own instructions for the text and featured image",
    "imageStyle": "Image style",
    "infographicHint": "Infographics need GPT Image or Nano Banana",
    "articlePromptPlaceholder": "e.g. Conversational tone, aimed at beginners, with a clear conclusion",
    "imagePromptPlaceholder": "e.g. A wooden desk with a laptop and a cup of coffee in soft morning light",
    "imagePromptHint": "The style above applies to this image too — with no text or logos.",
    "start": "Start writing"
  },
  "publish": {
    "connect": "Connect {platform}",
    "notConnected": "Your site isn't connected to {platform} yet.",
    "publishTo": "Publish to {platform}",
    "updateOn": "Update on {platform}",
    "removeFrom": "Remove from {platform}",
    "draftOn": "{platform} draft",
    "viewOn": "View on {platform}",
    "checking": "Checking connection…",
    "finishFirst": "The article needs to finish before you can publish it.",
    "whenReady": "You can publish as soon as the article is ready.",
    "publishing": "Publishing…",
    "publish": "Publish",
    "updating": "Updating…",
    "updated": "Updated",
    "update": "Update",
    "deleting": "Removing…",
    "confirmDelete": "Sure? Click again"
  },
  "page": {
    "missingId": "The idea or article ID is missing.",
    "startFailed": "We couldn't start writing the article.",
    "noId": "The server didn't return an article ID.",
    "startError": "Something went wrong while starting the article.",
    "retryFailed": "Retrying didn't work. Please try again.",
    "regenFailed": "We couldn't rewrite this section.",
    "regenFailedRetry": "We couldn't rewrite this section. Please try again.",
    "wpPublishFailed": "Publishing to WordPress didn't work.",
    "wpPublishFailedRetry": "Publishing to WordPress didn't work. Please try again.",
    "wpUpdateFailed": "Updating on WordPress didn't work.",
    "wpUpdateFailedRetry": "Updating on WordPress didn't work. Please try again.",
    "wpDeleteFailed": "Removing from WordPress didn't work.",
    "wpDeleteFailedRetry": "Removing from WordPress didn't work. Please try again.",
    "checkingPlan": "Checking your plan…",
    "preparing": "Getting your article ready…",
    "autoRefresh": "This page updates on its own — no need to refresh."
  }
};

export default article;
