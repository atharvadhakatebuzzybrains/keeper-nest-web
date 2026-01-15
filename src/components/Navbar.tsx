import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import "./styles/navbarStyles.css";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite/config";
import { roleCache } from "../utils/roleCache";
interface props {
  name: string,
  email: string,
  role: string
}
export default function Navbar({name, email, role}: props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const navigate = useNavigate();
  const logo = name.toUpperCase()[0];
  const user = {
    name: name,
    initials: logo,
  };

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

  const handleMenuItemClick = (action: any) => {
    console.log(`Clicked: ${action}`);
    setIsDropdownOpen(false);
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
              src="/src/assets/images/logo_app.png" 
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

        {/* Dropdown Menu */}
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
              
              <button 
                className="dropdown-item"
                onClick={() => handleMenuItemClick("settings")}
              >
                <Settings className="dropdown-item-icon" />
                <span>Settings</span>
              </button>
            </div>

            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-item logout"
              onClick={() => handleLogout()}
            >
              <LogOut className="dropdown-item-icon" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}