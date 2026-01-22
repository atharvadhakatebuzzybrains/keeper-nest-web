import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/config';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (searchTerm: string) => void;
  searchValue?: string; 
  searchDebounce?: number;
  rightContent?: React.ReactNode;
}

const Header = ({
  title,
  subtitle,
  showBackButton = true,
  showProfile = true,
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
  searchValue: externalSearchValue,
  searchDebounce = 300,
  rightContent
}: HeaderProps) => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState('');
  const [internalSearch, setInternalSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearch;

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

  // Debounce search
  useEffect(() => {
    if (!showSearch || !onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, searchDebounce);

    return () => clearTimeout(timer);
  }, [searchValue, showSearch, onSearchChange, searchDebounce]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (externalSearchValue === undefined) {
      setInternalSearch(value);
    }
    // Parent component handles if externalSearchValue is provided
  };

  const handleClearSearch = () => {
    if (externalSearchValue === undefined) {
      setInternalSearch('');
    }
    onSearchChange?.('');
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      handleClearSearch();
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-[#3b82f6]/10 rounded-lg transition-colors text-[#3b82f6] flex-shrink-0"
              aria-label="Go back"
            >
              <FaArrowLeft size={20} />
            </button>
          )}

          {(!isSearchActive || !showSearch) && (
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-800 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {showSearch && isSearchActive && (
            <div className="flex-1 sm:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch size={16} />
                </div>
                {searchValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {showSearch && !isSearchActive && (
          <div className="hidden sm:block flex-1 max-w-lg mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch size={16} />
              </div>
              {searchValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right section - Search Toggle (mobile) and Profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Custom right content */}
          {rightContent}

          {/* Search Toggle Button (Mobile) */}
          {showSearch && (
            <button
              onClick={toggleSearch}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              aria-label={isSearchActive ? "Close search" : "Open search"}
            >
              {isSearchActive ? <FaTimes size={20} /> : <FaSearch size={20} />}
            </button>
          )}

          {showProfile && (
            <div className="flex-shrink-0">
              <div
                className="h-8 w-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
                role="img"
                aria-label={`User initial ${initial || 'U'}`}
                title="Profile"
                // onClick={() => navigate('/profile')}
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