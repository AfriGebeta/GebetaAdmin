import React, { useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { useState } from "react";
import { userContext } from "../App";
import axios from "axios";
import PlaceSearch from "./PlaceSearch";

const active =
  "m-1 relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
const notActive =
  "m-1 relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex";
const pageSize = 100;

const PlaceTable = () => {
  const token = useContext(userContext);
  const getAllPlaces = import.meta.env.VITE_GETALLPLACE_API + token;
  let getPlace = import.meta.env.VITE_GET_PLACE_API;
  getPlace = getPlace.replace("{token}", token);
  const [paginated, setPaginated] = useState([]);
  const [startIndex, setStartIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("");

  const { isLoading, data, isError } = useQuery("places", () => {
    return axios.get(getAllPlaces);
  });
  const {
    isLoading: placeIsLoading,
    data: placeData,
    isError: placeIsError,
    refetch,
    isFetched,
  } = useQuery("place", () => axios.get(searchData), {
    enabled: false,
  });

  useEffect(() => {
    setPaginated(data?.data?.data?.slice(0, pageSize));
    // console.log("data", placeData);
  }, [isLoading, placeIsLoading]);

  useEffect(() => {
    if (placeData) {
      setPaginated(placeData?.data?.data?.slice(0, pageSize));
      // console.log("data", placeData);
    }
  }, [placeData, placeIsLoading]);

  useEffect(() => {
    setPaginated(data?.data.slice(startIndex - 1, startIndex + pageSize - 1));
  }, [startIndex]);

  useEffect(() => {
    setStartIndex(
      currentPage == 1 ? currentPage : (currentPage - 1) * pageSize
    );
  }, [currentPage]);

  useEffect(() => {
    // console.log("chage", searchData);
    refetch();
  }, [searchData]);

  const pages = range(1, data?.data.length);

  function clickHandler(pageNo) {
    setCurrentPage(pageNo);
  }

  function Handle(searchValue) {
    getPlace = getPlace + searchValue;
    // refetch();

    setSearchData(getPlace);
    // console.log("hello");
  }

  return (
    <>
      <PlaceSearch onClick={Handle} />
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
                      {client.name}
                    </td>
                    <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                      {client.latitude}
                    </td>
                    <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold ">
                      <p className="truncate w-32">{client.longitude}</p>
                    </td>
                    <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                      {client.city}
                    </td>
                    <td className="pb-3 pt-3 pr-5 text-[12px] font-semibold">
                      {client.country}
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
    </>
  );
};

export default PlaceTable;

function range(start, end, step = 1) {
  const length = Math.floor(Math.abs(end / pageSize));
  return Array.from({ length }, (_, index) => start + index * step);
}
