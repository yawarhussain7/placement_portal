import React from 'react'
import My_Application from '../../../components/my_application/My_Application'
import Template from '../../../components/common/Template'

const MyApplication = () => {
  return (
    <Template
      Component={My_Application}
      title="My Application"
      description="View and manage your placement applications"
      step={2}
    />
  )
}

export default MyApplication