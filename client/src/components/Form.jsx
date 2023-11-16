import axios from "axios";
import { useState, useContext } from "react";
import { useMutation } from "react-query";
import { userContext } from "../App";

const Form = () => {
  const userToken = useContext(userContext);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    lat: "",
    lon: "",
    type: "",
    apikey: userToken,
  });

  const { mutate } = useMutation(
    (formData) => {
      return axios.post(
        "https://mapapi.gebeta.app/api/v1/route/addPlace",
        formData
      );
    },
    {
      onSuccess: (responseData) => {
        console.log("Mutation successful:", responseData);
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const handleSubmit = (event) => {
    console.log(formData);
    event.preventDefault();
    mutate(formData);
    setFormData({
      name: "",
      country: "",
      city: "",
      lat: "",
      lon: "",
      type: "",
      apikey: userToken,
    });
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
            name="lat"
            value={formData.lat}
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
            name="lon"
            value={formData.lon}
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
