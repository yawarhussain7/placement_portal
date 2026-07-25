import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, trend }) => {
  return (
    <div className="bg-surface p-5 rounded-xl shadow-pro-md hover:shadow-pro-lg transition-all duration-200">
      
      <div className="flex justify-between items-start">

        <div>
          <p className="text-xs text-muted font-semibold uppercase tracking-wide">
            {label}
          </p>

          <h2 className="text-2xl font-bold text-primary mt-1">
            {value}
          </h2>

          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp size={14} className="text-success" />
              ) : (
                <TrendingDown size={14} className="text-danger" />
              )}

              <span
                className={`text-xs font-semibold ${
                  trend >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {trend}%
              </span>
            </div>
          )}
        </div>

        <div className="p-3 bg-accent-subtle text-accent rounded-xl">
          <Icon size={20} />
        </div>

      </div>
    </div>
  );
};

export default StatCard;