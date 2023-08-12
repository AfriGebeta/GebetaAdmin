import { useState } from "react";
import {LineChart, UsageBoxs, UsagePageSearchForm} from "../components";
import { UserData } from "../constants/Data";

const UsagePage = () => {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Api Usage Graph",
        data: UserData.map((data) => data.userGain),
        borderColor: "rgb(196, 107, 19)",
        pointBackgroundColor: "rgb(196, 107, 19)",
        pointBorderColor: "rgb(196, 107, 19)",
        backgroundColor: "rgb(69, 49, 25)",
        fill: true,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Api Usage Graph",
      },
    },
    scales: {
      y: {
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  // console.log(userData);
  return (
    // TODO
    // 1. complete the uperpart of the page
    // 2. complete the graph
    <div className=" m-5 ">
      <UsagePageSearchForm/>
      
      <UsageBoxs />

      {/* graph */}
        <LineChart chartData={userData} options={options} />
    </div>
  );
};

export default UsagePage;
