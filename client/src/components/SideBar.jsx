import React from 'react'
import { styles } from '../styles'
import {Clients, Logo, Logout, Projects, Home, ClientMgmt, ApiKey, Newsletter, OngoingProjects, Meetings, Basket} from '../assets'

const SideBar = () => {
  return (
    <div className='bg-secondary w-[70px] md:w-[250px] sm:w-[200px] h-screen fixed pt-4 pl-2 pr-2 pb-4 sm:p-6 flex flex-col gap-3'>

        {/* Main Logo Here */}
        <div>
            <img src={Logo} alt="Gebeta-Logo" className='pb-5 h-[40px] sm:h-[60px]'/>
        </div>


        {/* Clients */}
        <div>
            <div className='flex gap-2 pb-5'>
                <img src={Clients} alt="" className='w-[25px] h-[25px]' />
                <p className='hidden sm:flex'>Clients</p>
            </div>
            

            <div className='md:bg-secondary bg-shadedGrey pl-4 overflow-hidden rounded-[10px]'>
                <ul className='flex flex-col gap-2'>
                    {/* Home */}
                    <li>
                        <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={Home} alt="" className='w-[25px] h-[25px] hover:scale-105'/>
                            <p className='hidden sm:flex'>Home</p>
                        </a>
                    </li>
                    {/* Client Managment */}
                    <li>
                        <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={ClientMgmt} alt="" className='w-[25px] h-[25px] hover:scale-105' />
                            <p className='hidden sm:flex'>Client Managment</p>
                        </a>
                    </li>
                    {/* API Keys */}
                    <li>
                        <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={ApiKey} alt="" className='w-[25px] h-[25px] hover:scale-105' />
                            <p className='hidden sm:flex'>API Keys</p>
                        </a>
                    </li>
                    {/* NewsLetter */}
                    <li>
                         <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={Newsletter} alt="" className='w-[25px] h-[25px] hover:scale-105' />
                            <p className='hidden sm:flex'>Newsletter</p>
                        </a>
                    </li>
                </ul>
            </div>

        </div>


        {/* Projects */}
        <div>
            <div className='flex gap-2 pb-5'>
                <img src={Projects} alt="" className='w-[25px] h-[25px]' />
                <p className='hidden sm:flex'>Projects</p>
            </div>

            <div className='md:bg-secondary bg-shadedGrey pl-4 overflow-hidden rounded-[10px]'>
                <ul className='flex flex-col gap-2'>
                    {/* Ongoing Projects */}
                    <li>
                        <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={OngoingProjects} alt="" className='w-[25px] h-[25px] hover:scale-105' />
                            <p className='hidden sm:flex'>Ongoing Projects</p>
                        </a>
                    </li>
                    {/* Meetings */}
                    <li>
                        <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={Meetings} alt="" className='w-[25px] h-[25px] hover:scale-105' />
                            <p className='hidden sm:flex'>Meetings</p>
                        </a>
                    </li>
                    {/* Basket */}
                    <li>
                        <a href="#" className='flex gap-2 hover:text-primary'>
                            <img src={Basket} alt="" className='w-[25px] h-[25px] hover:scale-105' />
                            <p className='hidden sm:flex'>Basket</p>
                        </a>
                    </li>
                </ul>
            </div>

        </div>

        <div className='bottom-6 fixed'>
            <a href="#" className='flex gap-2 hover:text-primary'>
                <img src={Logout} alt="" className='w-[30px] h-[30px] hover:scale-105' />
                <p className='hidden sm:flex'>Logout</p>
            </a>
        </div>
    </div>
  )
}

export default SideBar