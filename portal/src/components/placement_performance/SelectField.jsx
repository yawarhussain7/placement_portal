import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const SelectField = ({ label, required, placeholder, options = [], value, onChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);

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
      <label className="block text-gray-900 font-semibold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-left text-gray-700 focus:outline-none focus:border-green-600 transition-colors cursor-pointer flex items-center justify-between hover:border-green-600/50"
          {...props}
        >
          <span className={selectedValue ? 'text-gray-700' : 'text-gray-400'}>
            {getDisplayLabel()}
          </span>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
            <div className="max-h-60 overflow-y-auto">
              {placeholder && (
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className="w-full px-4 py-3 text-left text-gray-400 hover:bg-green-50 hover:text-gray-700 transition-colors flex items-center justify-between"
                >
                  <span>{placeholder}</span>
                  {!selectedValue && <Check className="w-4 h-4 text-green-600" />}
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
                    className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-green-50 text-gray-700 font-medium'
                        : 'text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check className="w-4 h-4 text-green-600" />}
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