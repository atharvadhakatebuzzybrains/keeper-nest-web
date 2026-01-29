import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../Header';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import CustomDropdown from '../CustomDropdown';
import {
    Calendar, UserPlus, MapPin, User,
    Package, CheckCircle, XCircle, Clock,
    Trash2, AlertTriangle, ArrowLeft,
    Laptop, Keyboard, Mouse,
} from 'lucide-react';
import { databases, functions } from '../../appwrite/config';
import { ID } from 'appwrite';
import { Snackbar, useNotification } from '../Alerts';
import ConfirmModal from '../ConfirmModal';
import man from '../../assets/images/man.png';
import woman from '../../assets/images/woman.png';

export default function EmployeeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const employee: any = location.state?.employee;
    const [selectedAsset, setSelectedAsset] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignedAssets, setAssignedAssets] = useState<any[]>([]);
    const [isRemoving, setIsRemoving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [assetOptions, setAssetOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { snackbar, showSnackbar, closeSnackbar } = useNotification();

    const getAssetIcon = (assetType: string) => {
        switch (assetType?.toLowerCase()) {
            case 'laptop':
                return <Laptop className="h-4 w-4 sm:h-5 sm:w-5" />;
            case 'keyboard':
                return <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />;
            case 'mouse':
                return <Mouse className="h-4 w-4 sm:h-5 sm:w-5" />;
            default:
                return <Package className="h-4 w-4 sm:h-5 sm:w-5" />;
        }
    };

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);
                const res = await databases.listDocuments('assetManagement', 'assets');

                console.log('All assets from DB:', res.documents);

                const assets = res.documents
                    .filter((asset) => asset.status === 'Available')
                    .map((asset) => ({
                        value: asset.$id,
                        label: `${asset.assetName} (${asset.assetId})`,
                        assetName: asset.assetName,
                        status: asset.status,
                        category: asset.assetType,
                        serial: asset.serialNumber || asset.assetId || 'N/A',
                        assignedTo: asset.assignedTo,
                        documentId: asset.$id,
                        historyQueue: asset.historyQueue || []
                    }));

                console.log('Available assets for dropdown:', assets);
                setAssetOptions(assets);

                const employeeIdentifier = `${employee?.name} (${employee?.employeeId})`;
                const assigned = res.documents
                    .filter((asset) => {
                        const isAssigned = asset.assignedTo === employeeIdentifier;
                        return isAssigned;
                    })
                    .map((asset) => ({
                        id: asset.$id,
                        assetId: asset.assetId,
                        assetName: asset.assetName,
                        assetType: asset.assetType,
                        status: asset.status,
                        serial: asset.assetId || 'N/A',
                        assignedTo: asset.assignedTo
                    }));

                console.log('Assigned assets found:', assigned);
                setAssignedAssets(assigned);
            } catch (error) {
                console.error('Error fetching assets:', error);
            } finally {
                setLoading(false);
            }
        };

        if (employee?.$id) {
            fetchAssets();
        }
    }, [employee]);

    const formatDate = (d: any) => {
        if (!d) return '-';
        try {
            return new Date(d).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return String(d);
        }
    };

    const getGenderImage = () => {
        if (employee?.gender?.toLowerCase() === 'female') {
            return woman;
        }
        return man;
    };

    const handleAssignAsset = async () => {
        if (!selectedAsset) {
            showSnackbar('Please select an asset first', 'danger');
            return;
        }

        setIsAssigning(true);

        try {
            const selectedAssetData = assetOptions.find(a => a.value === selectedAsset);
            console.log('Selected asset data:', selectedAssetData);

            if (!selectedAssetData) {
                throw new Error('Selected asset not found');
            }

            const employeeIdentifier = `${employee.name} (${employee.employeeId})`;
            console.log('Assigning to:', employeeIdentifier);

            const newHistoryEntry = JSON.stringify({
                historyId: ID.unique(),
                employeeId: employee.employeeId,
                assignDate: new Date().toISOString(),
            });

            const currentHistory = selectedAssetData.historyQueue || [];
            const updatedHistory = [newHistoryEntry, ...currentHistory];
            if (updatedHistory.length > 5) {
                updatedHistory.pop();
            }

            console.log('Updating asset with:', {
                status: 'Assigned',
                assignedTo: employeeIdentifier,
                historyQueue: updatedHistory
            });

            await databases.updateDocument(
                'assetManagement',
                'assets',
                selectedAsset,
                {
                    status: 'Assigned',
                    assignedTo: employeeIdentifier,
                    historyQueue: updatedHistory
                }
            );

            console.log('Asset updated successfully');

            const updatedAsset = {
                id: selectedAsset,
                assetId: selectedAssetData.serial,
                assetName: selectedAssetData.assetName,
                assetType: selectedAssetData.category,
                status: 'Assigned',
                serial: selectedAssetData.serial,
                assignedTo: employeeIdentifier
            };

            setAssignedAssets(prev => [...prev, updatedAsset]);

            setAssetOptions(prev => prev.filter(asset => asset.value !== selectedAsset));

            showSnackbar(`Asset "${selectedAssetData.assetName}" has been assigned to ${employee.name}`, 'success');
            setSelectedAsset('');
        } catch (error) {
            console.error('Error assigning asset:', error);
            showSnackbar('Failed to assign asset. Please try again.', 'danger');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleRemoveAsset = async (assetId: string) => {
        try {
            const asset = assignedAssets.find(a => a.id === assetId);
            console.log('Removing asset:', asset);

            if (!asset) {
                throw new Error('Asset not found in assigned assets');
            }

            await databases.updateDocument(
                'assetManagement',
                'assets',
                assetId,
                {
                    status: 'Available',
                    assignedTo: 'unassigned',
                }
            );

            setAssignedAssets(prev => prev.filter(a => a.id !== assetId));

            const assetData = {
                value: assetId,
                label: `${asset.assetName} (${asset.assetId})`,
                assetName: asset.assetName,
                status: 'Available',
                category: asset.assetType,
                serial: asset.serial,
                documentId: assetId
            };

            setAssetOptions(prev => [...prev, assetData]);

            showSnackbar(`Asset "${asset.assetName}" has been removed from ${employee.name}`, 'success');
        } catch (error) {
            console.error('Error removing asset:', error);
            showSnackbar('Failed to remove asset. Please try again.', 'danger');
        }
    };

    const handleRemoveEmployee = async () => {
        if (assignedAssets.length > 0) {
            showSnackbar(`Please remove all assigned assets before deleting this employee.`, 'danger');
            return;
        }
        setShowDeleteConfirm(true);
    };

    const confirmRemoveEmployee = async () => {
        setIsRemoving(true);
        setShowDeleteConfirm(false);

        try {
            const execution = await functions.createExecution(
                "delete-user",
                JSON.stringify({
                    userId: employee.$id,
                    documentId: employee.$id
                })
            );

            await databases.deleteDocument('user_info', 'user_info', employee.$id);

            showSnackbar(`Employee "${employee.name}" has been successfully deleted.`, 'success');
            navigate('/dashboard/employees');

        } catch (error) {
            console.error('Error deleting employee:', error);
            setIsRemoving(false);
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    if (!employee) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
                <Header title="Employee Details" subtitle="No employee selected" showSearch={false} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                    <Card className="border-blue-200 shadow-sm">
                        <CardContent className="p-6 sm:p-8 text-center">
                            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                            </div>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">No employee data was provided.</p>
                            <Button
                                onClick={() => navigate('/employees')}
                                variant="outline"
                                className="mt-4 w-full sm:w-auto"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Employees
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <Header
                title="Employee Details"
                subtitle={`View and manage information for ${employee.name || 'Employee'}`}
                showSearch={false}
            />

            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                <Card className="border-blue-200 shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50 flex items-center justify-between gap-3">
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Employee Information</h2>
                            </div>
                            <div className="flex-shrink-0">
                                <Button
                                    variant="destructive"
                                    onClick={handleRemoveEmployee}
                                    disabled={isRemoving || assignedAssets.length > 0}
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-not-allowed h-8 sm:h-10 px-3 sm:px-4"
                                >
                                    {isRemoving ? (
                                        <>
                                            <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span className="hidden sm:inline ml-2 text-sm">Removing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline ml-2 text-sm">Remove Employee</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="relative">
                                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-none border-2 border-white shadow-lg">
                                        <AvatarImage
                                            src={getGenderImage()}
                                            alt={employee.name}
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    </Avatar>
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                                        {employee.name}
                                    </h1>
                                    <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm break-all">{employee.email}</p>

                                    <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-xs sm:text-sm bg-white/90 text-blue-600 border-blue-300 px-2 sm:px-3 py-0.5 sm:py-1 font-semibold"
                                        >
                                            #{employee.employeeId}
                                        </Badge>
                                        {employee.gender && (
                                            <Badge className="bg-blue-100 text-blue-700 border-0 px-2 sm:px-3 py-0.5 sm:py-1 capitalize text-xs sm:text-sm">
                                                {employee.gender}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 bg-white hover:bg-blue-50/50 transition-colors duration-150">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Joined</p>
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {formatDate(employee.$createdAt || employee.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 bg-white hover:bg-blue-50/50 transition-colors duration-150">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Created By</p>
                                        <p className="text-sm font-medium text-gray-900 truncate" title={employee.creatorMail || 'Admin'}>
                                            {employee.creatorMail?.split('@')[0] || 'Admin'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                Asset Management
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                Assign and manage assets for this employee
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="bg-white rounded-xl border border-blue-200 p-4 sm:p-5 shadow-sm mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    Assign New Asset
                                </h3>

                                <div className="flex flex-col lg:grid lg:grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="lg:col-span-2">
                                        <CustomDropdown
                                            options={assetOptions}
                                            value={selectedAsset}
                                            onChange={setSelectedAsset}
                                            placeholder="Choose an asset to assign..."
                                            searchPlaceholder="Search assets by name or type..."
                                            className="w-full"
                                            disabled={loading}
                                        />
                                        {loading && (
                                            <p className="text-xs text-gray-500 mt-1">Loading available assets...</p>
                                        )}
                                        {!loading && assetOptions.length === 0 && (
                                            <p className="text-xs text-gray-500 mt-1">No available assets found</p>
                                        )}
                                    </div>

                                    <div className="w-full">
                                        <Button
                                            onClick={handleAssignAsset}
                                            disabled={!selectedAsset || isAssigning || loading}
                                            className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            {isAssigning ? (
                                                <>
                                                    <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    <span className="hidden sm:inline">Assigning...</span>
                                                    <span className="sm:hidden">...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Assign Asset</span>
                                                    <span className="sm:hidden">Assign</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Currently Assigned Assets ({assignedAssets.length})
                                    </h3>
                                    {assignedAssets.length > 0 && (
                                        <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                                            {assignedAssets.length} Asset{assignedAssets.length !== 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="text-center py-8 sm:py-10">
                                        <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-gray-600 text-sm sm:text-base">Loading assigned assets...</p>
                                    </div>
                                ) : assignedAssets.length > 0 ? (
                                    <div className="space-y-2 sm:space-y-3">
                                        {assignedAssets.map((asset) => (
                                            <div key={asset.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-blue-200 transition-colors duration-200">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                                                            {getAssetIcon(asset.assetType)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{asset.assetName}</p>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {asset.assetType}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500 truncate">
                                                                    ID: {asset.serial}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:justify-end gap-2">
                                                        <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">
                                                            Assigned
                                                        </Badge>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRemoveAsset(asset.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm"
                                                        >
                                                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-xl border border-gray-200">
                                        <Package className="h-10 w-10 sm:h-14 sm:w-14 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium text-sm sm:text-base">No assets assigned yet</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto px-4">
                                            Select an asset from the dropdown above and click "Assign Asset" to assign assets to this employee.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Snackbar
                    isOpen={snackbar.isOpen}
                    onClose={closeSnackbar}
                    message={snackbar.message}
                    type={snackbar.type}
                    duration={4000}
                />
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmRemoveEmployee}
                title="Delete Employee"
                description={`Are you sure you want to delete ${employee.name}? This action cannot be undone.`}
                confirmText="Delete Employee"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
}