const ApplicationProgressCard = ({ app }) => {
  return (
    <div className="bg-surface rounded-xl p-4 shadow-pro-md hover:shadow-pro-lg transition-all duration-200 border border-base">

      <div className="flex justify-between mb-2">
        <div>
          <h3 className="font-semibold text-primary text-sm">
            {app.role}
          </h3>
          <p className="text-xs text-muted">{app.company}</p>
        </div>

        <span className="text-xs font-bold text-secondary">
          {app.progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${app.progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-secondary">{app.status}</span>
        <span className="text-xs text-muted">{app.date}</span>
      </div>

    </div>
  );
};

export default ApplicationProgressCard;