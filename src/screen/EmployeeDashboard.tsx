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
import { account, databases } from "../appwrite/config";
import DynamicTable from "../components/DyanamicTable";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [assets, setAssets] = useState([]);
  const [id, setId] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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
        if (!name || !id) return; // Wait for user data

        const response = await databases.listDocuments(
          'assetManagement',
          'assets',
          [Query.equal('assignedTo', `${name} (${id})`)]
        );

        // Set assets directly
        setAssets(response.documents);

        // Map the response documents to create assetList
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

  const columns = [
    { key: 'assetId', title: 'ID', width: 100 },
    { key: 'assetName', title: 'Asset Name', width: 200 },
    { key: 'type', title: 'Type', width: 150 },
    { key: 'status', title: 'Status', width: 150 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Navbar name={name} email={email} role="employee" />

      <div className="container mx-auto px-6 py-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#3b82f6] to-blue-600 text-white">
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

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">My Assigned Assets</h2>          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total:</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {data.length}
            </span>
          </div>
        </div>
        <DynamicTable
          columns={columns}
          columnWidths={[100, 200, 150, 150] as any}
          data={data as any}
          bordered={true}
          striped={true}
          hoverable={true}
          onRowClick={(item: any) => navigate(`assetDetails/${item.assetId}`)}
        />
      </div>
    </div>
  );
}