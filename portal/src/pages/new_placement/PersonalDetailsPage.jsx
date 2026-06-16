import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../components/common/Template'
import PersonalDetailsForm from '../../components/placement_performance/PersonalDetailsForm'
import { usePortalData } from '../../context/PortalDataContext'
import { usePlacementForm } from '../../context/PlacementFormContext'


const NEXT_ROUTE = '/new-placement/course-details'

export default function PersonalDetailsPage() {
  const navigate = useNavigate()
  const { data, updateAccount } = usePortalData()
  const { placementForm, updatePersonal } = usePlacementForm()

  const [formData, setFormData] = useState({
    fullName: placementForm.personal.fullName || data.account.fullName,
    email: placementForm.personal.email || data.account.email,
    phoneCountry: placementForm.personal.phoneCountry || '+61',
    phoneNumber: placementForm.personal.phoneNumber || data.account.phone?.replace('+61 ', '') || '',
    dob: placementForm.personal.dob || '',
    gender: placementForm.personal.gender || 'Male',
    address: placementForm.personal.address || '',
    suburb: placementForm.personal.suburb || '',
    state: placementForm.personal.state || 'VIC',
    postcode: placementForm.personal.postcode || '',
    isCitizen: placementForm.personal.isCitizen || 'Yes'
  })

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const handleNext = () => {
    updateAccount({
      ...data.account,
      fullName: formData.fullName,
      email: formData.email,
      phone: `${formData.phoneCountry} ${formData.phoneNumber}`.trim(),
    })
    updatePersonal({
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: `${formData.phoneCountry} ${formData.phoneNumber}`.trim(),
      phoneCountry: formData.phoneCountry,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      suburb: formData.suburb,
      state: formData.state,
      postcode: formData.postcode,
      isCitizen: formData.isCitizen,
    })
    navigate(NEXT_ROUTE)
  }

  return (
    <Template
      title="Personal Details"
      description="Fill in your personal information to get started"
      step={1}
    >
      <PersonalDetailsForm
        formData={formData}
        onInputChange={handleInputChange}
        onNext={handleNext}
        step={1}
      />
    </Template>
  )
}