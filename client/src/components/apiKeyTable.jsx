import { useEffect } from "react";

const ApiKeyTable = () => {
  useEffect(() => {
    const apiKeyCell = document.querySelectorAll("tr td:last-child");
    const unknownCell = document.querySelectorAll("tr td:nth-child(3)");

    listner(apiKeyCell);
    listner(unknownCell);
  }, []);

  return (
    <div className=" w-11/12 mx-auto">
      <table className="border-separate border-spacing-y-2 w-11/12">
        <thead className="">
          <tr>
            <th className=" text-left text-zinc-200 pl-3 w-1/3">Name</th>
            <th className=" text-left text-zinc-200 pl-3 w-1/4 ">ID</th>
            <th className=" text-left text-zinc-200 pl-3 w-1/4 ">Date</th>
            <th className=" text-left text-zinc-200 pl-3 w-1/3">apiKey</th>
          </tr>
        </thead>
        <tbody className="">
          <tr className="">
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
            <td className=" p-3 border-b-2 border-zinc-200 ">Witchy Woman</td>
            <td className=" p-3 border-b-2 border-zinc-200 ">The Eagles</td>
            <td className=" p-3 border-b-2 border-zinc-200 ">72</td>
            <td className=" p-3 border-b-2 border-zinc-200 ">
              <p className=" truncate w-32">ewtegtdfgdaa132</p>
            </td>
          </tr>
          <tr className=" ">
            <td className=" p-3 border-b-2 border-zinc-200 ">Shining Star</td>
            <td className=" p-3 border-b-2 border-zinc-200 ">
              Earth, Wind, and Fire
            </td>
            <td className=" p-3 border-b-2 border-zinc-200 ">75</td>
            <td className=" p-3 border-b-2 border-zinc-200">
              <p class=" truncate w-32">
                1975197519751975197519751975197519751975197519751975197519751975197519751975197519751975197519751975197519751975
              </p>
            </td>
          </tr>
        </tbody>
      </table>
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
