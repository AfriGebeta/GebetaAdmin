import React, { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import {
  MapArea,
  SideBar,
  SigninLeftImage,
  SigninRightForm,
  UsagePage,
} from "./components";
import { Dashboard, SigninPage } from "./pages";
import axios from "axios";

// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const App = () => {
  const [authentication, setAuthentication] = useState(false);
  const [Loading, setIsLoading] = useState(true);
  const queryClient = new QueryClient();

  function checkValidation(formData) {
    axios
      .post("https://mapapi.gebeta.app/api/v1/users/login", formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.msg === "ok") {
            console.log(res.data.data.token);
            setAuthentication(true);
            setIsLoading(false);
            localStorage.setItem("token", res.data.data.token);
          }
        } else {
          console.log(res.status);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
    setIsLoading(true);
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthentication(true);
    }
    setIsLoading(false);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {!authentication ? (
          <SigninPage checkValidation={checkValidation} />
        ) : (
          <Dashboard />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;
