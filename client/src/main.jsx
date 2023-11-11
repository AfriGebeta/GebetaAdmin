import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'leaflet/dist/leaflet.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {ErrorPage,ClientMgmtPage, Dashboard, ActivitiesPage} from './pages';
import ApiKeyTable from './components/apiKeyTable.jsx';
import UsagePage from './pages/UsagePage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "usage",
            element: <UsagePage/>,
            errorElement: <ErrorPage />,
          },
          {
            path: "clientmanagement",
            element: <ClientMgmtPage/>,
            errorElement: <ErrorPage />,
          },
          {
            path:"apikeys",
            element: <ApiKeyTable/>,
            errorElement: <ErrorPage/>
          },
          {
            path:"activities",
            element: <ActivitiesPage/>,
            errorElement: <ErrorPage/>
          },
        ]
      }
    ]
    
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
