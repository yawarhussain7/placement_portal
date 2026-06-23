import React from 'react';

const SelectField = ({ label, name, value, onChange, options = [], title, description }) => {
  return (
    <div className="space-y-1.5 w-full">
      {(label || title) && (
        <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
          {label || title}
        </label>
      )}
      {description && (
        <p className="text-[10px] text-gray-400 font-medium -mt-1">{description}</p>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#F8FAFC] border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-gray-800 cursor-pointer transition-all outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;