import React from "react";
import { Calendar, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { FormInput, FormSelect } from '../Dashboard/FormSelect'

export default function PersonalDetailsForm({ formData, onInputChange, onNext, onBack, step }) {

  const handle_Save = () => {
    if (onNext) onNext();
  }

  return (
    <form onSubmit={(e) => { e.preventDefault() }} className="bg-surface rounded-2xl p-6 md:p-8 shadow-pro-md border border-base">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        
        <FormInput label="Full Name" required placeholder="Enter your full name" value={formData.fullName} onChange={(val) => onInputChange("fullName", val)} />
        <FormInput label="Email Address" required type="email" placeholder="Enter your email address" value={formData.email} onChange={(val) => onInputChange("email", val)} />

        {/* Specialized Mobile Input */}
        <div>
          <label className="block text-xs font-bold text-primary tracking-wide mb-1.5">
            Phone Number <span className="text-danger">*</span>
          </label>
          <div className="flex rounded-lg border border-base bg-subtle overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-light transition-all">
            <div className="flex items-center space-x-1 px-3 bg-surface border-r border-base text-xs font-medium text-primary cursor-pointer">
              <img src="https://flagcdn.com/w20/au.png" alt="AU" className="w-5 h-3 object-cover rounded-sm" />
              <span>+61</span>
              <ChevronDown size={12} className="text-muted" />
            </div>
            <input
              type="tel" required placeholder="412 345 678"
              className="w-full px-3 py-2 text-sm bg-surface border-none focus:outline-none focus:ring-0 text-primary placeholder-muted"
              value={formData.phoneNumber}
              onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        {/* Specialized Datepicker */}
        <div>
          <label className="block text-xs font-bold text-primary tracking-wide mb-1.5">
            Date of Birth <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              type="date" required
              className="w-full px-3 py-2 text-sm bg-surface border border-base rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light transition-all text-primary placeholder-muted"
              value={formData.dob}
              onChange={(e) => onInputChange("dob", e.target.value)}
            />
            <Calendar size={16} className="absolute right-3 top-2.5 text-muted cursor-pointer hover:text-accent transition-colors" onClick={() => document.querySelector('input[type="date"]')?.showPicker()} />
          </div>
        </div>

        <FormSelect label="Gender" required options={["Select gender", "Male", "Female", "Prefer not to say"]} value={formData.gender} onChange={(val) => onInputChange("gender", val)} />
        <FormInput label="Address" required placeholder="Enter your full address" value={formData.address} onChange={(val) => onInputChange("address", val)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <FormInput label="Suburb" required placeholder="Enter suburb" value={formData.suburb} onChange={(val) => onInputChange("suburb", val)} />
        <FormSelect label="State" required options={["Select state", "VIC", "NSW", "QLD", "WA", "SA", "TAS"]} value={formData.state} onChange={(val) => onInputChange("state", val)} />
        <FormInput label="Postcode" required placeholder="Enter postcode" value={formData.postcode} onChange={(val) => onInputChange("postcode", val)} />
      </div>

      <div className="pt-2">
        <label className="block text-xs font-bold text-primary tracking-wide mb-3">
          Are you an Australian Citizen or Permanent Resident? <span className="text-danger">*</span>
        </label>
        <div className="flex items-center gap-6">
          {["Yes", "No"].map((option) => (
            <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="citizenStatus" 
                className="w-5 h-5 text-accent border-base focus:ring-accent focus:ring-2 accent-accent"
                checked={formData.isCitizen === option}
                onChange={() => onInputChange("isCitizen", option)}
              />
              <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 mt-2 border-t border-base">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 border border-base text-secondary hover:bg-subtle font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        ) : <div />}
        <button onClick={handle_Save} type="button" className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-pro-sm hover:shadow-pro-md">
          <span>Save & Continue</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}