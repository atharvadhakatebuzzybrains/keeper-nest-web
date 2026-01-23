import Header from '../Header'
import AssetForm from './AssetForm'

export default function AddAssets() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header title='Add New Asset' subtitle='Please fill in the details of the new asset' />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <AssetForm />
      </div>
    </div>
  )
}