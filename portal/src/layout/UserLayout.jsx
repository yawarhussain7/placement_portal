import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from '../components/common/Slidebar'

const UserLayout = () => {
  return (
    <div className='flex h-screen'>
        <Sidebar/>
        <Outlet/>
    </div>  
  )
}

export default UserLayout