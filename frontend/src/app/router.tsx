import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Reservations from "../features/reservations/pages/Reservations";
import Rooms from "../features/rooms/pages/Rooms";
import Guests from "../features/guests/pages/Guests";
import Restaurant from "../features/restaurant/pages/Restaurant";
import Kitchen from "../features/kitchen/pages/Kitchen";
import Bar from "../features/bar/pages/Bar";

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
{
path: ROUTES.RESERVATIONS,
element: <Reservations />,
},
{
path: ROUTES.ROOMS,
element: <Rooms />,
},
{
path: ROUTES.GUESTS,
element: <Guests />,
},
{
path: ROUTES.RESTAURANT,
element: <Restaurant />,
},
{
path: ROUTES.KITCHEN,
element: <Kitchen />,
},
{
path: ROUTES.BAR,
element: <Bar />,
},
]);
