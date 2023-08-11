import React from "react";

const UsagePageSearchForm = () => {
  return (
    <form
      action="#"
      method="post"
      className=" w-full mx-auto grid grid-cols-6 gap-4 mb-2 p-5"
    >
      <input
        type="text"
        name=""
        id=""
        placeholder="ALL"
        className=" col-span-4 border border-blue-300 text-xl p-1"
      />
      <button type="submit" className=" bg-orange-500">
        Search
      </button>
    </form>
  );
};

export default UsagePageSearchForm;
