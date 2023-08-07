import { Logo } from "../assets";

const UsageBoxs = () => {
  return (
    <div className=" w-full mx-auto  grid grid-cols-3 grid-rows-2 gap-4 mb-8">
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
          <div className="text-5xl">0</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">Matrix</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col">
          <div className="text-5xl">0</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">Direction</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col">
          <div className="text-5xl">43</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
      <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
        <div className=" flex-2  self-start flex flex-col h-fit col-span-5">
          <p className=" font-bold text-2xl self-start">TSS</p>
          <p className=" text-slate-400 text-xs  mt-[-7px]">endpoint</p>
        </div>
        <div className="self-end col-span-5 justify-end  grid grid-flow-col pt-4">
          <div className="text-5xl">0</div>
          <div className=" text-xs self-end">calls</div>
        </div>
      </div>
    </div>
  );
};

export default UsageBoxs;
