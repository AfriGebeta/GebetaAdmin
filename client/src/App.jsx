import React from "react";
import {
  MapArea,
  SideBar,
  SigninLeftImage,
  SigninRightForm,
  UsagePage,
} from "./components";
import { Dashboard, SigninPage } from "./pages";
import { useState } from "react";
import axios from "axios";

// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  // const [data, setData] = useState("");

  function checkValidation(formData) {
    console.log(formData, "from App");
    axios
      .post("https://mapapi.gebeta.app/api/v1/users/login", formData)
      .then((res) => {
        setData(res);
        // console.log(res.data.msg);
        if (res.status === 200) {
          if (res.data.msg === "ok") setIsLoading(false);
          // console.log(res.status, "fine ");
        } else {
          console.log(res.status);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  return (
    <div>
      {isLoading ? (
        <SigninPage checkValidation={checkValidation} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default App;
