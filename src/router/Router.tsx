import { Routes, Route } from "react-router-dom";
import AdminRouter from './AdminRouter';
import EmployeeRouter from "./EmployeeRouter";
export default function Router() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/employee/*" element={<EmployeeRouter />} />

      {/* <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Profile" element={<Profile />} /> */}
    </Routes>
  );
}
