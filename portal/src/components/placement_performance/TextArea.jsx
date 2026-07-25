import React from 'react';

export const TextArea = ({ label, optionalText, placeholder, ...props }) => (
  <div className="w-full">
    <label className="block text-primary font-semibold text-sm mb-2">
      {label} {optionalText && <span className="text-secondary font-normal text-xs">{optionalText}</span>}
    </label>
    <textarea
      rows={4}
      placeholder={placeholder}
      className="w-full bg-surface border border-base rounded-lg px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light transition-all resize-y"
      {...props}
    />
  </div>
);
