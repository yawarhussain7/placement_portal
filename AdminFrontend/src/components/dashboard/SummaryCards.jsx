import React from 'react';
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiShoppingBag,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

const SummaryCards = ({ summaryData }) => {
  if (!summaryData || summaryData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-emerald-200 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${
                item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                item.color === 'purple' ? 'from-purple-500 to-purple-600' :
                item.color === 'green' ? 'from-green-500 to-green-600' :
                'from-orange-500 to-orange-600'
              } shadow-md`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                item.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {item.trendUp ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                {item.trend}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500">{item.current} / {item.total}</span>
                <span className="font-semibold text-gray-700">{item.percentage}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'purple' ? 'bg-purple-500' :
                    item.color === 'green' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${(item.current / item.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;