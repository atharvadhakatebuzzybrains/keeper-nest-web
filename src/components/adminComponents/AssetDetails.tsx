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
  ArrowLeft,
  Copy,
  CheckCircle,
  Package,
  Laptop,
  Smartphone,
  Monitor,
  Keyboard,
  Mouse,
  Printer,
  HardDrive,
  Server,
  Shield,
} from "lucide-react";
import { databases } from "../../appwrite/config";
import { ID } from "appwrite";
import { Snackbar, useNotification } from "../Alerts";
import ConfirmModal from "../ConfirmModal";

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
  const [parsedHistory, setParsedHistory] = useState<Array<{
    historyId: string;
    employeeId: string;
    assignDate: string;
  }>>([]);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);

  const getAssetIcon = (assetType: string) => {
    switch (assetType?.toLowerCase()) {
      case 'laptop':
        return <Laptop className="h-5 w-5" />;
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'phone':
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'keyboard':
        return <Keyboard className="h-5 w-5" />;
      case 'mouse':
        return <Mouse className="h-5 w-5" />;
      case 'printer':
        return <Printer className="h-5 w-5" />;
      case 'server':
        return <Server className="h-5 w-5" />;
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

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

        if (asset?.history && Array.isArray(asset.history)) {
          const parsed = asset.history
            .map((entry: any) => {
              try {
                let parsedEntry;
                if (typeof entry === 'string') {
                  parsedEntry = JSON.parse(entry);
                } else {
                  parsedEntry = entry;
                }
                
                return {
                  historyId: parsedEntry.historyId || ID.unique(),
                  employeeId: parsedEntry.employeeId,
                  assignDate: parsedEntry.assignDate || parsedEntry.assignedDate || new Date().toISOString()
                };
              } catch (e) {
                console.error("Error parsing history entry:", e);
                return null;
              }
            })
            .filter((entry: any) => entry !== null)
            .sort((a: any, b: any) => new Date(b.assignDate).getTime() - new Date(a.assignDate).getTime());
          
          setParsedHistory(parsed);
        }

      } catch (error) {
        console.error("Error:", error);
        showSnackbar("Error loading data", "danger");
      } finally {
        setLoading(false);
      }
    };

    if (asset) {
      fetchData();
    }
  }, [asset]);

  const handleAssignAsset = async () => {
    if (!selectedEmployee) {
      showSnackbar("Please select an employee first", "danger");
      return;
    }

    setAssigning(true);
    
    try {
      const currentHistory = asset?.history || [];
      
      const newHistoryEntry = JSON.stringify({
        historyId: ID.unique(),
        employeeId: selectedEmployee,
        assignDate: new Date().toISOString(),
      });

      const updatedHistory = [newHistoryEntry, ...currentHistory];
      if (updatedHistory.length > 5) updatedHistory.pop();

      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        assignedTo: selectedEmployee,
        status: 'Assigned',
        historyQueue: updatedHistory
      });

      const updatedAsset = {
        ...asset,
        assignedTo: selectedEmployee,
        status: 'Assigned',
        history: updatedHistory
      };
      setAsset(updatedAsset);
      
      const newParsedEntry = {
        historyId: ID.unique(),
        employeeId: selectedEmployee,
        assignDate: new Date().toISOString()
      };
      setParsedHistory([newParsedEntry, ...parsedHistory]);
      
      setSelectedEmployee("");
      
      showSnackbar(`Asset assigned successfully to ${selectedEmployee}!`, "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to assign asset", "danger");
    } finally {
      setAssigning(false);
    }
  };

  const handleSendToMaintenance = async () => {
    try {
      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        status: 'Maintainance'
      });
      
      setAsset({ ...asset, status: 'Maintainance' });
      
      showSnackbar("Asset sent to maintenance!", "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to send to maintenance", "danger");
    }
  };

  const handleUnassignAsset = async () => {
    try {
      await databases.updateDocument('assetManagement', 'assets', asset.docId, {
        assignedTo: null,
        status: 'Available'
      });
      
      setAsset({ ...asset, assignedTo: null, status: 'Available' });
      
      showSnackbar("Asset unassigned successfully!", "success");
      setShowUnassignConfirm(false);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to unassign asset", "danger");
    }
  };

  const handleDeleteAsset = async () => {
    try {
      if (asset.status !== 'Available') {
        showSnackbar('Cannot delete asset. Please make it available first.', 'danger');
        return;
      }

      await databases.deleteDocument('assetManagement', 'assets', asset.docId);
      showSnackbar("Asset deleted successfully!", "success");
      navigate('/dashboard/assets');
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete asset", "danger");
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asset.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showSnackbar("Asset ID copied to clipboard!", "success");
  };

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Asset Found</h3>
            <p className="text-gray-600 mb-6">The asset data is not available or has been removed.</p>
            <Button
              onClick={() => navigate('/dashboard/assets')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header 
        title="Asset Details" 
        subtitle="Manage and track asset information"
        showSearch={false}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Information Card */}
            <Card className="border-blue-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <h2 className="text-xl font-bold text-gray-900">Asset Information</h2>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-white shadow-lg flex items-center justify-center">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge 
                        className={`${
                          asset.status === 'Assigned' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          asset.status === 'Available' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                          'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        } border-0 font-medium`}
                      >
                        {asset.status === 'Maintainance' ? 'Maintenance' : asset.status}
                      </Badge>
                      <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">
                        {asset.type}
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{asset.asset}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Badge variant="outline" className="font-mono bg-white text-blue-600 border-blue-300">
                          #{asset.id}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyToClipboard}
                          className="h-6 w-6 p-0 hover:bg-blue-50"
                        >
                          {copied ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-blue-500" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Purchased: {asset.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-100 bg-white hover:bg-blue-50/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assigned To</p>
                      <p className={`text-lg font-semibold ${
                        asset.assignedTo === 'Not Assigned' ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {asset.assignedTo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-100 bg-white hover:bg-blue-50/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Asset Type</p>
                      <p className="text-lg font-semibold text-gray-900">{asset.type}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Description</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{asset.desc}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Section */}
            <Card className="border-blue-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <h2 className="text-xl font-bold text-gray-900">Assign Asset</h2>
                <p className="text-sm text-blue-600">Assign this asset to an employee</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee
                    </label>
                    <CustomDropdown
                      options={employees}
                      value={selectedEmployee}
                      onChange={setSelectedEmployee}
                      placeholder="Choose an employee..."
                      searchPlaceholder="Search employees..."
                      className="w-full border-blue-200 focus:border-blue-500"
                      disabled={loading || assigning || asset.status === 'Maintainance'}
                    />
                    {loading && (
                      <p className="text-sm text-gray-500 mt-1">Loading available employees...</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleAssignAsset}
                      disabled={!selectedEmployee || loading || assigning || asset.status === 'Maintainance'}
                      className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {assigning ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          Assign to Employee
                        </>
                      )}
                    </Button>
                    
                    {asset.assignedTo !== 'Not Assigned' && asset.status === 'Assigned' && (
                      <Button
                        variant="outline"
                        onClick={() => setShowUnassignConfirm(true)}
                        className="text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Unassign
                      </Button>
                    )}
                  </div>
                  
                  {asset.status === 'Maintainance' && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm font-medium">Asset is currently in maintenance</p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        You cannot assign this asset until maintenance is complete.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* History Section */}
            <Card className="border-blue-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Assignment History</h2>
                      <p className="text-sm text-blue-600">Track all previous assignments</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                    {parsedHistory.length} records
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                {parsedHistory.length > 0 ? (
                  <div className="space-y-3">
                    {parsedHistory.map((entry, index) => (
                      <div
                        key={entry.historyId || index}
                        className="p-4 rounded-lg border border-blue-100 bg-white hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {entry.employeeId.split('(')[0]?.trim() || entry.employeeId}
                                </h4>
                                <p className="text-sm text-blue-600 mt-1">
                                  {entry.employeeId.includes('(') 
                                    ? entry.employeeId.match(/\(([^)]+)\)/)?.[1] || entry.employeeId 
                                    : "No ID"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(entry.assignDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No assignment history found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      This asset has never been assigned to anyone
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="border-blue-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-blue-600">Manage asset status</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleSendToMaintenance}
                    disabled={asset.status === 'Maintainance'}
                    className="w-full justify-start border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    {asset.status === 'Maintainance' ? 'In Maintenance' : 'Send to Maintenance'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/update-asset/${asset.docId}`, { state: { asset } })}
                    className="w-full justify-start border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 text-green-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Asset
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full justify-start border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 text-red-800"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Asset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Asset Status Card */}
            <Card className="border-blue-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <h2 className="text-xl font-bold text-gray-900">Asset Status</h2>
                <p className="text-sm text-blue-600">Current asset information</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                    <span className="text-gray-700">Current Status</span>
                    <Badge 
                      className={`${
                        asset.status === 'Assigned' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        asset.status === 'Available' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      } border-0`}
                    >
                      {asset.status === 'Maintainance' ? 'Maintenance' : asset.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                    <span className="text-gray-700">Asset Type</span>
                    <span className="font-medium text-gray-900">{asset.type}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                    <span className="text-gray-700">Asset ID</span>
                    <span className="font-mono font-medium text-blue-700">#{asset.id}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                    <span className="text-gray-700">Purchase Date</span>
                    <span className="font-medium text-gray-900">{asset.date}</span>
                  </div>
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

      {/* Delete Confirmation Modal */}
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

      {/* Unassign Confirmation Modal */}
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
    </div>
  );
}