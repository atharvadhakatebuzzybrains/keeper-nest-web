import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaCircleUser } from "react-icons/fa6";
import {
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import "../styles/adminDashboardStyles.css";
import Navbar from "../components/Navbar";
import { account, databases } from "../appwrite/config";
import DynamicTable from "../components/DyanamicTable";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Leaves",
      icon: CalendarDays,
      color: "bg-green-500",
      description: "Apply for leave",
      onClick: () => {
        navigate('leaveForm');
      },
    }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setEmail(user.email || '');
        setName(user.name || '');
        setId(user.$id || '');
      } catch (err) {
        console.log('Error fetching user in EmployeeDashboard:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (!name || !id) return; 

        const response = await databases.listDocuments(
          'assetManagement',
          'assets',
          [Query.equal('assignedTo', `${name} (${id})`)]
        );

        const assetList = response.documents.map(asset => ({
          assetId: asset.assetId,
          assetName: asset.assetName,
          type: asset.assetType || 'N/A',
          status: asset.status || 'N/A',
        }));

        setData(assetList);
      } catch (err) {
        console.log('Error fetching assets in EmployeeDashboard:', err);
      }
    };

    fetchAssets();
  }, [name, id]);

  const columns: any[] = [
    { key: 'assetId', title: 'ID', width: 100 },
    { key: 'assetName', title: 'Asset Name', width: 200 },
    { key: 'type', title: 'Type', width: 150 },
    { key: 'status', title: 'Status', width: 150 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Navbar name={name} email={email} role="employee" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#3b82f6] to-blue-600 text-white mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 break-words">
                  Hello, <span className="font-bold">{name || 'User'}!</span>
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed">
                  Welcome to KeeperNest — Your personal asset management hub
                </p>
              </div>
              <div className="hidden sm:flex flex-shrink-0">
                <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                  <FaCircleUser className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 sm:mb-8">
          <Card className="border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl">Assigned Assets</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">All assets assigned to you</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Total:</span>
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                    {data.length}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 overflow-x-auto">
              <div className="min-w-full">
                {<DynamicTable
                  columns={columns as never[]}
                  columnWidths={[100, 200, 150, 150] as never[]}
                  data={data as never[]}
                  bordered={true}
                  striped={true}
                  hoverable={true}
                  onRowClick={(item: any) => navigate(`assetDetails/${item.assetId}`)}
                />}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <Card className="border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Common tasks to get you started</CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.title}
                      onClick={action.onClick}
                      className="w-full text-left p-3 sm:p-4 flex items-start gap-3 sm:gap-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30 transition-all duration-200 hover:-translate-y-0.5 group"
                      aria-label={action.title}
                    >
                      <div className={`${action.color} h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
                          {action.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-0.5">
                          {action.description}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 self-start sm:self-center mt-0.5 sm:mt-0 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
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