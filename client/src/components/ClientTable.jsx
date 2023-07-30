import React from 'react';
import { dummyClients } from '../constants/dummyClient';
import { Toggle, Up } from '../assets';

const ClientTable = () => {
  return (
    <div className='pb-5'>
      <div className='max-h-[270px] overflow-x-auto scrollbar-hide'>
        <div className=" w-[90%] scrollbar-hide">
          <table className='w-full overflow-y-auto'>
            <thead className='sticky top-0 bg-primary text-secondary'>
              <tr>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>Name</th>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>Subscription Type</th>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>API Key</th>
                <th className=''></th>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>Contact</th>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>Total Usage (Calls)</th>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>Revenue</th>
                <th className=''></th>
                <th className='pb-5 text-[11px] font-normal tracking-wide text-left'>Payment Status</th>
              </tr>
            </thead>

            <tbody>
              {dummyClients.map((client, index) => (
                <tr key={index} className={index % 2 === 0 ? ' border-b border-gray-150' : ' border-b border-gray-200'}>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.name}</td>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.subscriptionType}</td>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.apiKey}</td>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>
                    <img src={Toggle} alt="gain-icon" className='min-w-[15px] min-h-[15px] w-[12px] h-[12px]left-0'/>
                  </td>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.contact}</td>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.totalUsage}</td>
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.revenue}</td>                
                  <td className='pb-3 pt-3 pr-5'>
                    <img src={Up} alt="gain-icon" className='min-w-[15px] min-h-[15px] w-[12px] h-[12px] left-0'/>
                  </td>                
                  <td className='pb-3 pt-3 pr-5 text-[12px] font-semibold'>{client.paymentStatus}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;