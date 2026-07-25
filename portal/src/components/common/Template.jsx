import React from 'react'
import EmpHeader from '../Dashboard/EmpHeader'
import Sidebar from './Slidebar'
import Topbar from '../new_placement/Topbar'

const Template = ({ Component, children, title, description, step }) => (
  <div className="h-screen w-full bg-gray-50 flex antialiased font-sans overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <EmpHeader />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {title && <Topbar title={title} description={description} step={step} />}
        <div className="px-6 pb-6">
          {children ?? (Component && <Component />)}
        </div>
      </div>
    </div>
  </div>
)

export default Template
