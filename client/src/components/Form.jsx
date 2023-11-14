import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    latitude: "",
    longitude: "",
    type: "",
  });
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const clickHandler = (event) => {
    console.log("clicked");
  };
  return (
    <div className=" pb-5 w-full ">
      <form className="grid grid-cols-2 ">
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Latitude
          </label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Longitude
          </label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div>
          <button
            className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={clickHandler}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
