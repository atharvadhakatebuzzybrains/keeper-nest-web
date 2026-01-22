import { Mail, Briefcase, User, Hash, Edit3, Key, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { account, databases } from '../appwrite/config';
import { Query } from 'appwrite';
import { roleCache } from '../utils/roleCache';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/adminComponents/ChangePasswordModal';
import EditProfileModal from '../components/adminComponents/EditProfileModal';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';
import { CustomNotification, Snackbar, useNotification } from '../components/Alerts';

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {snackbar, showSnackbar, closeSnackbar} = useNotification();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await account.get();
        const res = await databases.listDocuments(
          'user_info',
          'user_info',
          [Query.equal('employeeId', user.$id)]
        );

        if (res.documents.length > 0) {
          const userData = res.documents[0];
          setName(userData.name);
          setEmail(userData.email);
          setEmployeeId(userData.employeeId);
          setGender(userData.gender);
          setRole(userData.role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      roleCache.clear();
      navigate('/');
    } catch (err) {
      console.log("Logout error: ", err);
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  }

  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header title="Profile" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 relative">
            <button
              onClick={handleLogoutClick}
              className="
                absolute 
                top-4 right-4
                flex items-center justify-center gap-2
                h-9 w-9 sm:h-10 sm:w-10 md:w-auto
                px-0 md:px-3
                border border-red-300
                text-red-600
                rounded-full md:rounded-lg
                text-sm font-medium
                bg-white
                hover:bg-red-50
                transition-all duration-200
                z-10
              "
              aria-label="Sign Out"
            >
              <LogOut size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] flex items-center justify-center shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <div className="relative group">
                    <h2 
                      className="text-lg sm:text-xl font-semibold text-gray-900 truncate"
                      title={name}
                    >
                      {truncateText(name, 25)} 
                    </h2>
                    {name.length > 25 && (
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
                        <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                          {name}
                          <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${role === 'admin'
                    ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                    : 'bg-green-50 text-green-700'
                    } flex-shrink-0`}>
                    {role}
                  </span>
                </div>
                
                <div className="relative group mb-2">
                  <p 
                    className="text-gray-600 text-sm truncate"
                    title={email}
                  >
                    {truncateText(email, 30)}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={10} className="sm:w-3 sm:h-3" />
                    {gender}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash size={10} className="sm:w-3 sm:h-3" />
                    {employeeId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6">
            <div className="p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-[#3b82f6] transition-colors group relative">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="sm:w-4 sm:h-4 text-[#3b82f6]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Email Address</p>
                  <p 
                    className="text-gray-900 font-medium text-sm truncate"
                    title={email}
                  >
                    {truncateText(email, 50)}
                  </p>
                </div>
              </div>
            </div>

            {/* Gender Card */}
            <div className="p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-green-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Gender</p>
                  <p className="text-gray-900 font-medium text-sm capitalize">{gender}</p>
                </div>
              </div>
            </div>

            {/* Employee ID Card */}
            <div className="p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-amber-400 transition-colors group relative">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Hash size={14} className="sm:w-4 sm:h-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Employee ID</p>
                  <p className="text-gray-900 font-medium text-sm font-mono truncate" title={employeeId}>
                    {employeeId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-purple-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Role</p>
                  <p className="text-gray-900 font-medium text-sm capitalize">{role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowEditProfile(true)} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors text-sm sm:text-base"
                disabled={loading}
              >
                <Edit3 size={14} className="sm:w-4 sm:h-4" />
                <span>Edit Profile</span>
              </button>

              <button 
                onClick={() => setShowChangePassword(true)} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#3b82f6] text-[#3b82f6] rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base"
                disabled={loading}
              >
                <Key size={14} className="sm:w-4 sm:h-4" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentName={name}
        currentGender={gender}
        onSave={async (updatedName, updatedGender) => {
          setLoading(true);
          setName(updatedName);
          setGender(updatedGender);

          try {
            const user = await account.get();
            const dbId = "user_info";
            const collectionId = "user_info";

            await account.updateName(updatedName);
            await databases.updateDocument(dbId, collectionId, user.$id, { gender: updatedGender, name: updatedName });

            showSnackbar("Profile updated successfully", "success");
          } catch (err) {
            console.log(err);
          } finally {
            setLoading(false);
          }
        }}
      />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        icon={<LogOut className="h-5 w-5 sm:h-6 sm:w-6" />}
        description="Are you sure you want to sign out? You'll need to log in again to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
        type="danger"
      />

      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
        message={snackbar.message}
        type={snackbar.type}
        duration={4000}
      />
    </div>
  );
}

export default Profile;