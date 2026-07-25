import { FileText, MessageSquare, Briefcase, CheckCircle } from "lucide-react";

const ActivityCard = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText size={16} className="text-info" />;
      case "message":
        return <MessageSquare size={16} className="text-success" />;
      case "application":
        return <Briefcase size={16} className="text-accent" />;
      default:
        return <CheckCircle size={16} className="text-muted" />;
    }
  };

  return (
    <div className="bg-surface rounded-xl p-4 sm:p-5 shadow-pro-md border border-base">
      <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 sm:mb-4">
        Recent Activity
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-subtle hover:bg-muted transition-colors"
          >
            <div className="mt-0.5 flex-shrink-0">{getIcon(activity.type)}</div>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-primary">
                {activity.title}
              </p>
              <p className="text-xs text-secondary mt-0.5 line-clamp-2">
                {activity.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;