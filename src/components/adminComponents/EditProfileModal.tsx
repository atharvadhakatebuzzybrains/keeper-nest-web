import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentGender: string;
  onSave: (name: string, gender: string) => void;
}

const EditProfileModal = ({
  isOpen,
  onClose,
  currentName,
  currentGender,
  onSave,
}: EditProfileModalProps) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setGender(currentGender);
    }
  }, [isOpen, currentName, currentGender]);

  const handleSave = () => {
    setLoading(true);
    onSave(name.trim(), gender);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-32px)] rounded-xl max-w-md mx-auto p-0 sm:p-6 my-4 sm:my-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-0 pb-4">
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-4 sm:px-0">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 px-4 sm:px-0 pb-4 sm:pb-0 border-t border-gray-200 sm:border-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;