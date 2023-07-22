import React from 'react'
import { SideBar } from './components'

const App = () => (
    <div className='bg-primary w-full overflow-hidden flex absolute'>
      <div className='fixed'>
        <SideBar/>
      </div>
      <div className="relative left-[70px] md:left-[250px] sm:left-[200px]" >
        
      </div>
    </div>
)

export default App