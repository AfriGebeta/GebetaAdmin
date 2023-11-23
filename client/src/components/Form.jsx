import axios from "axios";
import { useState, useContext } from "react";
import { useMutation } from "react-query";
import { userContext } from "../App";

const addPlaceApi = import.meta.env.VITE_ADDPLACE_API;

const Form = () => {
  const userToken = useContext(userContext);
  const [formData, setFormData] = useState({
    name: "",
    lat: 0.0,
    lon: 0.0,
    type: "",
    city: "",
    country: "",
    apiKey: String(userToken),
  });

  const { mutate } = useMutation(
    (formData) => {
      return axios.post(addPlaceApi, formData);
    },
    {
      onSuccess: (responseData) => {
        console.log("Mutation successful");
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const handleSubmit = (event) => {
    // console.log(typeof formData, formData);
    event.preventDefault();
    mutate(formData);
    setFormData({
      name: "",
      country: "",
      city: "",
      lat: 0,
      lon: 0,
      type: "",
      apiKey: userToken,
    });
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "lat" || name === "lon" ? parseFloat(value) : value,
    });
  };
  return (
    <div className=" pb-5 w-full ">
      <form className="grid grid-cols-2 " onSubmit={handleSubmit}>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Meskel Flower"
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
            required
            placeholder="Ethiopia"
            value={formData.country}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="Addis Ababa"
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
            required
            placeholder="8.987685259188599"
            value={formData.lat !== 0 ? formData.lat : ""}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
          ></input>
        </div>
        <div className="grid pr-4 group">
          <label className="pb-2 text-secondary text-[13px] font-normal text-left group-focus-within:text-lime-400">
            Longitude
          </label>
          <input
            type="text"
            name="lon"
            placeholder="38.764792722654455"
            value={formData.lon !== 0 ? formData.lon : ""}
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
            placeholder="neighborhood"
            value={formData.type}
            onChange={changeHandler}
            className="border rounded mb-4 shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lime-600"
            required
          ></input>
        </div>
        <div>
          <button
            className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
