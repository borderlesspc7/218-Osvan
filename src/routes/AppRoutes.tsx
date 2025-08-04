import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATHS } from "./paths";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<div>Home Page</div>} />
        <Route path={PATHS.LOGIN} element={<div>Login Page</div>} />
        <Route path={PATHS.REGISTER} element={<div>Register Page</div>} />
        <Route path={PATHS.DASHBOARD} element={<div>Dashboard Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
