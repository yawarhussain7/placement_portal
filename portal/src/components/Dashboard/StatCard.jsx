import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
      
      <div className="flex justify-between items-start">

        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase">
            {label}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </h2>

          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}

              <span
                className={`text-xs font-semibold ${
                  trend >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {trend}%
              </span>
            </div>
          )}
        </div>

        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Icon size={20} />
        </div>

      </div>
    </div>
  );
};

export default StatCard;