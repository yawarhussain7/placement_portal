import React from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../../components/common/Template'
import My_Application from '../../../components/my_application/My_Application'

const Documents = () => {
  const navigate = useNavigate()
  return (
    <Template
      title="Documents"
      description="Upload your required documents"
      step={4}
    >
      <My_Application
        onBack={() => navigate('/new-placement/placement-preference')}
        onNext={() => navigate('/new-placement/report-submit')}
      />
    </Template>
  )
}

export default Documents
