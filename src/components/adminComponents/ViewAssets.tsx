import { useEffect, useState } from 'react'
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
import { Snackbar, useNotification } from '../Alerts';

interface Asset {
  id: any;         
  docId: string;    
  asset: any;
  desc: any;
  type: any;
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
  const uniqueStatuses = ['Available', 'Assigned', 'Maintenance'];
  const uniqueTypes = ['Laptop', 'Keyboard', 'Mouse', 'Other'];
  const { snackbar, showSnackbar, closeSnackbar } = useNotification();

  const fetchAssets = async () => {
    const res = await databases.listDocuments('assetManagement', 'assets');
    const formattedAssets = res.documents.map(doc => ({
      id: doc.assetId,
      docId: doc.$id,
      asset: doc.name || doc.assetName || 'N/A',
      desc: doc.description || 'No description',
      type: doc.assetType,
      status: doc.status,
      assignedTo: doc.assignedTo || 'Not Assigned',
      date: new Date(doc.purchaseDate).toLocaleDateString(),
      history: doc.historyQueue
    }));
    setAssets(formattedAssets);
    setFilteredAssets(formattedAssets);
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [selectedAsset, showUpdateModal]);

  useEffect(() => {
    let filtered = [...assets];

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(asset =>
        String(asset.asset).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(asset.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(asset.desc).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssets(filtered);
  }, [statusFilter, typeFilter, assets, searchTerm]);



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
      render: (item: Asset) => (
        <span title={String(item.type)}>
          {truncateText(item.type, 25)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      width: 150,
      render: (item: Asset) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Assigned'
          ? 'bg-green-100 text-green-800'
          : item.status === 'Available'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
          }`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'assignedTo',
      title: 'Assigned To',
      width: 150,
      render: (item: Asset) => (
        <span title={String(item.assignedTo)}>
          {truncateText(item.assignedTo, 25)}
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
                assignedTo: item.assignedTo,
                purchaseDate: item.date
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
            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 
                       rounded-lg text-sm font-medium transition-colors duration-200 
                       flex items-center space-x-1"

            // disabled={item.status === 'Assigned'}
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

  const handleDeleteAsset = async () => {
    if (!confirmDeleteAssetId) return;

    if(assets.find(asset => asset.docId === confirmDeleteAssetId)?.status !== 'Available') {
      showSnackbar('Cannot delete asset. Please make available first.', 'error');
      setShowConfirmDelete(false);
      setConfirmDeleteAssetId(null);
      return;
    }

    try {
      await databases.deleteDocument('assetManagement', 'assets', confirmDeleteAssetId);
      setAssets(prev => prev.filter(asset => asset.docId !== confirmDeleteAssetId));
      setFilteredAssets(prev => prev.filter(asset => asset.docId !== confirmDeleteAssetId));
      setShowConfirmDelete(false);
      setConfirmDeleteAssetId(null);

      showSnackbar('Asset deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Asset Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
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
        <DynamicTable
          columns={columns}
          columnWidths={[60, 100, 140, 80, 100, 140, 120, 180] as any}
          data={filteredAssets as any}
          title=""
          bordered={true}
          striped={true}
          hoverable={true}
          onRowClick={(item: any) => navigate(`assetDetails/${item.id}`, { state: { asset: item } })}
        />

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
        <Snackbar
          isOpen={snackbar.isOpen}
          onClose={closeSnackbar}
          message={snackbar.message}
          type={snackbar.type}
          duration={4000}
        />
        <UpdateAssetModal visible={showUpdateModal} asset={selectedAsset} onClose={() => {
          setShowUpdateModal(false);
        }} />
      </div>
    </div>
  )
}