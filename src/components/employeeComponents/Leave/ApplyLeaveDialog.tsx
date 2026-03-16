import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import CustomDropdown from '../../CustomDropdown';

interface ApplyLeaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LeaveFormData) => void;
}

export interface LeaveFormData {
  leaveType: 'earned' | 'loss-of-pay';
  startDate: string;
  endDate: string;
  startDayType: 'full-day' | 'first-half' | 'second-half';
  endDayType: 'full-day' | 'first-half' | 'second-half';
  reason: string;
}

export default function ApplyLeaveDialog({ isOpen, onClose, onSubmit }: ApplyLeaveDialogProps) {

  const initialState: LeaveFormData = {
    leaveType: 'earned',
    startDate: '',
    endDate: '',
    startDayType: 'full-day',
    endDayType: 'full-day',
    reason: '',
  };

  const [formData, setFormData] = useState<LeaveFormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {

    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {

    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialState);
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData(initialState);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>

      <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto">

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Apply for Leave
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Fill in the details to submit your leave request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">

          {/* Leave Type */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">
              Leave Type
            </Label>

            <CustomDropdown
              placeholder='Select Leave Type'
              options={[
                { value: 'earned', label: 'Earned Leave' },
                { value: 'loss-of-pay', label: 'Loss of Pay' },
              ]}
              value={formData.leaveType}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  leaveType: value as 'earned' | 'loss-of-pay'
                })
              }
              isSearchable={false}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">

            {/* Start Date */}
            <div className="space-y-3">

              <div>
                <Label className="text-xs sm:text-sm font-medium">
                  Start Date
                </Label>

                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />

                {errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <CustomDropdown
                  options={[
                    { value: 'full-day', label: 'Full Day' },
                    { value: 'first-half', label: 'First Half' },
                    { value: 'second-half', label: 'Second Half' },
                  ]}
                  value={formData.startDayType}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      startDayType: value as 'full-day' | 'first-half' | 'second-half'
                    })
                  }
                  placeholder="Select day type"
                  isSearchable={false}
                />
              </div>

            </div>

            {/* End Date */}
            <div className="space-y-3">

              <div>
                <Label className="text-xs sm:text-sm font-medium">
                  End Date
                </Label>

                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />

                {errors.endDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.endDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <CustomDropdown
                  options={[
                    { value: 'full-day', label: 'Full Day' },
                    { value: 'first-half', label: 'First Half' },
                    { value: 'second-half', label: 'Second Half' },
                  ]}
                  value={formData.endDayType}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      endDayType: value as 'full-day' | 'first-half' | 'second-half'
                    })
                  }
                  placeholder="Select day type"
                  isSearchable={false}
                />
              </div>

            </div>

          </div>

          {/* Reason */}
          <div className="space-y-2">

            <Label className="text-xs sm:text-sm font-medium">
              Reason (Optional)
            </Label>

            <Textarea
              placeholder="Write your reason for leave..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reason: e.target.value.slice(0, 500)
                })
              }
              className="resize-none min-h-24 text-sm"
            />

          </div>

        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">

          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Apply
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}