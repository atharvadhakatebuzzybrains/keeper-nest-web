// components/NotFound.tsx
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        
        <div className="mb-10">
          <div className="text-8xl font-bold text-[#3b82f6] opacity-90 mb-2">
            404
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full mx-auto mb-6"></div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </h1>
          <p className="text-gray-500 max-w-sm">
            The requested URL was not found on this server.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;