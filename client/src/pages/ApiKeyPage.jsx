import React from 'react'
import { ApiKeyTable } from '../components'

const ApiKeyPage = () => {
  return (
    <div className='h-full w-full flex flex-col p-5 ss:p-10'>
        {/* Design above the ApiKey-table */}
        <div className='bg-primary h-2/6'>
            Above ApiKey Table
        </div>
        {/* ApiKey Table */}
        <div className='bg-primary w-full'>
            <h1 className="text-[18px] mb-10">ApiKeys</h1>
            <ApiKeyTable/>
        </div>
        {/* Footer */}
        <div className='bg-primary w-[100%] flex-1 min-h-[60px]'>
            Footer
        </div>
    </div>
  )
}

export default ApiKeyPage