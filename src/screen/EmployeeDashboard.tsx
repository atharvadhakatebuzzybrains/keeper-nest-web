import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaCircleUser } from "react-icons/fa6";
import "../styles/adminDashboardStyles.css";
import Navbar from "../components/Navbar";
import { account } from "../appwrite/config";
// import { LuPackageCheck } from "react-icons/lu";

export default function EmployeeDashoard() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setEmail(user.email || '');
        setName(user.name || '');
      } catch (err) {
        console.log('Error fetching user in EmployeeDashboard:', err);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar name="employee" email="emp@test.com" role="employee"  />

      <div className="container mx-auto px-6 py-8">
        <Card className="mb-8 bg-gradient-to-r bg-[#3b82f6] text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Hello, {name}!</h2>
                <p className="text-blue-100 mb-4">
                  Welcome to KeeperNest — Where asset tracking meets workforce optimization
                </p>
              </div>
              <div className="hidden md:block">
                <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">
                  <FaCircleUser className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}