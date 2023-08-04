import { Logo } from "../assets";

const UsagePage = () => {
  return (
    // TODO
    // 1. complete the uperpart of the page
    // 2. complete the graph
    <div className=" mx-5 ">
      <div className=" w-full mx-auto  grid grid-cols-3 grid-rows-2 gap-4 p-5">
        <div className=" outline outline-2 outline-slate-300 row-span-2 p-2 grid pl-8 align-middle">
          <div className=" grid grid-flow-col grid-flow-cols-6 gap-2 ">
            <div className="self-center justify-self-center ">
              <img src={Logo} alt="" className=" " />
            </div>
            <div className="col-span-5">
              <p className=" font-bold">API</p>
              <p className=" font-bold">DOCUMENTATION</p>
            </div>
          </div>
          <div className=" flex-2  self-start">
            <p className=" text-slate-400 text-xs">powered by</p>
            <p className=" font-bold text-2xl">GebetaMaps</p>
          </div>
        </div>

        <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
          <div className=" col-span-8 ">
            <p className=" font-bold text-2xl">ONM</p>
            <p className=" text-gray-300 ">endpoint</p>
          </div>
          <div className="self-end col-span-1  grid grid-flow-col">
            <div className="text-5xl">0</div>
            <div className=" text-xs self-end">calls</div>
          </div>
        </div>
        <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
          <div className=" col-span-8 ">
            <p className=" font-bold text-2xl">Matrix</p>
            <p className=" text-gray-300 ">endpoint</p>
          </div>
          <div className="self-end col-span-1  grid grid-flow-col">
            <div className="text-5xl">0</div>
            <div className=" text-xs self-end">calls</div>
          </div>
        </div>
        <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
          <div className=" col-span-8 ">
            <p className=" font-bold text-2xl">Direction</p>
            <p className=" text-gray-300 ">endpoint</p>
          </div>
          <div className="self-end col-span-1  grid grid-flow-col">
            <div className="text-5xl">43</div>
            <div className=" text-xs self-end">calls</div>
          </div>
        </div>
        <div className=" p-2  outline outline-2 outline-black grid grid-flow-col grid-cols-10 w-full">
          <div className=" col-span-8 ">
            <p className=" font-bold text-2xl">Tss</p>
            <p className=" text-gray-300 ">endpoint</p>
          </div>
          <div className="self-end col-span-1  grid grid-flow-col">
            <div className="text-5xl">0</div>
            <div className=" text-xs self-end">calls</div>
          </div>
        </div>
      </div>

      {/* graph */}
      <div>
        <div>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;
