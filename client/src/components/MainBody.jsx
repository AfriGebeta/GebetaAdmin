import React from 'react'

import { ActivitiesPage, ApiKeyPage } from '../pages'
import { ClientMgmtPage } from '../pages'
import UsagePage from '../pages/UsagePage'
import { Route, Routes } from 'react-router-dom'

export const MainBody = () => {
  return (
    <div className='bg-primary w-full h-[100vh]'>
      <Routes>
        <Route path = "/dashboard/usage" element = {<UsagePage/>}/>
        <Route path = "/dashboard/clientmanagement" element = {<ClientMgmtPage/>}/>
        <Route path = "/dashboard/apikeys" element = {<ApiKeyPage/>}/>
        <Route path = "/dashboard/activities" element = {<ActivitiesPage/>}/>
      </Routes>
    </div>
  )
}
