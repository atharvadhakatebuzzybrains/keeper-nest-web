import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { roleCache } from '../utils/roleCache';
import { Query } from 'appwrite';
import { account, databases } from '../appwrite/config';
import EmployeeDashboard from '../screen/EmployeeDashboard';
import Profile from '../screen/Profile';
import AdminDashboard from '../screen/AdminDashboard';
import NotFound from '../components/NotFound';
import { Loader2 } from 'lucide-react';
import logo from '../assets/images/logo_app.png';
import EmployeeList from '../components/adminComponents/EmployeeList';
import AddEmployee from '../components/adminComponents/AddEmployee';
import AddAssets from '../components/adminComponents/AddAssets';
import ViewAssets from '../components/adminComponents/ViewAssets';
import AssetDetails from '../components/adminComponents/AssetDetails';


export default function DashboardRouter() {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If we already have a cached role, use it and avoid network calls
                const cachedRole = roleCache.getRole();
                if (cachedRole) {
                    console.log('Using cached role:', cachedRole);
                    setRole(cachedRole);
                    setIsLoading(false);
                    return;
                }

                // No cached role - validate session and fetch role from database
                const user = await account.get();
                console.log('No cache, fetching from database...');

                const response: any = await databases.listDocuments(
                    'user_info',
                    'user_info',
                    [Query.equal("employeeId", user.$id)]
                );

                const userData = response.documents[0];
                const userRole = userData.role;
                setRole(userRole);

                roleCache.setRole(userRole as 'admin' | 'employee');

                console.log('User authenticated:', user.email);
            } catch (err) {
                console.log(err);
                roleCache.clear();
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-xs w-full">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <img
                            src={logo}
                            alt="KeeperNest Logo"
                            className="w-20 h-20 md:w-24 md:h-24 object-contain mb-4"
                        />
                        <h1 className="text-2xl md:text-3xl font-bold text-[#3b82f6]">KeeperNest</h1>
                    </div>
                    <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin text-[#3b82f6] mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {role === 'admin' ? (
                <>
                    <Route path='/' element={<AdminDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path='addEmployee' element={<AddEmployee/>} />
                    <Route path='addAssets' element={<AddAssets/>} />
                    <Route path='viewAssets' element={<ViewAssets/>} />
                    <Route path='employees' element={<EmployeeList/>} />
                    <Route path='viewAssets/assetDetails/:assetId' element={<AssetDetails/>} />
                    <Route path="*" element={<NotFound />} />
                </>
            ) : role === 'employee' ? (
                <>
                    <Route path='/' element={<EmployeeDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </>
            ) : (
                <Route path="*" element={<Navigate to="/" replace />} />
            )}
        </Routes>
    );
}