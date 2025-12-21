import React from 'react'
import { Outlet } from 'react-router'

function DashboardLayout() {
  return (
    <div>
      side bar
      navbar
      <Outlet></Outlet>
    </div>
  )
}

export default DashboardLayout
