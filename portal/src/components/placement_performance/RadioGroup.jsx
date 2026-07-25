import React from 'react';

export const RadioGroup = ({ label, required, name, options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-primary font-semibold text-sm mb-2">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <div className="flex items-center gap-4">
      {options.map((opt) => {
        const isChecked = value === opt.value;
        return (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isChecked}
              onChange={() => onChange(opt.value)}
              className="w-4 h-4 text-accent border-base focus:ring-accent focus:ring-2"
            />
            <span className={`text-sm font-medium transition-colors ${
              isChecked ? 'text-accent' : 'text-secondary group-hover:text-primary'
            }`}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  </div>
);
