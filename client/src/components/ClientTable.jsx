import React, { useEffect, useState } from "react";
import { dummyClients } from "../constants/dummyClient";
import { Toggle, Up } from "../assets";
import axios from "axios";

const ClientTable = () => {
  const [Loading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://mapapi.gebeta.app/api/v1/getAllUsers")
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    const unknownCell = document.querySelectorAll("tr td:nth-child(3)");

    listner(unknownCell);
  }, [data]);

  return (
    <div className="pb-5">
      {/* Client Table on larger screens */}
      <div className="max-h-[270px] overflow-x-auto scrollbar-hide hidden ss:block">
        <div className=" w-[90%] scrollbar-hide">
          <table className="w-full overflow-y-auto">
            <thead className="sticky top-0 bg-primary text-secondary">
              <tr>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Name
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Subscription Type
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  API Key
                </th>
                <th className=""></th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Contact
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Total Usage (Calls)
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Revenue
                </th>
                <th className=""></th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Payment Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((client, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? " border-b border-gray-150"
                      : " border-b border-gray-200"
                  }
                >
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.username}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.subscriptionType}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold ">
                    <p className="truncate w-32">{client.token}</p>
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    <img
                      src={Toggle}
                      alt="gain-icon"
                      className="min-w-[15px] min-h-[15px] w-[12px] h-[12px]left-0"
                    />
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.email}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.totalUsage}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.revenue}
                  </td>
                  <td className="pb-3 pt-3 pr-5">
                    <img
                      src={Up}
                      alt="gain-icon"
                      className="min-w-[15px] min-h-[15px] w-[12px] h-[12px] left-0"
                    />
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.blocked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Client Table on Smaller Screens: Turns into a grid view */}
      <div className="grid grid-cols-1 gap-2 ss:hidden max-h-[250px] overflow-y-auto p-5">
        {dummyClients.map((client, index) => (
          <div
            key={index}
            className="bg-primary p-2 rounded-lg max-w-[95%] shadow-lg text-sm"
          >
            <div className="flex items-center gap-[5px] text-sm flex-wrap mb-3">
              <div className="underline">Usage: {client.totalUsage}</div>
              <div className="text-blue-400">{client.subscriptionType}</div>
              <div className="bg-green-200 tracking-wider uppercase p-[3px] rounded-lg text-[10px] min-w-[35px] text-center">
                Paid
              </div>
            </div>
            <div className="text-[12px] text-grey-50 flex flex-col mb-2">
              <div className="">{client.name}</div>
              <div className="">{client.contact}</div>
              <div className="flex gap-2">
                {client.apiKey}
                <img
                  src={Toggle}
                  alt="gain-icon"
                  className="min-w-[15px] min-h-[15px] w-[12px] h-[12px]left-0"
                />
              </div>
            </div>
            <div className="rounded-md flex">
              Revenue:
              <p className="text-green-600">{client.revenue}</p>
              <img
                src={Up}
                alt="gain-icon"
                className="min-w-[15px] min-h-[15px] w-[12px] h-[12px]left-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientTable;
function listner(cell) {
  cell.forEach((event) => {
    event.addEventListener("click", (e) => {
      e.preventDefault();
      const range = document.createRange();
      range.selectNodeContents(e.target);
      console.log(e.target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
}
