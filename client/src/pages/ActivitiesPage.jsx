import React, { useState } from 'react'
import { styles } from '../styles'
import { SearchIcon } from '../assets'
import { MapArea } from '../components'
import { dummyPlaces } from '../constants/dummyPlaces' 

const ActivitiesPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    const handleSearchInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchInput(inputValue);
    
        const filtered = dummyPlaces.filter(item =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredResults(filtered);
    };

    return (
    <div className= {`w-full h-full pt-[10px]`}>
        {/* Search Bar */}
        <div className= {`${styles.flexCenter} w-full h-[200px]`}>
            <form className= "w-75 ss:w-[75%]">
                <div className='flex justify-between overflow-hidden rounded-md bg-white shadow shadow-black/20'>

                    <input type="text" className='block w-full flex-1 py-2 px-3 focus:outline-none' placeholder='Start Typing' value={searchInput} onChange={handleSearchInputChange}/>

                    {filteredResults.length > 0 && searchInput !== '' && (
                        <div className="absolute mt-6 ss:mt-10 bg-white w-[60%] max-h-[80px] border border-gray-300 rounded-md shadow-lg overflow-hidden overflow-y-auto">
                            {filteredResults.map(item => (
                            <div
                                key={item.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {item.name}
                            </div>
                            ))}
                        </div>
                    )}

                    <span className='m-1 inline-flex cursor-pointer items-center rounded-md bg-secondary p-2 hover:bg-colorAction'>
                        <img src={SearchIcon} alt="search-button" className='w-[20px] h-[20px]' />
                    </span>

                </div>
            </form>

        </div>
        
        {/* Map Area */}
        <div className= {`${styles.flexCenter} p-5`}>
                <MapArea/>
        </div>
    </div>
    )
}

export default ActivitiesPage