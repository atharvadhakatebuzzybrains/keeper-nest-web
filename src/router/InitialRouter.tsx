import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from '../screen/Login'
import Signup from '../screen/Signup'
import { account } from '../appwrite/config';
import NotFound from '../components/NotFound';

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
        // not logged in or error - stay on initial routes
      }
    };

    checkUser();
  }, [navigate]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
