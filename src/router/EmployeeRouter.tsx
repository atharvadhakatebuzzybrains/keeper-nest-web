import { Route, Routes } from 'react-router-dom'
import EmployeeDashboard from '../screen/EmployeeDashboard'
export default function EmployeeRouter() {
  return (
    <>
    <Routes>
    <Route path='/' element={<EmployeeDashboard />} />
   </Routes>
    </>
  )
}