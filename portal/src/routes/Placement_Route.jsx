import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import PersonalDetailsPage from '../pages/new_placement/PersonalDetailsPage'
import PlacementPerformancePage from '../pages/new_placement/placement_performancePage/Placement_Performance'
import Documents from '../pages/new_placement/document/Documents'
import Course from '../pages/new_placement/course/Course'
import ReportS from '../pages/reports/ReportS'

const Placement_Route = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="personal-details" replace />} />

      <Route
        path="personal-details"
        element={<PersonalDetailsPage />}
      />

      <Route
        path="course-details"
        element={<Course />}
      />

      <Route
        path="placement-preference"
        element={<PlacementPerformancePage />}
      />

      <Route
        path="documents"
        element={<Documents />}
      />

      <Route
        path="report-submit"
        element={<ReportS />}
      />
    </Routes>
  )
}

export default Placement_Route
