import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATHS } from "./paths";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import FiscalConsultPage from "../pages/FiscalConsultPage/FiscalConsultPage";
import NegotiationPage from "../pages/NegotiationPage/NegotiationPage";
import JobsPage from "../pages/JobsPage/JobsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<LoginPage />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
        <Route path={PATHS.CERTIFICATES} element={<FiscalConsultPage />} />
        <Route path={PATHS.NEGOTIATION} element={<NegotiationPage />} />
        <Route path={PATHS.JOBS} element={<JobsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
