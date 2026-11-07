import type { DashboardActivity } from "../../types";
import { formatRelative } from "../../utils/dashboardFormat";

interface ActivityTimelineProps {
  activities: DashboardActivity[];
}

const dotColor: Record<DashboardActivity["type"], string> = {
  article_generation_started: "bg-blue-400",
  article_generated: "bg-emerald-500",
  idea_created: "bg-amber-400",
  keyword_discovered: "bg-indigo-400",
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
      <h2 className="font-bold text-slate-800 mb-4">Agent activity</h2>

      {activities.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
          No activity yet.
        </div>
      ) : (
        <ul className="space-y-4 relative before:absolute before:top-1 before:bottom-1 before:start-[5px] before:w-px before:bg-slate-100">
          {activities.map((activity, idx) => (
            <li key={idx} className="flex items-start gap-3 relative ps-0">
              <span className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${dotColor[activity.type]}`} />
              <div className="min-w-0">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">{activity.label}</span>
                  {activity.subject && <span className="text-slate-500"> — {activity.subject}</span>}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{formatRelative(activity.at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityTimeline;