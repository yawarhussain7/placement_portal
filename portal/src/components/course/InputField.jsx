import React from 'react';

export const InputField = ({ label, required, optionalText, type = 'text', ...props }) => (
  <div className="w-full">
    <label className="block text-primary font-semibold text-sm mb-2">
      {label} {optionalText && <span className="text-secondary font-normal text-xs">{optionalText}</span>}
      {required && <span className="text-danger ml-0.5">*</span>}
    </label>
    <input
      type={type}
      className="w-full bg-surface border border-base rounded-lg px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light transition-all"
      {...props}
    />
  </div>
);
