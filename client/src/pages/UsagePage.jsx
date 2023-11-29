import { useState, useContext, useEffect } from "react";
import { LineChart, UsageBoxs, UsagePageSearchForm } from "../components";
// import { UserData } from "../constants/Data"; // no need for static data anymore
import { userId } from "../App";
import { useQuery } from "react-query";
import axios from "axios";

const getGraphData = import.meta.env.VITE_GET_GRAPH_DATA_API;
const UsagePage = () => {
  const UserId = useContext(userId);
  const { isLoading, data, isError, isFetching } = useQuery(
    "graph-data",
    () => {
      return axios.get(getGraphData + UserId);
    }
  );
  const [userData, setUserData] = useState({
    labels: Object.entries(data?.data?.data || {}).map(
      ([key, value]) => key.split("-")[0]
    ),
    datasets: [
      {
        label: "Api Usage Graph",
        data: Object.entries(data?.data?.data || {}).map(
          ([key, value]) => value
        ),
        borderColor: "rgb(196, 107, 19)",
        pointBackgroundColor: "rgb(196, 107, 19)",
        pointBorderColor: "rgb(196, 107, 19)",
        backgroundColor: "rgb(69, 49, 25)",
        fill: true,
      },
    ],
  });
  useEffect(() => {
    // console.log("data", data?.data?.data);
    setUserData({
      labels: Object.entries(data?.data?.data || {}).map(
        ([key, value]) => key.split("-")[0]
      ),
      datasets: [
        {
          label: "Api Usage Graph",
          data: Object.entries(data?.data?.data || {}).map(([key, value]) => {
            return value;
          }),
          borderColor: "rgb(196, 107, 19)",
          pointBackgroundColor: "rgb(196, 107, 19)",
          pointBorderColor: "rgb(196, 107, 19)",
          backgroundColor: "rgb(69, 49, 25)",
          fill: true,
        },
      ],
    });
  }, [isFetching]);

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

  return (
    <div className=" m-5 ">
      <UsagePageSearchForm />

      <UsageBoxs />

      {/* graph */}
      <LineChart chartData={userData} options={options} />
    </div>
  );
};

export default UsagePage;
