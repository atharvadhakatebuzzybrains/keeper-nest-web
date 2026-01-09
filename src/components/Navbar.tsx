import { Avatar, AvatarFallback } from "../components/ui/avatar";
import "./styles/navbarStyles.css";

export default function Navbar() {
  const user = {
    name: "Atharva Dhakate",
    initials: "A",
  };

  return (
    <nav className="navbar">
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
        <div className="user-profile-btn">
          <Avatar className="avatar">
            <AvatarFallback className="avatar-fallback">{user.initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}