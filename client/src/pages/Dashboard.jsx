import React from 'react';
import { MainBody, SideBar } from '../components';


const Dashboard = () => (
    <div>
        <div className='fixed'>
            <SideBar/>
        </div>
        <div className="relative left-[70px] md:left-[250px] sm:left-[200px]" >
            <MainBody/>
        </div>
    </div>
)

export default Dashboard