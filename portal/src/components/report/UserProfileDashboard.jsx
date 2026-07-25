import React, { useState } from 'react';
import toast from 'react-hot-toast'
import {
  User, Mail, Phone, MapPin, GraduationCap, Award, Building2, Calendar,
  Clock, Briefcase, UserCheck, Radio, FileText, ArrowLeft, ArrowRight,
  ChevronDown, Check, Pencil, X
} from 'lucide-react';
import { usePlacementForm } from '../../context/PlacementFormContext.jsx';
import { submitPlacementApplication } from '../../Api/newplacement/placementSubmitApi.js';

// ─── Reusable inline field components ────────────────────────────────────────

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1 w-full sm:w-[calc(50%-1rem)]">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
    {children}
  </div>
);

const EditInput = ({ value, onChange, placeholder, type = 'text', required }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    required={required}
    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-gray-800 placeholder-gray-400"
  />
);

const EditSelect = ({ value, onChange, options, placeholder, required }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full appearance-none px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-gray-800 pr-8"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────

  const Section = ({ title, icon: Icon, editing, onEdit, onCancel, onSave, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md">
    <div className="flex justify-between items-center mb-5">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-green-50 rounded-full text-green-700">
          <Icon size={22} className="stroke-[1.5]" />
        </div>
        <h2 className="text-base font-semibold text-green-700">{title}</h2>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <X size={12} /> Cancel
          </button>
          <button type="submit" form={`form-${title.replace(/\s+/g, '-')}`} className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#12692e] hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition-colors">
            <Check size={12} /> Save
          </button>
        </div>
      ) : (
        <button type="button" onClick={onEdit} className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 border border-green-200 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
          <Pencil size={12} /> Edit
        </button>
      )}
    </div>
    {editing
      ? <form id={`form-${title.replace(/\s+/g, '-')}`} onSubmit={e => { e.preventDefault(); onSave(); }}>{children}</form>
      : children
    }
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function UserProfileDashboard({ onBack }) {
  const { placementForm, updatePersonal, updateCourse, updatePreference } = usePlacementForm()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // ── Personal Details ──
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personal, setPersonal] = useState({
    fullName: placementForm.personal.fullName || 'John Smith',
    email: placementForm.personal.email || 'john.smith@email.com',
    phoneNumber: placementForm.personal.phoneNumber || '412 345 678',
    dob: placementForm.personal.dob || '15/06/1995',
    gender: placementForm.personal.gender || 'Male',
    address: placementForm.personal.address || '25 Collins Street',
    suburb: placementForm.personal.suburb || 'Melbourne',
    state: placementForm.personal.state || 'VIC',
    postcode: placementForm.personal.postcode || '3000',
    isCitizen: placementForm.personal.isCitizen || 'Yes'
  });
  const [personalDraft, setPersonalDraft] = useState(personal);
  const pSet = field => val => setPersonalDraft(p => ({ ...p, [field]: val }));

  // ── Course Details ──
  const [editingCourse, setEditingCourse] = useState(false);
  const [course, setCourse] = useState({
    course: placementForm.course.course || 'Certificate III in Individual Support (Ageing)',
    institution: placementForm.course.institution || 'Inspire Education',
    courseCode: placementForm.course.courseCode || 'CHC33015',
    studyStatus: placementForm.course.studyStatus || 'Currently Enrolled',
    completionDate: placementForm.course.completionDate || '2025-06-15',
    studyMode: placementForm.course.studyMode || 'full-time',
    placementReason: placementForm.course.placementReason || 'mandatory'
  });
  const [courseDraft, setCourseDraft] = useState(course);
  const cSet = field => val => setCourseDraft(p => ({ ...p, [field]: val }));

  // ── Placement Preferences ──
  const [editingPref, setEditingPref] = useState(false);
  const [pref, setPref] = useState({
    industry: placementForm.preference.industry || 'Aged Care',
    role: placementForm.preference.role || 'Support Worker',
    location: placementForm.preference.location || 'Melbourne CBD',
    relocate: placementForm.preference.relocate || 'yes',
    availability: placementForm.preference.availability || 'Immediately',
    workingHours: placementForm.preference.workingHours || 'Morning (6am – 12pm)',
    placementType: placementForm.preference.placementType || 'on-site',
    days: placementForm.preference.availableDays?.length > 0 ? placementForm.preference.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    notes: placementForm.preference.notes || ''
  });
  const [prefDraft, setPrefDraft] = useState(pref);
  const rSet = field => val => setPrefDraft(p => ({ ...p, [field]: val }));
  const toggleDay = day => setPrefDraft(p => ({
    ...p,
    days: p.days.includes(day) ? p.days.filter(d => d !== day) : [...p.days, day]
  }));

  // Count uploaded documents
  const docCount = Object.values(placementForm.documents).filter(f => f !== null).length
  const totalRequired = 3; // resume, photoId, studentId

  const handlePersonalSave = () => {
    setPersonal(personalDraft);
    updatePersonal(personalDraft);
    setEditingPersonal(false);
  };

  const handleCourseSave = () => {
    setCourse(courseDraft);
    updateCourse(courseDraft);
    setEditingCourse(false);
  };

  const handlePrefSave = () => {
    setPref(prefDraft);
    updatePreference({
      ...prefDraft,
      availableDays: prefDraft.days,
      placementType: prefDraft.placementType
    });
    setEditingPref(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const formData = new FormData();

      // Append personal details with flat keys (p_ prefix)
      Object.entries(personal).forEach(([key, val]) => {
        formData.append(`p_${key}`, String(val));
      });

      // Append course details with flat keys (c_ prefix)
      Object.entries(course).forEach(([key, val]) => {
        formData.append(`c_${key}`, String(val));
      });

      // Append preference details with flat keys (r_ prefix)
      Object.entries(pref).forEach(([key, val]) => {
        if (key === 'days') {
          formData.append('r_days', JSON.stringify(pref.days));
        } else {
          formData.append(`r_${key}`, String(val));
        }
      });

      // Append document files
      Object.entries(placementForm.documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await submitPlacementApplication(formData);
      if (response?.data?.success) {
        setSubmitSuccess(true);
        toast.success('Application submitted successfully!');
      } else {
        const errorMsg = response?.data?.message || 'Submission failed';
        setSubmitError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Server error during submission';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="w-full bg-gray-50/30 rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Application Submitted Successfully!</h2>
        <p className="text-gray-500 text-sm">Your placement application has been received.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl flex flex-col gap-5 p-6">

      {/* ── Personal Details ── */}
      <Section
        title="Personal Details" icon={User}
        editing={editingPersonal}
        onEdit={() => { setPersonalDraft(personal); setEditingPersonal(true); }}
        onCancel={() => setEditingPersonal(false)}
        onSave={handlePersonalSave}
      >
        {editingPersonal ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Full Name *</label>
              <EditInput value={personalDraft.fullName} onChange={pSet('fullName')} placeholder="Full name" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Email Address *</label>
              <EditInput value={personalDraft.email} onChange={pSet('email')} placeholder="Email" type="email" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Phone Number *</label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition-all">
                <div className="flex items-center gap-1 px-3 bg-gray-50 border-r border-gray-200 text-xs font-medium text-gray-700">
                  <img src="https://flagcdn.com/w20/au.png" alt="AU" className="w-5 h-3 object-cover rounded-sm" />
                  <span>+61</span>
                </div>
                <input type="tel" value={personalDraft.phoneNumber} onChange={e => pSet('phoneNumber')(e.target.value)} placeholder="412 345 678" required
                  className="w-full px-3 py-2 text-sm bg-white border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Date of Birth *</label>
              <EditInput value={personalDraft.dob} onChange={pSet('dob')} placeholder="DD/MM/YYYY" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Gender *</label>
              <EditSelect value={personalDraft.gender} onChange={pSet('gender')} placeholder="Select gender" required
                options={['Male', 'Female', 'Prefer not to say']} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Address *</label>
              <EditInput value={personalDraft.address} onChange={pSet('address')} placeholder="Street address" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Suburb *</label>
              <EditInput value={personalDraft.suburb} onChange={pSet('suburb')} placeholder="Suburb" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">State *</label>
                <EditSelect value={personalDraft.state} onChange={pSet('state')} placeholder="State" required
                  options={['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Postcode *</label>
                <EditInput value={personalDraft.postcode} onChange={pSet('postcode')} placeholder="Postcode" required />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Australian Citizen / PR? *</label>
              <div className="flex gap-6">
                {['Yes', 'No'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="radio" name="editCitizen" checked={personalDraft.isCitizen === opt}
                      onChange={() => pSet('isCitizen')(opt)} className="accent-green-600 w-4 h-4" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-600 text-sm">
            <Field label="Full Name"><span className="font-medium text-gray-800 flex items-center gap-2"><User size={15} className="text-gray-400" />{personal.fullName}</span></Field>
            <Field label="Phone"><span className="flex items-center gap-2"><Phone size={15} className="text-gray-400" />+61 {personal.phoneNumber}</span></Field>
            <Field label="Email"><span className="flex items-center gap-2"><Mail size={15} className="text-gray-400" />{personal.email}</span></Field>
            <Field label="Address"><span className="flex items-center gap-2"><MapPin size={15} className="text-gray-400" />{personal.address}, {personal.suburb} {personal.state} {personal.postcode}</span></Field>
            <Field label="Date of Birth"><span className="flex items-center gap-2"><Calendar size={15} className="text-gray-400" />{personal.dob}</span></Field>
            <Field label="Citizen / PR"><span className="flex items-center gap-2"><UserCheck size={15} className="text-gray-400" />{personal.isCitizen}</span></Field>
          </div>
        )}
      </Section>

      {/* ── Course Details ── */}
      <Section
        title="Course Details" icon={GraduationCap}
        editing={editingCourse}
        onEdit={() => { setCourseDraft(course); setEditingCourse(true); }}
        onCancel={() => setEditingCourse(false)}
        onSave={handleCourseSave}
      >
        {editingCourse ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Course / Qualification *</label>
              <EditSelect value={courseDraft.course} onChange={cSet('course')} placeholder="Select course" required
                options={['Certificate III in Individual Support (Ageing)','Certificate III in Individual Support (Disability)','Certificate III in Early Childhood Education and Care','Certificate III in Community Services','Certificate IV in Ageing Support','Certificate IV in Disability','Diploma of Community Services','Diploma of Nursing','Bachelor of Nursing','Bachelor of Social Work','Bachelor of Psychology','Other']} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">RTO / Institution *</label>
                <EditSelect value={courseDraft.institution} onChange={cSet('institution')} placeholder="Select institution" required
                  options={['Inspire Education','TAFE NSW','TAFE Queensland','TAFE Victoria','TAFE SA','TAFE WA','Swinburne University','RMIT University','Monash University','University of Melbourne','Deakin University','La Trobe University','Holmesglen Institute','Box Hill Institute','Chisholm Institute','Other']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Course Code <span className="font-normal text-gray-400">(if applicable)</span></label>
                <EditInput value={courseDraft.courseCode} onChange={cSet('courseCode')} placeholder="e.g. CHC33015" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Study Status *</label>
                <EditSelect value={courseDraft.studyStatus} onChange={cSet('studyStatus')} placeholder="Select status" required
                  options={['Currently Enrolled','Final Semester','Final Year','Awaiting Results','Recently Graduated']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Expected Completion Date *</label>
                <EditInput type="date" value={courseDraft.completionDate} onChange={cSet('completionDate')} required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Mode of Study *</label>
              <div className="flex gap-2">
                {['full-time', 'part-time', 'online'].map(mode => {
                  const active = courseDraft.studyMode === mode;
                  return (
                    <button key={mode} type="button" onClick={() => cSet('studyMode')(mode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${active ? 'bg-green-50 border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${active ? 'border-green-600' : 'border-gray-300'}`}>
                        {active && <span className="w-2 h-2 bg-green-600 rounded-full" />}
                      </span>
                      {mode.replace('-', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Placement For *</label>
              <div className="flex flex-col gap-2">
                {[{ val: 'mandatory', desc: 'Mandatory (Requirement for course completion)' }, { val: 'voluntary', desc: 'Voluntary (Work experience / additional)' }].map(({ val, desc }) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer">
                    <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${courseDraft.placementReason === val ? 'border-green-600' : 'border-gray-300'}`} style={{ width: 18, height: 18 }}>
                      {courseDraft.placementReason === val && <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                    </span>
                    <input type="radio" name="editPlacementReason" value={val} checked={courseDraft.placementReason === val}
                      onChange={() => cSet('placementReason')(val)} className="sr-only" />
                    <span className="text-sm text-gray-700">{desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-600 text-sm">
            <Field label="Course"><span className="flex items-center gap-2"><Award size={15} className="text-gray-400" /><span className="font-medium text-gray-800">{course.course}</span></span></Field>
            <Field label="Completion Date"><span className="flex items-center gap-2"><Calendar size={15} className="text-gray-400" />{course.completionDate}</span></Field>
            <Field label="Institution"><span className="flex items-center gap-2"><Building2 size={15} className="text-gray-400" />{course.institution}{course.courseCode && ` — ${course.courseCode}`}</span></Field>
            <Field label="Study Mode"><span className="flex items-center gap-2"><Clock size={15} className="text-gray-400" /><span className="capitalize">{course.studyMode.replace('-', ' ')}</span></span></Field>
            <Field label="Status"><span className="flex items-center gap-2"><GraduationCap size={15} className="text-gray-400" />{course.studyStatus}</span></Field>
            <Field label="Placement Type"><span className="flex items-center gap-2"><Radio size={15} className="text-gray-400" /><span className="capitalize">{course.placementReason}</span></span></Field>
          </div>
        )}
      </Section>

      {/* ── Placement Preferences ── */}
      <Section
        title="Placement Preferences" icon={Briefcase}
        editing={editingPref}
        onEdit={() => { setPrefDraft(pref); setEditingPref(true); }}
        onCancel={() => setEditingPref(false)}
        onSave={handlePrefSave}
      >
        {editingPref ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Industry / Field *</label>
                <EditSelect value={prefDraft.industry} onChange={rSet('industry')} placeholder="Select industry" required
                  options={['Aged Care','Disability Support','Early Childhood Education','Community Services','Mental Health','Youth Work','Child Protection','Allied Health','Nursing & Midwifery','Social Work','Family Services','Other']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Role / Department</label>
                <EditSelect value={prefDraft.role} onChange={rSet('role')} placeholder="Select role (optional)"
                  options={['Support Worker','Personal Care Assistant','Early Childhood Educator','Community Support Worker','Case Worker','Youth Worker','Mental Health Support Worker','Allied Health Assistant','Enrolled Nurse','Social Work Student','Administration / Reception','Other']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Preferred Location *</label>
                <EditSelect value={prefDraft.location} onChange={rSet('location')} placeholder="Select location" required
                  options={['Melbourne CBD','Melbourne - Inner North','Melbourne - Inner South','Melbourne - Inner East','Melbourne - Inner West','Melbourne - Outer North','Melbourne - Outer South','Melbourne - Outer East','Melbourne - Outer West','Geelong','Ballarat','Bendigo','Sydney CBD','Sydney - North','Sydney - South','Sydney - West','Brisbane CBD','Gold Coast','Perth CBD','Adelaide CBD','Canberra','Darwin','Hobart','Regional / Remote','Open to Any Location']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Availability to Start *</label>
                <EditSelect value={prefDraft.availability} onChange={rSet('availability')} placeholder="Select availability" required
                  options={['Immediately','Within 2 weeks','Within 1 month','Within 2 months','Within 3 months','More than 3 months']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Working Hours</label>
                <EditSelect value={prefDraft.workingHours} onChange={rSet('workingHours')} placeholder="Select hours (optional)"
                  options={['Morning (6am – 12pm)','Afternoon (12pm – 6pm)','Evening (6pm – 10pm)','Night Shift (10pm – 6am)','Flexible / Any Hours']} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Willing to Relocate? *</label>
                <div className="flex gap-6 mt-1">
                  {[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <input type="radio" name="editRelocate" checked={prefDraft.relocate === opt.value}
                        onChange={() => rSet('relocate')(opt.value)} className="accent-green-600 w-4 h-4" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Placement Type *</label>
              <div className="flex gap-2">
                {['on-site', 'hybrid', 'remote'].map(type => {
                  const active = prefDraft.placementType === type;
                  return (
                    <button key={type} type="button" onClick={() => rSet('placementType')(type)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${active ? 'bg-green-50 border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {active && <Check size={12} className="text-green-700" />}
                      {type === 'on-site' ? 'On-site' : type}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Days Available *</label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const selected = prefDraft.days.includes(day);
                  return (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Additional Notes</label>
              <textarea rows={3} value={prefDraft.notes} onChange={e => rSet('notes')(e.target.value)}
                placeholder="Any other preferences..."
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-gray-800 placeholder-gray-400 resize-y" />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-600 text-sm">
            <Field label="Industry"><span className="flex items-center gap-2"><Building2 size={15} className="text-gray-400" />{pref.industry}</span></Field>
            <Field label="Location"><span className="flex items-center gap-2"><MapPin size={15} className="text-gray-400" />{pref.location}</span></Field>
            <Field label="Role"><span className="flex items-center gap-2"><UserCheck size={15} className="text-gray-400" />{pref.role || '—'}</span></Field>
            <Field label="Placement Type"><span className="flex items-center gap-2"><Radio size={15} className="text-gray-400" /><span className="capitalize">{pref.placementType === 'on-site' ? 'On-site' : pref.placementType}</span></span></Field>
            <Field label="Availability"><span className="flex items-center gap-2"><Clock size={15} className="text-gray-400" />{pref.availability}</span></Field>
            <Field label="Days Available"><span className="flex items-center gap-2"><Calendar size={15} className="text-gray-400" />{pref.days.join(', ')}</span></Field>
          </div>
        )}
      </Section>

      {/* ── Documents ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-green-50 rounded-full text-green-700">
            <FileText size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-green-700 mb-0.5">Documents Uploaded</h2>
            <p className="text-sm text-gray-500">{docCount} of {totalRequired} required documents uploaded</p>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex justify-between items-center pt-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors">
          <ArrowLeft size={14} /><span>Back</span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 bg-[#12692e] hover:bg-emerald-800 disabled:bg-gray-400 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}