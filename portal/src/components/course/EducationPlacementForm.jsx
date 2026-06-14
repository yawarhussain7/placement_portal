import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SelectField } from './SelectField';
import { InputField } from './InputField';
import { NewCourse } from '../../Api/newplacement/course_detailsApi.js';

const EducationPlacementForm = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState({
    course: '',
    institution: '',
    courseCode: '',
    studyStatus: '',
    completionDate: '',
    placementReason: 'mandatory'
  });

  const [studyMode, setStudyMode] = useState('full-time');

  // ✅ FIX 1: added errors state (missing in your code)
  const [errors, setErrors] = useState({});

  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // optional: clear error when user fixes field
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ FIX 2: proper validation
  const validate = () => {
    const newErrors = {};

    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.institution) newErrors.institution = "Institution is required";
    if (!formData.studyStatus) newErrors.studyStatus = "Study status is required";
    if (!formData.completionDate) newErrors.completionDate = "Completion date is required";
    if (!studyMode) newErrors.studyMode = "Study mode is required";
    if (!formData.placementReason) newErrors.placementReason = "Placement type is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ FIX 3: corrected validate() call + safe API flow
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const payload = {
        ...formData,
        studyMode,
      };

      const response = await NewCourse(payload);

      if (response?.data?.success) {
        onNext?.();
      } else {
        setError(response?.data?.message || "Failed to save details");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className=" p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
      <form onSubmit={handleSubmit} className="space-y-6">

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Course */}
        <div>
          <SelectField
            label="Course / Qualification"
            required
            placeholder="Select your course or qualification"
            value={formData.course}
            onChange={(e) => handleInputChange('course', e.target.value)}
            options={[
              'Certificate III in Individual Support (Ageing)',
              'Certificate III in Individual Support (Disability)',
              'Certificate III in Early Childhood Education and Care',
              'Certificate III in Community Services',
              'Certificate IV in Ageing Support',
              'Certificate IV in Disability',
              'Certificate IV in Child, Youth and Family Intervention',
              'Diploma of Community Services',
              'Diploma of Early Childhood Education and Care',
              'Diploma of Nursing',
              'Bachelor of Nursing',
              'Bachelor of Social Work',
              'Bachelor of Psychology',
              'Other',
            ]}
          />
          {errors.course && <p className="text-red-500 text-xs">{errors.course}</p>}
        </div>

        {/* Institution + Course Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectField
              label="RTO / Institution"
              required
              placeholder="Select your RTO / Institution"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              options={[
                'Inspire Education',
                'TAFE NSW',
                'TAFE Queensland',
                'TAFE Victoria',
                'TAFE SA',
                'TAFE WA',
                'Swinburne University',
                'RMIT University',
                'Monash University',
                'University of Melbourne',
                'Deakin University',
                'La Trobe University',
                'Australian Catholic University',
                'Holmesglen Institute',
                'Box Hill Institute',
                'Chisholm Institute',
                'Other',
              ]}
            />
            {errors.institution && <p className="text-red-500 text-xs">{errors.institution}</p>}
          </div>

          <InputField
            label="Course Code"
            optionalText="(if applicable)"
            placeholder="e.g. CHC33015"
            value={formData.courseCode}
            onChange={(e) => handleInputChange('courseCode', e.target.value)}
          />
        </div>

        {/* Study Status + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectField
              label="Current Study Status"
              required
              placeholder="Select your current study status"
              value={formData.studyStatus}
              onChange={(e) => handleInputChange('studyStatus', e.target.value)}
              options={[
                'Currently Enrolled',
                'Final Semester',
                'Final Year',
                'Awaiting Results',
                'Recently Graduated',
              ]}
            />
            {errors.studyStatus && <p className="text-red-500 text-xs">{errors.studyStatus}</p>}
          </div>

          <div className="relative">
            <InputField
              label="Expected Completion Date"
              required
              type="date"
              value={formData.completionDate}
              onChange={(e) => handleInputChange('completionDate', e.target.value)}
            />
            {errors.completionDate && <p className="text-red-500 text-xs">{errors.completionDate}</p>}
          </div>
        </div>

        {/* Mode of Study */}
        <div>
          <label className="block text-gray-900 font-semibold mb-2">
            Mode of Study <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-3 gap-2 max-w-xl">
            {['full-time', 'part-time', 'online'].map((mode) => {
              const isActive = studyMode === mode;

              return (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setStudyMode(mode)}
                  className={`py-2.5 px-3 rounded-lg font-medium border text-center transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-green-50 border-green-600 text-green-700 font-semibold'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'border-green-600' : 'border-gray-300'
                  }`}>
                    {isActive && <span className="w-2 h-2 bg-green-600 rounded-full" />}
                  </span>
                  <span className="capitalize">{mode.replace('-', ' ')}</span>
                </button>
              );
            })}
          </div>

          {errors.studyMode && (
            <p className="text-red-500 text-xs">{errors.studyMode}</p>
          )}
        </div>

        {/* Placement Type */}
        <div className="space-y-3 pt-2">
          <label className="block text-gray-900 font-semibold">
            What is this placement for? <span className="text-red-500">*</span>
          </label>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={formData.placementReason === 'mandatory'}
                onChange={() => handleInputChange('placementReason', 'mandatory')}
                className="sr-only"
              />
              <span className="mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0">
                {formData.placementReason === 'mandatory' && (
                  <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />
                )}
              </span>
              <div className="text-gray-800 font-medium">
                Mandatory <span className="text-gray-500 font-normal">(Requirement for course completion)</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={formData.placementReason === 'voluntary'}
                onChange={() => handleInputChange('placementReason', 'voluntary')}
                className="sr-only"
              />
              <span className="mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0">
                {formData.placementReason === 'voluntary' && (
                  <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />
                )}
              </span>
              <div className="text-gray-800 font-medium">
                Voluntary <span className="text-gray-500 font-normal">(Work experience / additional)</span>
              </div>
            </label>
          </div>

          {errors.placementReason && (
            <p className="text-red-500 text-xs">{errors.placementReason}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 bg-[#12692e] hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <span>Save & Continue</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </form>
    </div>
  );
};

export default EducationPlacementForm;