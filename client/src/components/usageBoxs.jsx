import { Logo } from "../assets";
import { useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { userId } from "../App";
import axios from "axios";

const getMonthlyMartixData = import.meta.env.VITE_GET_MONTHLY_MATRIX_DATA_API;
const UsageBoxs = () => {
  const UserId = useContext(userId);
  const [monthlyData, setMonthlyData] = useState({
    Direction: 0,
    Geocoding: 0,
    Matrix: 0,
    ONM: 0,
    TSS: 0,
  });
  const { isLoading, data, isError, isFetching } = useQuery(
    "monthly-data",
    () => {
      return axios.get(
        "https://mapapi.gebeta.app/api/v2/route/apicalls/getMonthlyMatrix?userid=1a2b3c4d5e6f"
      );
    }
  );
  useEffect(() => {
    console.log("data", data);
    setMonthlyData(
      data?.data?.data || {
        Direction: 0,
        Geocoding: 0,
        Matrix: 0,
        ONM: 0,
        TSS: 0,
      }
    );
  }, [data]);
  return (
    <div className=" w-full mx-auto  grid grid-cols-4 grid-rows-2 gap-4 mb-8 p-5 pb-0">
      <div className=" outline outline-2 outline-slate-300 row-span-2 p-5 grid">
        <div className=" grid grid-flow-col grid-flow-cols-6 gap-2 ">
          <div className="self-center justify-self-center ">
            <img src={Logo} alt="" className=" " />
          </div>
          <div className="col-span-5">
            <p className=" font-bold">API</p>
            <p className=" font-bold">DOCUMENTATION</p>
          </div>
        </div>
        <div className=" flex-2  self-start flex flex-col h-fit">
          <p className=" text-slate-400 text-xs">powered by</p>
          <p className=" font-bold text-2xl self-start mt-[-7px]">GebetaMaps</p>
        </div>
      </div>

      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">ONM</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end grid grid-flow-col">
          <div className="text-5xl">{monthlyData.ONM}</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">Matrix</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col">
          <div className="text-5xl">{monthlyData.Matrix}</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">Direction</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col">
          <div className="text-5xl">{monthlyData.Direction}</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">TSS</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col pt-4">
          <div className="text-5xl">{monthlyData.TSS}</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">Geocoding</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col pt-4">
          <div className="text-5xl">{monthlyData.Geocoding}</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
    </div>
  );
};

export default UsageBoxs;
