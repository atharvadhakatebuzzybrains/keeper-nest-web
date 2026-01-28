import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaCircleUser } from "react-icons/fa6";
import { Button } from "../components/ui/button";
import {
  Users,
  Package,
  PackageCheck,
  Wrench,
  UserPlus,
  PlusCircle,
  List,
  Users as UsersIcon,
  ChevronRight,
  User,
  UserCircle,
  Package2,
  PackageOpen,
} from "lucide-react";
import "../styles/adminDashboardStyles.css";
import Navbar from "../components/Navbar";
import { LuPackageCheck } from "react-icons/lu";
import { account, databases } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    maintainanceAssets: 0,
  });

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const fetchUserAndStats = async () => {
    try {
      const user = await account.get();
      setEmail(user.email);
      setName(user.name);

      const employeesResponse = await databases.listDocuments(
        'user_info',
        'user_info',
        [Query.equal('role', 'employee'), Query.equal('status', 'active')]
      );

      const assetsResponse = await databases.listDocuments(
        'assetManagement',
        'assets'
      );

      const assets = assetsResponse.documents;
      const availableAssets = assets.filter(asset => asset.status === 'Available').length;
      const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
      const maintainanceAssets = assets.filter(asset => asset.status === 'Maintainance').length;

      setStats({
        totalEmployees: employeesResponse.total,
        totalAssets: assetsResponse.total,
        availableAssets,
        assignedAssets,
        maintainanceAssets,
      });

    } catch (error) {
      console.log("Error: ", error);
      navigate('/');
    }
  };

  const quickActions = [
    {
      title: "Add Employee",
      icon: UserPlus,
      color: "bg-blue-500",
      description: "Create new employee account",
      href: "/addEmployee",
    },
    {
      title: "Add Asset",
      icon: PlusCircle,
      color: "bg-green-500",
      description: "Register new company asset",
      href: "/addAssets",
    },
    {
      title: "View Assets",
      icon: List,
      color: "bg-amber-500",
      description: "Browse all assets",
      href: "/viewAssets",
    },
    {
      title: "Employees",
      icon: UsersIcon,
      color: "bg-purple-500",
      description: "Manage team members",
      href: "/employees",
    },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        console.log('User authenticated:', user.email);

      } catch (err) {
        console.log('No user session, redirecting to login');
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Navbar name={name} email={email} role="admin" />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#3b82f6] to-blue-600 text-white overflow-hidden">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-3xl font-medium mb-1 sm:mb-2 md:mb-3">
                    Hello, <span className="font-bold">{name}!</span>
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm md:text-lg">
                    Welcome to KeeperNest — Where asset tracking meets workforce optimization
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="h-20 w-20 lg:h-28 lg:w-28 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <FaCircleUser className="h-12 w-12 lg:h-20 lg:w-20 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-7 md:mb-8">
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <Card className="border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Total Assets</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{stats.totalAssets}</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-green-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Available</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{stats.availableAssets}</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-green-100 flex items-center justify-center">
                    <PackageOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Assigned</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{stats.assignedAssets}</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-amber-100 flex items-center justify-center">
                    <PackageCheck className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-purple-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Maintenance</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{stats.maintainanceAssets}</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 lg:col-span-2 mt-3 sm:mt-0">
            <Card className="h-full border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-5 md:p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 sm:mb-5">
                  <Users className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-500 mb-1 sm:mb-2">Total Employees</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stats.totalEmployees}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Active team members</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <Card className="border border-blue-100 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>

            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.title}
                      onClick={() => navigate(`/dashboard${action.href}`)}
                      className="w-full text-left p-3 sm:p-4 flex items-start gap-4 rounded-lg border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
                      aria-label={action.title}
                    >
                      <div className={`${action.color} h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm sm:text-base line-clamp-1">{action.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">{action.description}</div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-gray-400 self-center" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}