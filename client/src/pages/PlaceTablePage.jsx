import React from "react";
import PlaceTable from "../components/PlaceTable";

const PlaceTablePage = () => {
  return (
    <div className="h-full w-full flex flex-col p-5 ss:p-10 bg-primary">
      <div className="bg-primary w-full h-[90%] ">
        <h1 className="text-[18px] mb-10">Places</h1>
        <PlaceTable />
      </div>
    </div>
  );
};

export default PlaceTablePage;
