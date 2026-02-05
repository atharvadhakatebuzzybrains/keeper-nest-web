import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CustomDropdown from "../CustomDropdown";
import {
  Calendar,
  User,
  Wrench,
  Edit,
  Trash2,
  History,
  Info,
  CheckCircle,
  Package,
  Clock,
  Laptop,
  Keyboard,
  Mouse,
  RefreshCcw,
} from "lucide-react";
import { databases } from "../../appwrite/config";
import { Query } from "appwrite";
import { Snackbar, useNotification } from "../Alerts";
import ConfirmModal from "../ConfirmModal";
import UpdateAssetModal from "./UpdateModal";
import DynamicTable from "../DyanamicTable";

export default function AssetDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialAsset = location.state?.asset;

  const [asset, setAsset] = useState(initialAsset);
  const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useNotification();
  const [uAsset, setUAsset] = useState<any>(null)
  const [parsedHistory, setParsedHistory] = useState<Array<{
    updation: string;
    date: string;
  }>>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await databases.listDocuments("user_info", "user_info");
        const fetchedEmployees = res.documents
          .filter((doc) => doc.role === "employee")
          .map((doc) => ({
            label: `${doc.name} (${doc.employeeId})`,
            value: `${doc.name} (${doc.employeeId})`,
          }));

        const availEmployees = fetchedEmployees.filter(
          (emp) => emp.label !== asset?.assignedTo
        );

        setEmployees(availEmployees);

        if (asset.historyQueue && Array.isArray(asset.historyQueue)) {
          const parsed = asset.historyQueue
            .map((entry: any) => {
              try {
                let parsedEntry;
                if (typeof entry === 'string') {
                  parsedEntry = JSON.parse(entry);
                } else {
                  parsedEntry = entry;
                }

                return {
                  updation: parsedEntry.updation || "N/A",
                  date: parsedEntry.date || new Date().toISOString()
                };
              } catch (e) {
                console.error("Error parsing history entry:", e);
                return null;
              }
            })
            .filter((entry: any) => entry !== null)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setParsedHistory(parsed);
        }

      } catch (error) {
        console.error("Error:", error);
        showSnackbar("Error loading data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (asset) {
      fetchData();
    }
  }, [asset]);

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'Laptop':
        return <Laptop className="h-7 w-7 md:h-9 md:w-9 text-blue-600" />;
      case 'Keyboard':
        return <Keyboard className="h-7 w-7 md:h-9 md:w-9 text-blue-600" />;
      case 'Mouse':
        return <Mouse className="h-7 w-7 md:h-9 md:w-9 text-blue-600" />;
      default:
        return <Package className="h-7 w-7 md:h-9 md:w-9 text-blue-600" />;
    }
  };

  const handleAssignAsset = async () => {
    if (!selectedEmployee) {
      showSnackbar("Please select an employee first", "error");
      return;
    }

    setAssigning(true);

    try {
      const currentHistory = asset?.historyQueue || [];

      const newHistoryEntry = JSON.stringify({
        updation: `Assigned to Employee (${selectedEmployee})`,
        date: new Date().toISOString(),
      });

      const updatedHistory = [newHistoryEntry, ...currentHistory];
      if (updatedHistory.length > 15) updatedHistory.pop();

      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        assignedTo: selectedEmployee,
        status: 'Assigned',
        historyQueue: updatedHistory
      });

      const updatedAsset = {
        ...asset,
        assignedTo: selectedEmployee,
        status: 'Assigned',
        historyQueue: updatedHistory
      };
      setAsset(updatedAsset);
      setSelectedEmployee("");

      showSnackbar(`Asset assigned successfully to ${selectedEmployee}!`, "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to assign asset", "error");
    } finally {
      setAssigning(false);
    }
  };

  const handleMarkDamaged = async () => {
    try {
      const currentHistory = asset?.historyQueue || [];
      let newStatus = '';
      let updationText = '';

      if (asset.status === 'Damaged') {
        newStatus = 'Available';
        updationText = "Currently available to assign";
      } else {
        if (asset.status !== 'Available' && asset.status !== 'Available-O') {
          showSnackbar('Cannot mark asset as damaged. Please make it available first.', 'error');
          return;
        }
        newStatus = 'Damaged';
        updationText = "Currently under damage";
      }

      const newHistoryEntry = JSON.stringify({
        updation: updationText,
        date: new Date().toISOString(),
      });

      const updatedHistory = [newHistoryEntry, ...currentHistory];
      if (updatedHistory.length > 15) updatedHistory.pop();

      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        status: newStatus,
        historyQueue: updatedHistory
      });

      setAsset({ ...asset, status: newStatus, historyQueue: updatedHistory });

      showSnackbar(`Asset status updated to ${newStatus}!`, "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleToggleStatusOSuffix = async () => {
    try {
      let newStatus = asset.status;
      if (asset.status === 'Available') {
        newStatus = 'Available-O';
      } else if (asset.status === 'Available-O') {
        newStatus = 'Available';
      } else if (asset.status === 'Assigned') {
        newStatus = 'Assigned-O';
      } else if (asset.status === 'Assigned-O') {
        newStatus = 'Assigned';
      } else return;

      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        status: newStatus,
      });

      setAsset({ ...asset, status: newStatus });
      showSnackbar(`Asset status updated to ${newStatus}!`, "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleSendToMaintenance = async () => {
    try {
      const currentHistory = asset?.historyQueue || [];
      let newStatus = '';
      let updationText = '';

      if (asset.status === 'Maintainance') {
        newStatus = 'Available';
        updationText = "Currently available to assign";
      } else {
        if (asset.status !== 'Available' && asset.status !== 'Available-O') {
          showSnackbar('Cannot send asset to maintenance. Please make it available first.', 'error');
          return;
        }
        newStatus = 'Maintainance';
        updationText = "Currently under maintenance";
      }

      const newHistoryEntry = JSON.stringify({
        updation: updationText,
        date: new Date().toISOString(),
      });

      const updatedHistory = [newHistoryEntry, ...currentHistory];
      if (updatedHistory.length > 15) updatedHistory.pop();

      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        status: newStatus,
        historyQueue: updatedHistory
      });

      setAsset({ ...asset, status: newStatus, historyQueue: updatedHistory });

      showSnackbar(`Asset status updated to ${newStatus}!`, "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleDeleteAsset = async () => {
    try {
      if (asset.status !== 'Available' && asset.status !== 'Available-O') {
        showSnackbar('Cannot delete asset. Please make it available first.', 'error');
        return;
      }

      await databases.deleteDocument('assetManagement', 'assets', asset.docId);
      showSnackbar("Asset deleted successfully!", "success");
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete asset", "error");
    }
  };

  const handleUnassignAsset = async () => {
    try {
      const currentHistory = asset?.historyQueue || [];
      const newHistoryEntry = JSON.stringify({
        updation: "Available to assign (Unassigned)",
        date: new Date().toISOString(),
      });

      const updatedHistory = [newHistoryEntry, ...currentHistory];
      if (updatedHistory.length > 15) updatedHistory.pop();

      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        assignedTo: null,
        status: 'Available',
        historyQueue: updatedHistory
      });

      setAsset({ ...asset, assignedTo: null, status: 'Available', historyQueue: updatedHistory });

      showSnackbar("Asset unassigned successfully!", "success");
      setShowUnassignConfirm(false);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to unassign asset", "error");
    }
  };

  const handleUpdateSuccess = async () => {
    try {
      const updatedDoc = await databases.getDocument(
        'assetManagement',
        'assets',
        asset.docId
      );

      setAsset({
        ...asset,
        id: updatedDoc.assetId || updatedDoc.id,
        asset: updatedDoc.assetName || updatedDoc.asset,
        desc: updatedDoc.description || updatedDoc.desc,
        status: updatedDoc.status,
        assetType: updatedDoc.assetType,
        osType: updatedDoc.osType,
        assignedTo: updatedDoc.assignedTo,
        purchaseDate: updatedDoc.purchaseDate,
        historyQueue: updatedDoc.historyQueue
      });

      // showSnackbar("Asset updated successfully!", "success");
    } catch (error) {
      console.error("Error refreshing asset data:", error);
      // showSnackbar("Asset updated successfully!", "success");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
        <Header title="Asset Details" subtitle="No asset selected" showSearch={false} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Card className="border-blue-200 shadow-sm">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">No asset data was provided.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header
        title="Asset Details"
        subtitle={`View and manage information for ${asset.asset || 'Asset'}`}
      />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="md:hidden space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-white shadow-sm flex items-center justify-center">
                      {getAssetIcon(asset.type)}
                    </div>
                  </div>

                  <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-900 mb-2 break-words">{asset.asset}</h1>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                      <Badge
                        className={`${asset.status === 'Assigned' ? 'bg-green-100 text-green-800' :
                          asset.status === 'Available' || asset.status === 'Available-O' ? 'bg-blue-100 text-blue-800' :
                            asset.status === 'Damaged' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          } border-0 text-xs`}
                      >
                        {asset.status === 'Maintainance' ? 'Maintenance' :
                          asset.status === 'Damaged' ? 'Damaged' : asset.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-white text-blue-700 border-blue-300">
                        {asset.type === 'Laptop' && asset.osType ? `Laptop (${asset.osType})` : asset.type}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
                        <span className="font-mono text-xs text-blue-700">#{asset.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-700">Purchase Date</p>
                        <p className="text-sm font-semibold text-gray-900">{asset.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-700">Assigned To</p>
                        <p className={`text-sm font-semibold ${asset.assignedTo === 'Not Assigned' ? 'text-gray-400' : 'text-gray-900'}`}>
                          {asset.assignedTo === 'unassigned' ? '-' : asset.assignedTo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-col lg:flex-row items-start gap-4 lg:gap-6 mb-6">
                  <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {getAssetIcon(asset.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{asset.asset}</h1>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            className={`${asset.status === 'Assigned' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                              asset.status === 'Available' || asset.status === 'Available-O' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                asset.status === 'Damaged' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              } border-0 font-medium`}
                          >
                            {asset.status === 'Maintainance' ? 'Maintenance' :
                              asset.status === 'Damaged' ? 'Damaged' : asset.status}
                          </Badge>
                          <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                            {asset.type === 'Laptop' && asset.osType ? `Laptop (${asset.osType})` : asset.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
                          <span className="font-mono text-sm text-blue-700">#{asset.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Purchase Date</p>
                          <p className="text-base font-semibold text-gray-900">{asset.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Assigned To</p>
                          <p
                            className={`text-sm font-semibold ${asset.assignedTo === 'Not Assigned'
                              ? 'text-gray-400'
                              : 'text-gray-900'
                              }`}
                          >
                            {asset.assignedTo === 'unassigned' ? '-' : asset.assignedTo}
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {asset.desc && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Info className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm md:text-base">Description</h3>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base pl-10 md:pl-10">{asset.desc}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Asset</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Employees
                    </label>
                    <CustomDropdown
                      options={employees}
                      value={selectedEmployee}
                      onChange={setSelectedEmployee}
                      placeholder="Select an employee..."
                      className="w-full"
                      disabled={loading || assigning || asset.status === 'Maintainance'}
                    />
                    {loading && (
                      <p className="text-sm text-gray-500 mt-2">Loading available employees...</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleAssignAsset}
                      disabled={!selectedEmployee || loading || assigning || asset.status === 'Maintainance'}
                      className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed flex-1"
                    >
                      {assigning ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Assign Asset
                        </>
                      )}
                    </Button>
                  </div>

                  {asset.status === 'Maintainance' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Asset is currently in maintenance mode and cannot be assigned.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-sm overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Asset History</h2>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-auto">
                  <DynamicTable
                    columns={[
                      {
                        key: 'updation',
                        title: 'Updation status',
                        width: 400,
                        render: (item: any) => (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-gray-700 whitespace-normal break-words">{item.updation}</span>
                          </div>
                        )
                      },
                      {
                        key: 'date',
                        title: 'Date',
                        render: (item: any) => (
                          <div className="text-gray-500 text-xs sm:text-sm">
                            {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )
                      }
                    ]}
                    data={parsedHistory}
                    compact={true}
                    bordered={true}
                    striped={true}
                    emptyMessage="No history available for this asset"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions Card */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

                <div className="space-y-3">
                  <Button
                    onClick={handleSendToMaintenance}
                    className="w-full justify-start border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    {asset.status === 'Maintainance' ? 'Make it Available' : 'Send to Maintenance'}
                  </Button>

                  <Button
                    onClick={handleMarkDamaged}
                    className="w-full justify-start border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 text-red-800"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    {asset.status === 'Damaged' ? 'Mark as Available' : 'Mark as Damaged'}
                  </Button>

                  {(asset.status === 'Available' || asset.status === 'Available-O' ||
                    asset.status === 'Assigned' || asset.status === 'Assigned-O') && (
                      <Button
                        onClick={handleToggleStatusOSuffix}
                        className="w-full justify-start border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-800"
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        {asset.status.endsWith('-O') ? 'Mark as In Office' : 'Mark as Out of Office'}
                      </Button>
                    )}

                  <Button
                    onClick={() => {
                      setUAsset({
                        $id: asset.docId,
                        assetId: asset.id,
                        assetName: asset.asset,
                        description: asset.desc || "",
                        status: asset.status,
                        assetType: asset.type,
                        osType: asset.osType,
                        assignedTo: asset.assignedTo,
                        purchaseDate: asset.date
                      });
                      setShowUpdateModal(true);
                    }}
                    className="w-full justify-start border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 text-green-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Asset
                  </Button>

                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full justify-start border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 text-red-800"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Asset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
        message={snackbar.message}
        type={snackbar.type}
        duration={4000}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAsset}
        title="Delete Asset"
        description={`Are you sure you want to delete "${asset.asset}"? This action cannot be undone.`}
        confirmText="Delete Asset"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmModal
        isOpen={showUnassignConfirm}
        onClose={() => setShowUnassignConfirm(false)}
        onConfirm={handleUnassignAsset}
        title="Unassign Asset"
        description={`Are you sure you want to unassign this asset from ${asset.assignedTo}?`}
        confirmText="Unassign"
        cancelText="Cancel"
        type="warning"
      />

      <UpdateAssetModal
        asset={uAsset}
        visible={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setUAsset(null);
          handleUpdateSuccess();
        }}
      />
    </div>
  );
}