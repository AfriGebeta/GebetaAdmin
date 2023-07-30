import React from 'react'
import ClientTable from './ClientTable'

export const MainBody = () => {
  return (
    <div className='bg-primary w-[100%] h-[100vh]'>
      <div className='h-full w-full flex flex-col p-10'>
        {/* Design above the client-table */}
        <div className='bg-primary h-2/6'>
            Above Client
        </div>
        {/* Client Table */}
        <div className='bg-primary w-full'>
            <h1 className="text-[18px] mb-10">Client Managment</h1>
            <ClientTable/>
        </div>
        {/* Footer */}
        <div className='bg-primary w-[100%] flex-1 min-h-[60px]'>
            Footer
        </div>
      </div>
    </div>
  )
}
