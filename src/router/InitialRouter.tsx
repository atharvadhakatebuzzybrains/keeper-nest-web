import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from '../screen/Login'
import Signup from '../screen/Signup'
import { account } from '../appwrite/config';
import NotFound from '../components/NotFound';
import Alerts from '../components/Alerts';
import SuperAdmin from '../components/SuperAdmin';

export default function InitialRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        if (user) {
          navigate('/dashboard/');
        }
      } catch (err) {

      }
    };

    checkUser();
  }, [navigate]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/superAdmin/:employeeId" element={<SuperAdmin/>} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
