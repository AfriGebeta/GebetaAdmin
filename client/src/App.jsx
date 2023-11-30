import React, { useEffect, useState } from "react";
import axios from "axios";
import { QueryClientProvider, QueryClient } from "react-query";
import {
  MapArea,
  SideBar,
  SigninLeftImage,
  SigninRightForm,
  UsagePage,
} from "./components";
import { Dashboard, SigninPage } from "./pages";

// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

export const userContext = React.createContext();
export const userId = React.createContext();
const queryClient = new QueryClient();

const loginApi = import.meta.env.VITE_LOGIN_API;

const App = () => {
  const [authentication, setAuthentication] = useState(false);
  // const [UserId, setUserId] = useState("");
  const [Loading, setIsLoading] = useState(true);

  function checkValidation(formData) {
    axios
      .post(loginApi, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.msg === "ok") {
            console.log(res.data.data);
            setAuthentication(true);
            setIsLoading(false);
            // setUserId(res.data.data.id);
            // console.log("res", res.data.data.id);
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("userId", res.data.data.id);
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
    // const token = null;
    if (token) {
      setAuthentication(true);
    }
    setIsLoading(false);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <userContext.Provider value={localStorage.getItem("token")}>
        <userId.Provider value={localStorage.getItem("userId")}>
          <div>
            {!authentication ? (
              <SigninPage checkValidation={checkValidation} />
            ) : (
              <Dashboard />
            )}
          </div>
        </userId.Provider>
      </userContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
