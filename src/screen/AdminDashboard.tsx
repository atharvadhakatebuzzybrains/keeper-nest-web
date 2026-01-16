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
    <div className="min-h-screen bg-gray-50">
      <Navbar name={name} email={email} role="admin" />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#3b82f6] to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-medium mb-3">Hello, <span className="font-bold">{name}!</span></h2>
                  <p className="text-blue-100 text-lg">
                    Welcome to KeeperNest — Where asset tracking meets workforce optimization
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="h-28 w-28 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <FaCircleUser className="h-20 w-20 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Assets</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.totalAssets}</h3>
                  </div>
                  <div className="h-14 w-14 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Available</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.availableAssets}</h3>
                  </div>
                  <div className="h-14 w-14 rounded-lg bg-green-100 flex items-center justify-center">
                    <PackageOpen className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.assignedAssets}</h3>
                  </div>
                  <div className="h-14 w-14 rounded-lg bg-amber-100 flex items-center justify-center">
                    <PackageCheck className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Maintenance</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.maintainanceAssets}</h3>
                  </div>
                  <div className="h-14 w-14 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                  <Users className="h-10 w-10 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xl font-medium text-gray-500 mb-2">Total Employees</p>
                  <h3 className="text-5xl font-bold text-gray-900 mb-2">{stats.totalEmployees}</h3>
                  <p className="text-base text-gray-400">Active team members</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-6">

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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
                      className="w-full text-left p-3 sm:p-4 flex items-start gap-4 rounded-lg border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-colors"
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