import React from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../components/common/Template'
import UserProfileDashboard from '../../components/report/UserProfileDashboard'

const ReportS = () => {
  const navigate = useNavigate()
  return (
    <Template
      title="Reports & Submit"
      description="Review and submit your placement application"
      step={5}
    >
      <UserProfileDashboard
        onBack={() => navigate('/new-placement/documents')}
      />
    </Template>
  )
}

export default ReportS