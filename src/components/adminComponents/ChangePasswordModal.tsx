import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { account, databases } from "../../appwrite/config";
import { encrypt } from "../../appwrite/encrypt_decrypt_password";
import { Snackbar, useNotification } from "../Alerts";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {snackbar, showSnackbar, closeSnackbar} = useNotification();
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

  const showMismatchError =
    confirmPassword.length > 0 && newPassword !== confirmPassword;


  const handleChangePassword = async () => {
    setLoading(true);
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    if (!passwordsMatch) return;

    try {
      await account.updatePassword(newPassword, currentPassword);
      const user = await account.get();

      await databases.updateDocument(
        'user_info',
        'user_info',
        user.$id,
        {
          password: encrypt(newPassword),
        }
      );
      showSnackbar("Password updated successfully", "success");
      onClose();
    }catch(err){
      alert(err);
    }finally{
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-32px)] rounded-xl max-w-md mx-auto p-0 sm:p-6 my-4 sm:my-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-0 pb-4">
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-4 sm:px-0">
          {/* Current Password */}
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`pr-10 ${showMismatchError
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {showMismatchError && (
              <p className="text-sm text-red-500">
                Passwords do not match
              </p>
            )}

            {passwordsMatch && (
              <p className="text-sm text-green-600">
                Passwords match ✓
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 px-0 pb-4 sm:pb-0 border-t border-gray-200 sm:border-0 mt-4 sm:mt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={!passwordsMatch || !currentPassword || loading}
            >
              {
              loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"
              }
            </Button>
          </div>
        </div>
      </DialogContent>

      <Snackbar
                    isOpen={snackbar.isOpen}
                    onClose={closeSnackbar}
                    message={snackbar.message}
                    type={snackbar.type}
                    duration={4000}
                  />
    </Dialog>
  );
};

export default ChangePasswordModal;
