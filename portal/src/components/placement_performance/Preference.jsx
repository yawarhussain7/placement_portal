import React, { useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { SelectField } from './SelectField';
import { RadioGroup } from './RadioGroup';
import { TextArea } from './TextArea';
import { usePlacementForm } from '../../context/PlacementFormContext.jsx';

const Placement_Performance = ({ onBack, onNext }) => {
  const { placementForm, updatePreference } = usePlacementForm()

  const [formData, setFormData] = useState({
    industry: placementForm.preference.industry || '',
    role: placementForm.preference.role || '',
    location: placementForm.preference.location || '',
    relocate: placementForm.preference.relocate || 'yes',
    availability: placementForm.preference.availability || '',
    workingHours: placementForm.preference.workingHours || '',
    notes: placementForm.preference.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const [selectedDays, setSelectedDays] = useState(placementForm.preference.availableDays?.length > 0 ? placementForm.preference.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [placement, setPlacement] = useState(placementForm.preference.placementType || 'on-site');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.industry)
      newErrors.industry = "Industry is required";

    if (!formData.location)
      newErrors.location = "Location is required";

    if (!formData.availability)
      newErrors.availability = "Availability is required";

    if (selectedDays.length === 0)
      newErrors.days = "Select at least one day";

    if (!placement)
      newErrors.placement = "Placement type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!validate()) return;

    const payload = {
      ...formData,
      availableDays: selectedDays,
      placementType: placement
    };

    updatePreference(payload);
    onNext();
  };

  return (
    <div className=" p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
      <form onSubmit={handleForm} className="space-y-6">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectField
              label="Preferred Industry / Field"
              required
              placeholder="Select preferred industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              options={[
                'Aged Care',
                'Disability Support',
                'Early Childhood Education',
                'Community Services',
                'Mental Health',
                'Youth Work',
                'Child Protection',
                'Allied Health',
                'Nursing & Midwifery',
                'Social Work',
                'Family Services',
                'Homelessness & Housing',
                'Alcohol & Drug Services',
                'Other',
              ]}
            />
            {touched && errors.industry && (
              <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
            )}
          </div>

          <SelectField
            label="Preferred Role / Department"
            placeholder="Select preferred role (optional)"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            options={[
              'Support Worker',
              'Personal Care Assistant',
              'Early Childhood Educator',
              'Community Support Worker',
              'Case Worker',
              'Youth Worker',
              'Mental Health Support Worker',
              'Allied Health Assistant',
              'Enrolled Nurse',
              'Social Work Student',
              'Administration / Reception',
              'Other',
            ]}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectField
              label="Preferred Location"
              required
              placeholder="Select preferred location or area"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              options={[
                'Melbourne CBD',
                'Sydney CBD',
                'Brisbane CBD',
                'Perth CBD',
                'Adelaide CBD',
                'Canberra',
                'Regional / Remote',
                'Open to Any Location',
              ]}
            />
            {touched && errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          <RadioGroup
            label="Willing to Relocate?"
            required
            name="relocate"
            value={formData.relocate}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            onChange={(val) => handleInputChange('relocate', val)}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectField
              label="Availability to Start"
              required
              placeholder="Select your availability"
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              options={[
                'Immediately',
                'Within 2 weeks',
                'Within 1 month',
                'Within 2 months',
                'Within 3 months',
                'More than 3 months',
              ]}
            />
            {touched && errors.availability && (
              <p className="text-red-500 text-xs mt-1">{errors.availability}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-900 font-semibold mb-2">
              Days Available <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-lg font-medium border transition-all ${
                      isSelected
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {touched && errors.days && (
              <p className="text-red-500 text-xs mt-2">{errors.days}</p>
            )}
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-900 font-semibold mb-2">
              Preferred Placement Type <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {['on-site', 'hybrid', 'remote'].map((type) => {
                const isActive = placement === type;

                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setPlacement(type)}
                    className={`py-2.5 px-3 rounded-lg font-medium border text-center capitalize transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-green-50 border-green-600 text-green-700 font-semibold'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {isActive && <Check className="w-4 h-4 text-green-700" />}
                    <span>{type === 'on-site' ? 'On-site' : type}</span>
                  </button>
                );
              })}
            </div>

            {touched && errors.placement && (
              <p className="text-red-500 text-xs mt-2">{errors.placement}</p>
            )}
          </div>

          <SelectField
            label="Preferred Working Hours"
            placeholder="Select working hours (optional)"
            value={formData.workingHours}
            onChange={(e) => handleInputChange('workingHours', e.target.value)}
            options={[
              'Morning (6am – 12pm)',
              'Afternoon (12pm – 6pm)',
              'Evening (6pm – 10pm)',
              'Night Shift (10pm – 6am)',
              'Flexible / Any Hours',
            ]}
          />
        </div>

        {/* Row 5 */}
        <TextArea
          label="Tell us more about your preferences"
          optionalText="(optional)"
          placeholder="Type your preferences here..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#12692e] hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <span>Save & Continue</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </form>
    </div>
  );
};

export default Placement_Performance;