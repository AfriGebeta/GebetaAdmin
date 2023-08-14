import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";


function LineChart({ chartData, options }) {
  return (
    <div className=" mx-auto  p-5">
      <div>
        <p className=" text-2xl font-semibold">API Usage</p>
        <p> Track your api usage here</p>
      </div>
      <div className=" border-2 border-dashed rounded  border-gray-600 w-full p-10 ">
        <div>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
    // <div>

    // </div>
  );
}

export default LineChart;
