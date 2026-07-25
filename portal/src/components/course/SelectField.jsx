// SelectField.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const SelectField = ({ label, required, placeholder, options = [], value, onChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
  };

  const getDisplayLabel = () => {
    if (!selectedValue) return placeholder;
    const selectedOption = options.find(opt => {
      const val = typeof opt === 'string' ? opt : opt.value;
      return val === selectedValue;
    });
    return typeof selectedOption === 'string' ? selectedOption : selectedOption?.label || placeholder;
  };

  return (
    <div className="w-full">
      <label className="block text-primary font-semibold text-sm mb-2">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          ref={selectRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full appearance-none bg-surface border border-base rounded-lg px-4 py-2.5 pr-10 text-left text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light transition-all cursor-pointer flex items-center justify-between hover:border-accent/50"
          {...props}
        >
          <span className={selectedValue ? 'text-primary' : 'text-muted'}>
            {getDisplayLabel()}
          </span>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-surface border border-base rounded-lg shadow-lg overflow-hidden animate-fadeIn">
            <div className="max-h-60 overflow-y-auto">
              {placeholder && (
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className="w-full px-4 py-2.5 text-left text-muted hover:bg-accent/10 hover:text-primary transition-colors flex items-center justify-between"
                >
                  <span>{placeholder}</span>
                  {!selectedValue && <Check className="w-4 h-4 text-accent" />}
                </button>
              )}
              {options.map((opt) => {
                const val = typeof opt === 'string' ? opt : opt.value;
                const label = typeof opt === 'string' ? opt : opt.label;
                const isSelected = selectedValue === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelect(val)}
                    className={`w-full px-4 py-2.5 text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-accent/10 text-primary font-medium'
                        : 'text-primary hover:bg-accent/10'
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check className="w-4 h-4 text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};