import React, { useState } from "react";
import { Calendar, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { FormInput, FormSelect } from '../Dashboard/FormSelect'

import {UploadPerosnal_Details} from '../../Api/newplacement/personal_detailsAPi.js'

export default function PersonalDetailsForm({ formData, onInputChange, onNext, onBack, step }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle_Save = async () => {
    setSaving(true);
    setError('');
    try{
      const response = await UploadPerosnal_Details(formData)
      if (response.data.success) {
        if (onNext) onNext();
      } else {
        setError(response.data.message || 'Failed to save details');
      }
    }catch(error){
      setError(error.response?.data?.message || error.message || 'Failed to save details');
    }finally{
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault() }} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        
        <FormInput label="Full Name" required placeholder="Enter your full name" value={formData.fullName} onChange={(val) => onInputChange("fullName", val)} />
        <FormInput label="Email Address" required type="email" placeholder="Enter your email address" value={formData.email} onChange={(val) => onInputChange("email", val)} />

        {/* Specialized Mobile Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
            <div className="flex items-center space-x-1 px-3 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 cursor-pointer">
              <img src="https://flagcdn.com/w20/au.png" alt="AU" className="w-5 h-3 object-cover rounded-sm" />
              <span>+61</span>
              <ChevronDown size={12} className="text-slate-400" />
            </div>
            <input
              type="tel" required placeholder="412 345 678"
              className="w-full px-3 py-2 text-sm bg-white border-none focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
              value={formData.phoneNumber}
              onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        {/* Specialized Datepicker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date" required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-slate-800 placeholder-slate-400"
              value={formData.dob}
              onChange={(e) => onInputChange("dob", e.target.value)}
            />
            <Calendar size={16} className="absolute right-3 top-2.5 text-slate-400 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => document.querySelector('input[type="date"]')?.showPicker()} />
          </div>
        </div>

        <FormSelect label="Gender" required options={["Select gender", "Male", "Female", "Prefer not to say"]} value={formData.gender} onChange={(val) => onInputChange("gender", val)} />
        <FormInput label="Address" required placeholder="Enter your full address" value={formData.address} onChange={(val) => onInputChange("address", val)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <FormInput label="Suburb" required placeholder="Enter suburb" value={formData.suburb} onChange={(val) => onInputChange("suburb", val)} />
        <FormSelect label="State" required options={["Select state", "VIC", "NSW", "QLD", "WA", "SA", "TAS"]} value={formData.state} onChange={(val) => onInputChange("state", val)} />
        <FormInput label="Postcode" required placeholder="Enter postcode" value={formData.postcode} onChange={(val) => onInputChange("postcode", val)} />
      </div>

      <div className="pt-2">
        <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2.5">
          Are you an Australian Citizen or Permanent Resident? <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-6">
          {["Yes", "No"].map((option) => (
            <label key={option} className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="radio" name="citizenStatus" className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-600 accent-emerald-600"
                checked={formData.isCitizen === option}
                onChange={() => onInputChange("isCitizen", option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 mt-2 border-t border-slate-100">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        ) : <div />}
        <button onClick={handle_Save} type="button" disabled={saving} className="flex items-center space-x-2 bg-[#12692e] hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save & Continue</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}