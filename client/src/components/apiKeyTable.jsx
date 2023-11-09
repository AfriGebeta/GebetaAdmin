import { useEffect, useState } from "react";
import axios from "axios";
const ApiKeyTable = () => {
  const [Loading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://mapapi.gebeta.app/api/v1/getAllUsers")
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);
  useEffect(() => {
    const apiKeyCell = document.querySelectorAll("tr td:nth-child(2) p");
    const unknownCell = document.querySelectorAll("tr td:last-child");

    listner(apiKeyCell);
    listner(unknownCell);
  }, [data]);

  return (
    <div className="pb-5">
      <div className="max-h-[270px] overflow-x-auto scrollbar-hide">
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
              {data.map((data) => {
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
              {/* </tr> */}

              {/* <tr className="">
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  The Sliding Mr. Bones (Next Stop, Pottersville)
                </td>
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  Malcolm Lockyer
                </td>
                <td className=" p-3 border-b-2 border-zinc-200 ">11</td>
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  <p className=" truncate w-32">123456</p>
                </td>
              </tr>
              <tr className=" ">
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  Witchy Woman
                </td>
                <td className=" p-3 border-b-2 border-zinc-200 ">The Eagles</td>
                <td className=" p-3 border-b-2 border-zinc-200 ">72</td>
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  <p className=" truncate w-32">ewtegtdfgdaa132</p>
                </td>
              </tr>
              <tr className=" ">
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  Shining Star
                </td>
                <td className=" p-3 border-b-2 border-zinc-200 ">
                  Earth, Wind, and Fire
                </td>
                <td className=" p-3 border-b-2 border-zinc-200 ">75</td>
                <td className=" p-3 border-b-2 border-zinc-200">
                  <p className=" truncate w-32">
                    1975197519751975197519751975197519751975197519751975197519751975197519751975197519751975197519751975197519751975
                  </p>
                </td>
              </tr> */}
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
