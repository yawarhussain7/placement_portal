import React from 'react';

export const TextArea = ({ label, optionalText, placeholder, ...props }) => (
  <div className="w-full">
    <label className="block text-gray-900 font-semibold mb-2">
      {label} {optionalText && <span className="text-gray-500 font-normal text-sm">{optionalText}</span>}
    </label>
    <textarea
      rows={4}
      placeholder={placeholder}
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-600 transition-colors resize-y"
      {...props}
    />
  </div>
);