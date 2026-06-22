import React from 'react';

const SwitchControl = ({ title, description, checked, onChange, variant = 'slider', iconOn: IconOn, iconOff: IconOff, textOn, textOff }) => {
  if (variant === 'button') {
    return (
      <div className="p-3.5 bg-[#F8FAFC] border border-gray-100 rounded-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-gray-900 block">{title}</span>
          <span className="text-[10px] text-gray-400 font-medium">{description}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
            !checked 
              ? 'bg-rose-50 border-rose-100 text-rose-700' 
              : 'bg-emerald-50 border-emerald-100 text-[#22C55E]'
          }`}
        >
          {!checked ? (
            <>{IconOff && <IconOff />} {textOff || 'Locked'}</>
          ) : (
            <>{IconOn && <IconOn />} {textOn || 'Open'}</>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-xs py-1">
      <div>
        <span className="font-bold text-gray-900 block">{title}</span>
        <p className="text-[10px] text-gray-400 font-medium">{description}</p>
      </div>
      {variant === 'checkbox' ? (
        <input 
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded text-gray-900 focus:ring-0 border-gray-300 cursor-pointer"
        />
      ) : (
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
            checked ? 'bg-[#22C55E]' : 'bg-gray-200'
          }`}
        >
          <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </button>
      )}
    </div>
  );
};

export default SwitchControl;