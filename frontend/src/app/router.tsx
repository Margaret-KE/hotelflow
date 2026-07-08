import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";

import { ROUTES } from "../constants/routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
]);