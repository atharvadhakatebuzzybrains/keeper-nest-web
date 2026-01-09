import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../screen/AdminDashboard'
export default function AdminRouter() {
  return (
    <>
    <Routes>
    <Route path='/' element={<AdminDashboard />} />
    </Routes>
    </>
  )
}