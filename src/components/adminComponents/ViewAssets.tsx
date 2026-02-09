import { useEffect, useState, useCallback } from 'react'
import Header from '../Header'
import DynamicTable from '../DyanamicTable'
import { databases } from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import ConfirmModal from '../ConfirmModal';
import UpdateAssetModal from './UpdateModal';
import { Trash2, X, Settings2, ListTree, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Snackbar, useNotification } from '../Alerts';
import { Query } from 'appwrite';

interface Asset {
  id: any;
  docId: string;
  asset: any;
  desc: any;
  type: any;
  osType?: string;
  status: any;
  assignedTo: any;
  date: string;
  history: any[];
}

const truncateText = (text: any, maxLength: number = 50): string => {
  if (!text) return '-';
  const str = String(text);
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

export default function ViewAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteAssetId, setConfirmDeleteAssetId] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [showTypeDeleteConfirm, setShowTypeDeleteConfirm] = useState(false);
  const [isManagingTypes, setIsManagingTypes] = useState(false);
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAssetType, setIsLoadingAssetType] = useState(false);
  const uniqueStatuses = ['Available', 'Assigned', 'Maintenance'];
  const { snackbar, showSnackbar, closeSnackbar } = useNotification();

  const fetchAssets = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const res = await databases.listDocuments(
        'assetManagement',
        'assets',
        [Query.limit(100), Query.orderDesc('$createdAt')]
      );
      const formattedAssets = res.documents.map(doc => ({
        id: doc.assetId,
        docId: doc.$id,
        asset: doc.name || doc.assetName || 'N/A',
        desc: doc.description || '-',
        type: doc.assetType,
        osType: doc.osType,
        status: doc.status,
        assignedTo: doc.assignedTo || 'Not Assigned',
        date: new Date(doc.purchaseDate).toLocaleDateString(),
        historyQueue: doc.historyQueue
      }));
      setAssets(formattedAssets);
      setFilteredAssets(formattedAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      showSnackbar('Failed to load assets', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  const fetchAssetTypes = useCallback(async () => {
    try {
      const res = await databases.listDocuments('assetManagement', 'asset-type');
      const types = res.documents.map(doc => doc.assetType);
      setAssetTypes(types);
    } catch (err) {
      console.error("Error fetching asset types:", err);
      setAssetTypes(['Laptop', 'Mouse', 'Keyboard', 'Other']);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAssets(false), fetchAssetTypes()]);
      setIsLoading(false);
    };
    initData();
  }, [fetchAssets, fetchAssetTypes]);

  useEffect(() => {
    let filtered = [...assets];

    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'Available') {
        filtered = filtered.filter(asset => asset.status === 'Available' || asset.status === 'Available-O');
      } else if (statusFilter === 'Assigned') {
        filtered = filtered.filter(asset => asset.status === 'Assigned' || asset.status === 'Assigned-O');
      } else if (statusFilter === 'Maintenance') {
        filtered = filtered.filter(asset => asset.status === 'Maintainance' || asset.status === 'Damaged');
      } else {
        filtered = filtered.filter(asset => asset.status === statusFilter);
      }
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(asset =>
        String(asset.asset).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(asset.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(asset.desc).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(asset.osType).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssets(filtered);
  }, [statusFilter, typeFilter, assets, searchTerm]);

  const handleRemoveType = (type: string) => {
    setTypeToDelete(type);
    setIsManagingTypes(false);
    setShowTypeDeleteConfirm(true);
  };

  const handleDeleteAssetType = async () => {
    if (!typeToDelete) return;

    const assetsUsingType = assets.filter(asset => asset.type === typeToDelete);
    if (assetsUsingType.length > 0) {
      showSnackbar(
        `Cannot delete "${typeToDelete}". ${assetsUsingType.length} assets are using this type.`,
        'error'
      );
      setShowTypeDeleteConfirm(false);
      setTypeToDelete(null);
      return;
    }

    setIsLoadingAssetType(true);
    try {
      const res = await databases.listDocuments('assetManagement', 'asset-type', [
        Query.equal('assetType', typeToDelete)
      ]);

      if (res.total > 0) {
        await databases.deleteDocument('assetManagement', 'asset-type', res.documents[0].$id);
        showSnackbar(`Asset type "${typeToDelete}" deleted successfully`, 'success');
        setShowTypeDeleteConfirm(false);
        await fetchAssetTypes();

        if (typeFilter === typeToDelete) {
          setTypeFilter('all');
        }
      }
    } catch (err) {
      console.error("Error deleting asset type:", err);
      showSnackbar('Failed to delete asset type', 'error');
    } finally {
      setIsLoadingAssetType(false);
      setShowTypeDeleteConfirm(false);
      setTypeToDelete(null);
    }
  };

  const handleDeleteAsset = async () => {
    if (!confirmDeleteAssetId) return;

    const assetToDelete = assets.find(asset => asset.docId === confirmDeleteAssetId);
    if (assetToDelete?.status !== 'Available' && assetToDelete?.status !== 'Available-O') {
      showSnackbar('Cannot delete asset. Please make available first.', 'error');
      setShowConfirmDelete(false);
      setConfirmDeleteAssetId(null);
      return;
    }

    try {
      await databases.deleteDocument('assetManagement', 'assets', confirmDeleteAssetId);

      // Update local state
      setAssets(prev => prev.filter(asset => asset.docId !== confirmDeleteAssetId));
      setFilteredAssets(prev => prev.filter(asset => asset.docId !== confirmDeleteAssetId));

      showSnackbar('Asset deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting asset:', error);
      showSnackbar('Failed to delete asset', 'error');
    } finally {
      setShowConfirmDelete(false);
      setConfirmDeleteAssetId(null);
    }
  };

  const columns = [
    { key: 'id', title: 'ID', width: 100 },
    {
      key: 'asset',
      title: 'Asset',
      width: 200,
      render: (item: Asset) => (
        <span title={String(item.asset)}>
          {truncateText(item.asset, 30)}
        </span>
      )
    },
    {
      key: 'desc',
      title: 'Description',
      width: 250,
      render: (item: Asset) => (
        <span title={String(item.desc)} className="block">
          {truncateText(item.desc, 50)}
        </span>
      )
    },
    {
      key: 'type',
      title: 'Asset Type',
      width: 250,
      render: (item: Asset) => {
        const displayType = item.type === 'Laptop' && item.osType
          ? `Laptop (${item.osType})`
          : item.type;
        return (
          <span title={String(displayType)}>
            {truncateText(displayType, 25)}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      width: 150,
      render: (item: Asset) => (
        <span className={`px-3 py-0.5 rounded-full text-xs font-normal ${item.status === 'Assigned' || item.status === 'Assigned-O'
          ? 'bg-green-100 text-green-800'
          : item.status === 'Available' || item.status === 'Available-O'
            ? 'bg-blue-100 text-blue-800'
            : item.status === 'Damaged'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
          {item.status === 'Maintainance' ? 'Maintenance' : item.status}
        </span>
      )
    },
    {
      key: 'assignedTo',
      title: 'Assigned To',
      width: 150,
      render: (item: Asset) => (
        <span title={String(item.assignedTo)}>
          {item.assignedTo === 'unassigned' ? '-' : truncateText(item.assignedTo, 25)}
        </span>
      )
    },
    { key: 'date', title: 'Purchase Date', width: 150 },
    {
      key: 'remove',
      title: 'Actions',
      width: 180,
      render: (item: Asset) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAsset({
                $id: item.docId,
                assetId: item.id,
                assetName: item.asset,
                description: item.desc,
                status: item.status,
                assetType: item.type,
                osType: item.osType,
                assignedTo: item.assignedTo,
                purchaseDate: item.date,
                historyQueue: item.historyQueue
              });
              setShowUpdateModal(true);
            }}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 
                       rounded-lg text-sm font-medium transition-colors duration-200 
                       flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDeleteAssetId(item.docId);
              setShowConfirmDelete(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 
                       flex items-center space-x-1 ${item.status === 'Available' || item.status === 'Available-O'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            disabled={!(item.status === 'Available' || item.status === 'Available-O')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )
    },
  ] as any;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header
        title='Asset Inventory'
        subtitle='Manage and track company assets'
        showSearch={true}
        searchPlaceholder='Search assets by name, id, desc...'
        onSearchChange={(text) => {
          setSearchTerm(text);
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Asset Type</label>
                <Dialog open={isManagingTypes} onOpenChange={setIsManagingTypes}>
                  <DialogTrigger asChild>
                    <button
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                      title="Manage Asset Categories"
                    >
                      <Settings2 className="h-3 w-3" />
                      Manage
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        Manage Asset Categories
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search categories..."
                          className="pl-9 h-10 border-gray-200"
                          value={typeSearchTerm}
                          onChange={(e) => setTypeSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {assetTypes.filter(t => t.toLowerCase().includes(typeSearchTerm.toLowerCase())).length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            {typeSearchTerm ? "No categories match your search." : "No categories found."}
                          </div>
                        ) : (
                          assetTypes
                            .filter(t => t.toLowerCase().includes(typeSearchTerm.toLowerCase()))
                            .map((type) => {
                              const usageCount = assets.filter(a => a.type === type).length;
                              return (
                                <div
                                  key={type}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-gray-700">{type}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                      {usageCount} {usageCount === 1 ? 'Asset' : 'Assets'}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveType(type)}
                                    className={`p-2 rounded-lg transition-all ${usageCount > 0
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                      }`}
                                    title={usageCount > 0 ? `Cannot delete: ${usageCount} assets using this type` : "Delete Category"}
                                    disabled={usageCount > 0}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold"></h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total:</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {filteredAssets.length}
            </span>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-blue-50 shadow-sm space-y-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading amazing assets...</p>
          </div>
        ) : (
          <DynamicTable
            columns={columns}
            columnWidths={[60, 100, 140, 100, 100, 140, 120, 180] as any}
            data={filteredAssets as any}
            title=""
            bordered={true}
            striped={true}
            hoverable={true}
            onRowClick={(item: any) => navigate(`assetDetails/${item.id}`, { state: { asset: item } })}
          />
        )}

        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDeleteAsset}
          title="Delete Asset"
          description="Are you sure you want to delete this asset? This action cannot be undone."
          confirmText="Delete Asset"
          cancelText="Cancel"
          type="danger"
        />

        <ConfirmModal
          isOpen={showTypeDeleteConfirm}
          onClose={() => {
            setShowTypeDeleteConfirm(false);
            setTypeToDelete(null);
          }}
          onConfirm={handleDeleteAssetType}
          title="Delete Asset Type"
          description={`Are you sure you want to delete the asset type "${typeToDelete}"? This category will no longer be available for new assets.`}
          confirmText="Delete Type"
          cancelText="Cancel"
          type="danger"
          isLoading={isLoadingAssetType}
        />

        <Snackbar
          isOpen={snackbar.isOpen}
          onClose={closeSnackbar}
          message={snackbar.message}
          type={snackbar.type}
          duration={4000}
        />

        <UpdateAssetModal
          visible={showUpdateModal}
          asset={selectedAsset}
          onClose={() => {
            setShowUpdateModal(false);
            fetchAssets();
          }}
        />
      </div>
    </div>
  )
}