import React from 'react'
import { ApiKeyTable } from '../components'

const ApiKeyPage = () => {
  return (
    <div className='h-full w-full flex flex-col p-5 ss:p-10'>
       
        {/* ApiKey Table */}
        <div className='bg-primary w-full h-[90%]'>
            <h1 className="text-[18px] mb-10">ApiKeys</h1>
            <ApiKeyTable/>
        </div>
      
    </div>
  )
}

export default ApiKeyPage