import { Mail, Briefcase, User, Hash, Edit3, Key, LogOut, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { account, databases } from '../appwrite/config';
import { Query } from 'appwrite';
import { roleCache } from '../utils/roleCache';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/adminComponents/ChangePasswordModal';
import EditProfileModal from '../components/adminComponents/EditProfileModal';
import Header from '../components/Header';


const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3b82f6]/5 via-white to-[#60a5fa]/5">
      {/* Header */}
     <Header title="Profile" />

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header - Changed main avatar to circular */}
          <div className="p-6 border-b border-gray-100 relative">
            {/* Sign Out Button */}
{/* Sign Out Button */}
<button
  onClick={handleLogout}
  className="
    absolute z-10
    bottom-4 left-4
    sm:top-4 sm:right-4 sm:bottom-auto sm:left-auto

    flex items-center justify-center gap-2
    h-10 w-10 sm:w-auto
    px-0 sm:px-3

    border border-red-300
    text-red-600
    rounded-full sm:rounded-lg
    text-sm font-medium

    bg-white
    hover:bg-red-50
    transition-all duration-200
  "
  aria-label="Sign Out"
>
  <LogOut size={16} />
  <span className="hidden sm:inline">Sign Out</span>
</button>


            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${role === 'admin'
                      ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                      : 'bg-green-50 text-green-700'
                    }`}>
                    {role}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{email}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {gender}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash size={12} />
                    {employeeId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid - Changed icon containers to circular */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Email */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-[#3b82f6] transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                  <Mail size={18} className="text-[#3b82f6]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Email Address</p>
                  <p className="text-gray-900 font-medium text-sm truncate">{email}</p>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-green-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <User size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Gender</p>
                  <p className="text-gray-900 font-medium text-sm capitalize">{gender}</p>
                </div>
              </div>
            </div>

            {/* Employee ID */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Hash size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Employee ID</p>
                  <p className="text-gray-900 font-medium text-sm font-mono">{employeeId}</p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-purple-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Briefcase size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Role</p>
                  <p className="text-gray-900 font-medium text-sm capitalize">{role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowEditProfile(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors">
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>

              <button onClick={() => setShowChangePassword(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#3b82f6] text-[#3b82f6] rounded-lg font-medium hover:bg-blue-50 transition-colors">
                <Key size={16} />
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
    setName(updatedName);
    setGender(updatedGender);
    
    try{
      const user = await account.get();
      const dbId = "user_info";
      const collectionId = "user_info";

      await account.updateName(updatedName);
      await databases.updateDocument(dbId, collectionId, user.$id, {gender: updatedGender, name: updatedName});

      alert("Updation successful");
    }catch(err){
      console.log(err);
    }
  }}
/>


    </div>
  );
}

export default Profile;