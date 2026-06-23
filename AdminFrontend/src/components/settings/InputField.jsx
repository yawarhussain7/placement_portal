import React from 'react';

const InputField = ({ label, type = 'text', name, value, onChange, step, badge, disabled }) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type} 
          step={step}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full bg-[#F8FAFC] border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-gray-800 transition-all outline-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        {badge && (
          <span className="absolute right-3 top-2 text-[10px] font-bold text-gray-400 bg-gray-200/50 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;