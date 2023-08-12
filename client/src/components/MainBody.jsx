import React from 'react'

import { ActivitiesPage } from '../pages'
import { ClientMgmtPage } from '../pages'
import UsagePage from './usagePage'

export const MainBody = () => {
  return (
    <div className='bg-primary w-full h-[100vh]'>
      {/* <ClientMgmtPage/> */}
      {/* <ActivitesPage/> */}
      <UsagePage />
    </div>
  )
}
