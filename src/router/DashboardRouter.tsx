import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { roleCache } from '../utils/roleCache';
import { Query } from 'appwrite';
import { account, databases } from '../appwrite/config';
import EmployeeDashboard from '../screen/EmployeeDashboard';
import Profile from '../screen/Profile';
import AdminDashboard from '../screen/AdminDashboard';
import NotFound from '../components/NotFound';
import AuthLoader from '../components/AuthLoader';
import EmployeeList from '../components/adminComponents/EmployeeList';
import AddEmployee from '../components/adminComponents/AddEmployee';
import AddAssets from '../components/adminComponents/AddAssets';
import ViewAssets from '../components/adminComponents/ViewAssets';
import AssetDetails from '../components/adminComponents/AssetDetails';
import EmployeeAssetDetails from '../components/employeeComponents/EmployeeAssetDetails';
import EmployeeDetails from '../components/adminComponents/EmployeeDetails';


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
                    // Wait 5 seconds before hiding loader
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 5000);
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
                // Wait 5 seconds before hiding loader on error/completion
                setTimeout(() => {
                    setIsLoading(false);
                }, 5000);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return <AuthLoader />;
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
                    <Route path='employees/employeeDetails/:employeeId' element={<EmployeeDetails />} />
                    <Route path="*" element={<NotFound />} />
                </>
            ) : role === 'employee' ? (
                <>
                    <Route path='/' element={<EmployeeDashboard />} />
                    <Route path='assetDetails/:id' element={<EmployeeAssetDetails />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </>
            ) : (
                <Route path="*" element={<Navigate to="/" replace />} />
            )}
        </Routes>
    );
}