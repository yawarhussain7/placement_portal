import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../components/common/Template'
import PersonalDetailsForm from '../../components/Dashboard/PersonalDetailsForm'
import { usePortalData } from '../../context/PortalDataContext'

const NEXT_ROUTE = '/new-placement/course-details'

export default function PersonalDetailsPage() {
  const navigate = useNavigate()
  const { data, updateAccount } = usePortalData()
  const [formData, setFormData] = useState({
    fullName: data.account.fullName, email: data.account.email, phoneCountry: '+61', phoneNumber: data.account.phone.replace('+61 ', ''),
    dob: '', gender: '', address: '', suburb: '', state: '', postcode: '', isCitizen: 'Yes'
  })

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const handleNext = () => {
    updateAccount({
      ...data.account,
      fullName: formData.fullName,
      email: formData.email,
      phone: `${formData.phoneCountry} ${formData.phoneNumber}`.trim(),
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
