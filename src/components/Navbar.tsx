import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { User, Moon, Sun, LogOut } from "lucide-react";
import "./styles/navbarStyles.css";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite/config";
import { roleCache } from "../utils/roleCache";
import ConfirmModal from "./ConfirmModal";
import logoApp from '../assets/images/logo_app.png';

interface props {
  name: string,
  email: string,
  role: string
}

export default function Navbar({name, email, role}: props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const navigate = useNavigate();
  const logo = name.toUpperCase()[0];
  const user = {
    name: name,
    initials: logo,
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          profileBtnRef.current && !profileBtnRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add functionality here to actually change the theme
    console.log(`Dark mode: ${!isDarkMode}`);
  };

  const handleLogout = async () => {
    try{
      await account.deleteSession('current');
      console.log("Logged out successfully");
      roleCache.clear();
      navigate('/');
    }catch(err){
      console.log("Logout error: ", err);
    }
  }

  return (
    <nav className="navbar ">
      <div className="navbar-left">
        <div className="logo-container">
          <div className="logo-icon">
            <img 
              src={logoApp} 
              alt="KeeperNest Logo" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="logo-fallback">KN</div>';
              }}
            />
          </div>
        </div>
        <h1 className="app-name">KeeperNest</h1>
      </div>

      <div className="navbar-right">
        <div 
          className={`user-profile-btn ${isDropdownOpen ? 'active' : ''}`}
          onClick={handleProfileClick}
          ref={profileBtnRef}
        >
          <Avatar className="avatar-large">
            <AvatarFallback className="avatar-fallback-large">{user.initials}</AvatarFallback>
          </Avatar>
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                <Avatar className="dropdown-avatar-icon-large">
                  <AvatarFallback className="dropdown-avatar-fallback-large">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="dropdown-user-info">
                <h3 className="dropdown-user-name">{user.name} </h3>
                <p className="dropdown-user-email">{email}</p>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-items">
              <button 
                className="dropdown-item"
                onClick={() => navigate(`/dashboard/profile`)}
              >
                <User className="dropdown-item-icon" />
                <span>Profile</span>
              </button>
              
              <div className="dropdown-item theme-toggle">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {isDarkMode ? (
                      <>
                        <Sun className="dropdown-item-icon" />
                        <span>Theme</span>
                      </>
                    ) : (
                      <>
                        <Moon className="dropdown-item-icon" />
                        <span>Theme</span>
                      </>
                    )}
                  </div>
                  
                  <button 
                    className="rectangular-toggle"
                    onClick={toggleDarkMode}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    <div className="toggle-container">
                      <div className="toggle-track">
                        <div className="toggle-option left">
                          <Moon className="toggle-icon" />
                        </div>
                        <div className="toggle-option right">
                          <Sun className="toggle-icon" />
                        </div>
                        <div className={`toggle-slider ${isDarkMode ? 'right' : 'left'}`}>
                          {isDarkMode ? (
                            <Sun className="slider-icon" />
                          ) : (
                            <Moon className="slider-icon" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-item logout"
              onClick={() => {
                setShowLogoutConfirm(true);
                setIsDropdownOpen(false);
              }}
            >
              <LogOut className="dropdown-item-icon" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        icon={<LogOut className="h-6 w-6" />}
        description="Are you sure you want to sign out? You'll need to log in again to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
        type="danger"
      />
    </nav>
  );
}