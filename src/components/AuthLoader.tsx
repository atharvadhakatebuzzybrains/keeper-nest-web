import logo from '../assets/images/logo_app.png';

export default function AuthLoader() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-50/30 to-white">
      {/* Main loader container */}
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Large Logo container */}
          <div className="relative">
            <img
              src={logo}
              alt="KeeperNest"
              className="relative w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>

          {/* Straight line progress indicator */}
          <div className="w-48 md:w-64 mt-8">
            <div className="h-0.5 bg-gray-300 overflow-hidden">
              <div
                className="h-full bg-[#3b82f6]"
                style={{
                  animation: 'progress 5s linear infinite'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}