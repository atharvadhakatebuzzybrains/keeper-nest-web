import { Routes, Route } from "react-router-dom";
import DashboardRouter from "./DashboardRouter";
import NotFound from "../components/NotFound";
import InitialRouter from "./InitialRouter";
export default function Router() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardRouter />} />
      <Route path="/*" element={<InitialRouter />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
