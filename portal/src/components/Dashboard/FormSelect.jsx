import React from "react";
import { ChevronDown } from "lucide-react";

export function FormInput({ label, type = "text", placeholder, required, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-slate-800 placeholder-slate-400"
      />
    </div>
  );
}

export function FormSelect({ label, options, required, value, onChange }) {
  return (
    <div className="flex flex-col relative">
      <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-slate-800 appearance-none cursor-pointer"
        >
          {options.map((opt, i) => (
            <option key={i} value={i === 0 ? "" : opt} disabled={i === 0}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="text-slate-400 absolute right-3 top-3 pointer-events-none" />
      </div>
    </div>
  );
}