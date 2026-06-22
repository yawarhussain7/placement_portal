import React from 'react';

const MonthlyPlacementsChart = ({ data = [] }) => {
  return (
    <div className="bg-white border border-gray-100/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Monthly Placements</h4>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">Aug - Feb</span>
      </div>
      
      <div className="flex items-end justify-between h-44 pt-6 px-2 relative">
        {data.map((item, idx) => {
          const maxHeight = 140;
          const heightValue = (item.value / 231) * maxHeight; // Scaled to look realistic
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              <div 
                className="w-full max-w-[28px] relative rounded-t-md bg-emerald-600/10 hover:bg-emerald-600 transition-all duration-300 flex items-end justify-center" 
                style={{ height: `${heightValue}px` }}
              >
                <span className="absolute -top-6 text-[10px] font-extrabold text-gray-700 opacity-0 group-hover:opacity-100 bg-white shadow-xs border border-gray-100 rounded px-1 transition-opacity pointer-events-none">
                  {item.value}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-2 block">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyPlacementsChart;