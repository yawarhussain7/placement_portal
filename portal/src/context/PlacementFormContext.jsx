/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'

const PlacementFormContext = createContext(null)

const defaultFormData = {
  personal: {
    fullName: '',
    email: '',
    phoneNumber: '',
    phoneCountry: '+61',
    dob: '',
    gender: 'Male',
    address: '',
    suburb: '',
    state: 'VIC',
    postcode: '',
    isCitizen: 'Yes'
  },
  course: {
    course: '',
    institution: '',
    courseCode: '',
    studyStatus: '',
    completionDate: '',
    studyMode: 'full-time',
    placementReason: 'mandatory'
  },
  preference: {
    industry: '',
    role: '',
    location: '',
    relocate: 'yes',
    availability: '',
    workingHours: '',
    notes: '',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    placementType: 'on-site'
  },
  documents: {
    resume: null,
    photoId: null,
    studentId: null,
    transcript: null,
    certificates: null,
    additional: null
  }
}

export function PlacementFormProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData)

  const actions = useMemo(() => ({
    updatePersonal: (data) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, ...data } })),
    updateCourse: (data) => setFormData(prev => ({ ...prev, course: { ...prev.course, ...data } })),
    updatePreference: (data) => setFormData(prev => ({ ...prev, preference: { ...prev.preference, ...data } })),
    updateDocuments: (data) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, ...data } })),
    resetPlacementForm: () => setFormData(defaultFormData),
  }), [])

  const value = useMemo(() => ({ placementForm: formData, ...actions }), [formData, actions])

  return (
    <PlacementFormContext.Provider value={value}>
      {children}
    </PlacementFormContext.Provider>
  )
}

export const usePlacementForm = () => {
  const ctx = useContext(PlacementFormContext)
  if (!ctx) throw new Error('usePlacementForm must be used within PlacementFormProvider')
  return ctx
}