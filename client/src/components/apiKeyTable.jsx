import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const ApiKeyTable = () => {
  const { isLoading, data, isError, isFetching } = useQuery("all-users", () => {
    return axios.get("https://mapapi.gebeta.app/api/v1/getAllUsers");
  });

  // useEffect(() => {
  //   axios
  //     .get("https://mapapi.gebeta.app/api/v1/getAllUsers")
  //     .then((res) => {
  //       // console.log(res.data.data);
  //       setData(res.data.data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // }, []);
  useEffect(() => {
    const apiKeyCell = document.querySelectorAll("tr td:nth-child(2) p");
    const unknownCell = document.querySelectorAll("tr td:last-child");

    listner(apiKeyCell);
    listner(unknownCell);
  }, [data]);

  return (
    <div className="pb-5">
      <div className="max-h-[700px] overflow-x-auto scrollbar-hide">
        <div className=" w-[90%] scrollbar-hide">
          <table className="border-separate border-spacing-y-2 w-11/12 mx-8">
            <thead className="sticky top-0 bg-primary text-secondary">
              <tr>
                <th className=" text-left text-zinc-200 pl-3 w-1/3">Name</th>
                <th className=" text-left text-zinc-200 pl-3 w-1/4 ">ID</th>
                <th className=" text-left text-zinc-200 pl-3 w-1/4 ">Date</th>
                <th className=" text-left text-zinc-200 pl-3 w-1/3">apiKey</th>
              </tr>
            </thead>
            <tbody className="">
              {/* <tr> */}
              {data?.data?.data.map((data) => {
                return (
                  <tr className="" key={data.id}>
                    <td className=" p-3 border-b-2 border-zinc-200 ">
                      {data.username}
                    </td>
                    <td className=" p-3 border-b-2 border-zinc-200  ">
                      <p className="truncate w-32">{data.id}</p>
                    </td>
                    <td className=" p-3 border-b-2 border-zinc-200 ">
                      {data.purchasedDate}
                    </td>
                    <td className=" p-3 border-b-2 border-zinc-200 ">
                      <p className=" truncate w-32">{data.token}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyTable;

function listner(cell) {
  cell.forEach((event) => {
    event.addEventListener("click", (e) => {
      e.preventDefault();
      const range = document.createRange();
      range.selectNodeContents(e.target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
}
