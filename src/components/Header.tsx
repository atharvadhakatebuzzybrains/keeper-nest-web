import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/config';
import { useEffect, useState } from 'react';

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
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[#3b82f6]/10 rounded-lg transition-colors text-[#3b82f6] flex-shrink-0"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-800 truncate">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
            </div>
          </div>

          {showProfile && (
            <div className="flex-shrink-0 ml-6">
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
    </div>
  );
};

export default Header;