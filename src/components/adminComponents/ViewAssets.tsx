import React, { useEffect, useState } from 'react'
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

export default function ViewAssets() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();

  // Get unique statuses and categories from assets
  const uniqueStatuses = ['Available', 'Assigned', 'Maintenance'];
  const uniqueTypes = ['Laptop', 'Keyboard', 'Mouse', 'Other'];

  useEffect(() => {
    const fetchAssets = async () => {
      const res = await databases.listDocuments('assetManagement', 'assets');
      const formattedAssets = res.documents.map(doc => ({
        id: doc.assetId,
        asset: doc.name || doc.assetName || 'N/A',
        desc: doc.description || 'No description',
        type: doc.assetType,
        status: doc.status,
        assignedTo: doc.assignedTo || 'Not Assigned',
        date: new Date(doc.purchaseDate).toLocaleDateString(),
      }));
      setAssets(formattedAssets);
      setFilteredAssets(formattedAssets);
    }
    fetchAssets();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = assets;

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    setFilteredAssets(filtered);
  }, [statusFilter, typeFilter, assets]);

  const columns = [
    { key: 'id', title: 'ID', width: 100 },
    { key: 'asset', title: 'Asset', width: 200 },
    { key: 'desc', title: 'Description', width: 250 },
    { key: 'type', title: 'Asset Type', width: 250 },
    { 
      key: 'status', 
      title: 'Status', 
      width: 150,
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.status === 'Assigned' 
            ? 'bg-green-100 text-green-800' 
            : item.status === 'Available'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
      )
    },
    { key: 'assignedTo', title: 'Assigned To', width: 150 },
    { key: 'date', title: 'Purchase Date', width: 150 },
    { 
      key: 'remove', 
      title: 'Actions', 
      width: 180,
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit asset:', item.id);
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
              console.log('Remove asset:', item.id);
            }}
            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 
                       rounded-lg text-sm font-medium transition-colors duration-200 
                       flex items-center space-x-1"
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
  ];

  return (
    <>
      <Header 
        title='Asset Inventory' 
        subtitle='Manage and track company assets' 
        showSearch={true} 
        searchPlaceholder='Search assets by name, id, desc...' 
      />
      
      <div className="p-4 sm:p-6">
        {/* Clean Filter Section */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
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

            {/* Type Filter */}
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
        
        <DynamicTable
          columns={columns}
          columnWidths={[60, 100, 140, 80, 100, 140, 120, 180]}
          data={filteredAssets}
          title=""
          bordered={true}
          striped={true}
          hoverable={true}
          onRowClick={(item) => navigate(`assetDetails/${item.id}`)}
        />
      </div>
    </>
  )
}