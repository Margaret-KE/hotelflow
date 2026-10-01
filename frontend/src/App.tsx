import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Bar from "./features/bar/pages/Bar";
import { ROUTES } from "./constants/routes";

export default function App() {
return ( <BrowserRouter> <Routes>
<Route path={ROUTES.HOME} element={<Home />} />
<Route
path={ROUTES.BAR}
element={<Bar />}
/>
<Route
path="*"
element={<Navigate to={ROUTES.HOME} replace />}
/> </Routes> </BrowserRouter>
);
}