import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useState } from "react";
import axios from "axios";

const active =
  "m-1 relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
const notActive =
  "m-1 relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex";
const pageSize = 100;

const PlaceTable = () => {
  const [paginated, setPaginated] = useState([]);
  const [startIndex, setStartIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data, isError } = useQuery("places", () => {
    return axios.get(
      // "https://mapapi.gebeta.app/api/v1/getAllPlaces?page=1&apiKey=[token]"
      "https://jsonplaceholder.typicode.com/photos"
    );
  });

  useEffect(() => {
    setPaginated(data?.data.slice(0, pageSize));
  }, [isLoading]);

  useEffect(() => {
    setPaginated(data?.data.slice(startIndex - 1, startIndex + pageSize - 1));
  }, [startIndex]);

  useEffect(() => {
    setStartIndex(
      currentPage == 1 ? currentPage : (currentPage - 1) * pageSize
    );
  }, [currentPage]);

  const pages = range(1, data?.data.length);

  function clickHandler(pageNo) {
    setCurrentPage(pageNo);
  }
  return (
    <div className="pb-5">
      <div className="max-h-[700px] overflow-x-auto scrollbar-hide hidden ss:block">
        <div className=" w-[90%] scrollbar-hide">
          <table className="w-full overflow-y-auto">
            <thead className="sticky top-0 bg-primary text-secondary">
              <tr>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Name
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Latitude
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Longitude
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  City
                </th>
                <th className="pb-5 text-[11px] font-normal tracking-wide text-left">
                  Contry
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated?.map((client, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? " border-b border-gray-150"
                      : " border-b border-gray-200"
                  }
                >
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.id}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.albumId}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold ">
                    <p className="truncate w-32">{client.url}</p>
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.title}
                  </td>
                  <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                    {client.thumbnailUrl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="m-5">
        {pages.map((page) => {
          return (
            <ul
              className={page === currentPage ? active : notActive}
              key={page}
              onClick={() => clickHandler(page)}
            >
              {page}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default PlaceTable;

function range(start, end, step = 1) {
  const length = Math.floor(Math.abs(end / pageSize));
  return Array.from({ length }, (_, index) => start + index * step);
}
