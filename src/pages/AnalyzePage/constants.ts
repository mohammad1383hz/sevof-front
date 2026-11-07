export const POLL_STATUSES = new Set(["pending", "crawling", "analyzing"]);
export const POLL_INTERVAL_MS = 4000;
export const SCORE_POLL_INTERVAL_MS = 5000;
export const SCORE_POLL_MAX_ATTEMPTS = 60;

export const PHASE_LABELS: Record<string, string> = {
  queued: "analyze.phase.queued",
  crawling: "analyze.phase.crawling",
  analyzing: "analyze.phase.analyzing",
  done: "analyze.phase.done",
};

export const IDEA_STEPS = [
  { key: "connecting_sources", label: "analyze.ideaSteps.connecting" },
  { key: "analyzing_keywords", label: "analyze.ideaSteps.keywords" },
  { key: "generating_ideas", label: "analyze.ideaSteps.generating" },
  { key: "scoring_ideas", label: "analyze.ideaSteps.scoring" },
] as const;
