import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/config';
import { useEffect, useState } from 'react';

import { FaArrowLeft } from "react-icons/fa";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showProfile?: boolean;
}

const Header = ({ title, subtitle, showBackButton = true, showProfile = true }: HeaderProps) => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState('');

  useEffect(() => {
    const getInitial = async () => {
      try {
        const user = await account.get();
        if (user && user.name) {
          setInitial(String(user.name).charAt(0).toUpperCase());
        }
      } catch (err) {
        console.log(err);
      }
    };
    getInitial();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };



return (
  <div className="w-full bg-white border-b border-gray-100 shadow-sm">
    <div className="flex items-center justify-between px-6 py-4">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-[#3b82f6]/10 rounded-lg transition-colors text-[#3b82f6] flex-shrink-0"
          >
            <FaArrowLeft size={20} />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-800 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right section */}
      {showProfile && (
        <div className="flex-shrink-0">
          <div
            className="h-8 w-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-semibold text-sm"
            role="img"
            aria-label={`User initial ${initial || 'U'}`}
            title="Profile"
          >
            {initial || 'U'}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Header;