import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

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
        element={
          <ProtectedRoute>
            <PersonalDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="course-details"
        element={
          <ProtectedRoute>
            <Course />
          </ProtectedRoute>
        }
      />

      <Route
        path="placement-preference"
        element={
          <ProtectedRoute>
            <PlacementPerformancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path="report-submit"
        element={
          <ProtectedRoute>
            <ReportS />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default Placement_Route