import React from 'react'
import { ClientMgmtPage } from '../pages'
import UsagePage from './usagePage'

export const MainBody = () => {
  return (
    <div className='bg-primary w-[100%] h-[100vh]'>
      {/* <ClientMgmtPage/> */}
      <UsagePage />
    </div>
  )
}
