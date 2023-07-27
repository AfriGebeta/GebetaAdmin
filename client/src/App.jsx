import React from 'react'
import { SideBar,ApiKeyPage } from './components'

const App = () => (
    <div className='bg-primary w-full overflow-hidden flex absolute'>
      <div className='fixed'>
        <SideBar/>
      </div>
      <div className="relative left-[70px] md:left-[250px] sm:left-[200px] w-11/12 " >
        <ApiKeyPage />
      </div>
    </div>
)

export default App