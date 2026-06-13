import React from 'react'
import { useNavigate } from 'react-router-dom'
import EducationPlacementForm from '../../../components/course/EducationPlacementForm'
import Template from '../../../components/common/Template'

const Course = () => {
  const navigate = useNavigate()
  return (
    <Template
      title="Course Details"
      description="Tell us about your course and study information"
      step={2}
    >
      <EducationPlacementForm
        onBack={() => navigate('/new-placement/personal-details')}
        onNext={() => navigate('/new-placement/placement-preference')}
      />
    </Template>
  )
}

export default Course