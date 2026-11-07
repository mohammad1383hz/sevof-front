const developer = {
  "keys": {
    "title": "API keys",
    "subtitle": "Create a key to connect your own app to the public API.",
    "docsLink": "API docs",
    "name": "Key name",
    "namePlaceholder": "e.g. Content server",
    "create": "Create key",
    "creating": "Creating…",
    "created": "Key “{name}” is ready. Copy it now — you won't be able to see it in full again.",
    "copy": "Copy",
    "copied": "Copied",
    "gotIt": "Got it",
    "empty": "No keys yet. Create your first one with the form above.",
    "cols": {
      "name": "Name",
      "key": "Key",
      "created": "Created",
      "lastUsed": "Last used",
      "site": "Site"
    },
    "active": "Active",
    "revoked": "Revoked",
    "revoke": "Revoke",
    "revokeConfirm": "Revoke “{name}”? Any app using this key will lose access right away.",
    "errors": {
      "load": "We couldn't load your API keys.",
      "loadNetwork": "Network problem while loading your API keys.",
      "create": "We couldn't create the key.",
      "createNetwork": "Network problem while creating the key.",
      "revoke": "We couldn't revoke the key.",
      "revokeNetwork": "Network problem while revoking the key."
    },
    "sitesFailed": "Couldn't load your sites.",
    "sitesLoading": "Loading…",
    "noSites": "No sites yet",
    "addSiteFirst": "Add a site first to create a key.",
    "legacySite": "First site (older key)"
  },
  "docs": {
    "title": "API documentation",
    "subtitle": "Connect your app to the public API and manage your articles.",
    "createKey": "Create API key",
    "auth": "Authentication",
    "authBody": "Send your API key with every request, in either of the two formats below. Create keys on the “API keys” page — each key is shown only once, so keep it somewhere safe.",
    "orEquivalent": "Or, equivalently:",
    "unauthorized": "If the key is missing, invalid or revoked, you'll get a {code} response:",
    "baseUrl": "Base URL",
    "endpoints": "Endpoints",
    "listArticles": "Lists the articles of the site this key belongs to, newest first.",
    "showArticle": "Returns one article in full, including its sections and banner.",
    "createTask": "Creates an article-generation task and starts it in the background.",
    "taskStatus": "Returns the status of an article-generation task. Once it's completed, the response includes article_id.",
    "notes": "Good to know",
    "note1": "A key can only access articles from the site it belongs to.",
    "note2": "Revoking a key cuts off its access immediately.",
    "note3": "To generate an article, create a task and poll its status (say, every 30 seconds) rather than waiting on one long request."
  }
};

export default developer;
