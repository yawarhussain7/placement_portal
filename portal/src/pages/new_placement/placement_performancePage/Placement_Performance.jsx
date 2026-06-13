import React from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../../components/common/Template'
import PreferenceForm from '../../../components/placement_performance/Preference'

const PlacementPerformancePage = () => {
  const navigate = useNavigate()
  return (
    <Template
      title="Placement Preference"
      description="Help us understand your placement preferences"
      step={3}
    >
      <PreferenceForm
        onBack={() => navigate('/new-placement/course-details')}
        onNext={() => navigate('/new-placement/documents')}
      />
    </Template>
  )
}

export default PlacementPerformancePage
