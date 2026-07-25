import React from 'react';
import { FiArrowUp } from 'react-icons/fi';

const SummaryTable = ({ pipelineData, totalApplications }) => {
  if (!pipelineData || pipelineData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <h3 className="text-base font-bold text-gray-900 mb-3">Placement Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-semibold text-gray-700 bg-gray-50">Stage</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-700 bg-gray-50">Count</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-700 bg-gray-50">Percentage</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-700 bg-gray-50">Trend</th>
            </tr>
          </thead>
          <tbody>
            {pipelineData.map((item, index) => {
              const percentage = totalApplications ? 
                `${Math.round((item.value / totalApplications) * 100)}%` : 
                '20%';
              return (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-2.5 px-3 font-semibold text-gray-900">{item.value}</td>
                  <td className="text-right py-2.5 px-3 text-gray-600">{percentage}</td>
                  <td className="text-right py-2.5 px-3">
                    <span className="inline-flex items-center gap-0.5 text-green-600">
                      <FiArrowUp className="w-3 h-3" />
                      <span className="font-medium">+{Math.floor(Math.random() * 10) + 1}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;