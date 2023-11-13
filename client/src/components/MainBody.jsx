import React from "react";
import { Route, Routes } from "react-router-dom";

import {
  ActivitiesPage,
  ApiKeyPage,
  ClientMgmtPage,
  PlaceTablePage,
  UsagePage,
} from "../pages";

export const MainBody = () => {
  return (
    <div className="bg-primary w-full h-[100vh]">
      <Routes>
        <Route index path="/dashboard/usage" element={<UsagePage />} />
        <Route
          path="/dashboard/clientmanagement"
          element={<ClientMgmtPage />}
        />
        <Route path="/dashboard/apikeys" element={<ApiKeyPage />} />
        <Route path="/dashboard/place" element={<PlaceTablePage />} />
        <Route path="/dashboard/activities" element={<ActivitiesPage />} />
      </Routes>
    </div>
  );
};
