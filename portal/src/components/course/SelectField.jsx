// SelectField.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SelectField = ({ label, required, placeholder, options = [], ...props }) => (
  <div className="w-full">
    <label className="block text-gray-900 font-semibold mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select 
        className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:border-green-600 transition-colors"
        {...props}
      >
        <option value="" className="text-gray-400">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          return <option key={val} value={val}>{label}</option>
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  </div>
);