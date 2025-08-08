import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATHS } from "./paths";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import FiscalConsultPage from "../pages/FiscalConsultPage/FiscalConsultPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<LoginPage />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
        <Route path={PATHS.CERTIFICATES} element={<FiscalConsultPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
