const ApplicationProgressCard = ({ app }) => {
  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-sm transition">

      <div className="flex justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">
            {app.role}
          </h3>
          <p className="text-xs text-gray-400">{app.company}</p>
        </div>

        <span className="text-xs font-bold text-gray-500">
          {app.progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${app.progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">{app.status}</span>
        <span className="text-xs text-gray-400">{app.date}</span>
      </div>

    </div>
  );
};

export default ApplicationProgressCard;