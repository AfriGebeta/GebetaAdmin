import React from 'react';
import { MainBody, SideBar } from '../components';


const Dashboard = () => (
    <div className='flex'>
        <div className='w-[70px] md:w-[250px] sm:w-[200px] h-screen'>
            <SideBar/>
        </div>
        <div className= "flex-1 overflow-x-auto" >
            <MainBody/>
        </div>
    </div>
)

export default Dashboard