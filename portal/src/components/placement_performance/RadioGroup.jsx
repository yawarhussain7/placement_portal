import React from 'react';

export const RadioGroup = ({ label, required, name, options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-gray-900 font-semibold mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex items-center gap-6 h-[46px]">
      {options.map((opt) => {
        const isChecked = value === opt.value;
        return (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isChecked}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              isChecked ? 'border-green-600' : 'border-gray-300'
            }`}>
              {isChecked && <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
            </span>
            {opt.label}
          </label>
        );
      })}
    </div>
  </div>
);