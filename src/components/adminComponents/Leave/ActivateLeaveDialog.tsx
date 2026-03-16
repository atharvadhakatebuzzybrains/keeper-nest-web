import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Calendar, UserPlus, X } from 'lucide-react';
import CustomDropdown from '../../CustomDropdown';
import { databases } from '../../../appwrite/config';
import { Query } from 'appwrite';

interface ActivateLeaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  leaveType: any | null;
}

interface SelectedEmployee {
  id: string;
  name: string;
  email?: string;
  department?: string;
}

export default function ActivateLeaveDialog({ isOpen, onClose, onSubmit, leaveType }: ActivateLeaveDialogProps) {
  const [applicableEmployees, setApplicableEmployees] = useState<'all' | 'selected'>('all');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string>('');
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string; department: string }[]>([]);
  const [originalEmployeeOptions, setOriginalEmployeeOptions] = useState<{ value: string; label: string; department: string }[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await databases.listDocuments('user_info', 'user_info', [Query.equal('role', 'employee')]);
        const options = response.documents.map((doc) => ({
          value: doc.$id,
          label: doc.name,
          department: doc.role || '',   
        }));
        setEmployeeOptions(options);
        setOriginalEmployeeOptions(options); // Store original options for reference
      }catch(err){
        console.error('Error fetching employees:', err);
      }
    }
    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    if (!currentSelection) return;

    const selectedOption = employeeOptions.find(opt => opt.value === currentSelection);
    
    if (selectedOption) {
      const newEmployee: SelectedEmployee = {
        id: selectedOption.value,
        name: selectedOption.label,
        department: selectedOption.department,
      };
      setSelectedEmployees(prev => [...prev, newEmployee]);
      setEmployeeOptions(prev => prev.filter(emp => emp.value !== newEmployee.id));
      setCurrentSelection('');
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    // Find the removed employee from selectedEmployees
    const removedEmployee = selectedEmployees.find(emp => emp.id === employeeId);
    
    if (removedEmployee) {
      // Add the employee back to employeeOptions
      const employeeToAddBack = {
        value: removedEmployee.id,
        label: removedEmployee.name,
        department: removedEmployee.department || '',
      };
      
      setEmployeeOptions(prev => [...prev, employeeToAddBack].sort((a, b) => a.label.localeCompare(b.label)));
      setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      applicableEmployees,
      effectiveFrom,
      employeeIds: selectedEmployees.map(emp => emp.id),
      employeeDetails: selectedEmployees,
    });
    
    // Reset state after submission
    handleClose();
  };

  const handleClose = () => {
    setApplicableEmployees('all');
    setEffectiveFrom(new Date().toISOString().split('T')[0]);
    setSelectedEmployees([]);
    setCurrentSelection('');
    // Reset employeeOptions to original state
    setEmployeeOptions(originalEmployeeOptions);
    onClose();
  };

  if (!leaveType) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Activate Leave Type</DialogTitle>
          <DialogDescription>
            Configure activation settings for "{leaveType.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Applicable Employees Radio */}
          <div className="space-y-2">
            <Label>Applicable To</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="applicableEmployees"
                  value="all"
                  checked={applicableEmployees === 'all'}
                  onChange={(e) => setApplicableEmployees(e.target.value as 'all')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">All Employees</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="applicableEmployees"
                  value="selected"
                  checked={applicableEmployees === 'selected'}
                  onChange={(e) => setApplicableEmployees(e.target.value as 'selected')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">Selected Employees</span>
              </label>
            </div>
          </div>

          {applicableEmployees === 'selected' && (
            <div className="space-y-3">
              <Label>Select Employees</Label>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <CustomDropdown
                    placeholder='Search employees...'
                    options={employeeOptions}
                    value={currentSelection}
                    onChange={(value) => setCurrentSelection(value as string)}
                    isSearchable={true}
                  />
                </div>
                <Button 
                  onClick={handleAddEmployee}
                  disabled={!currentSelection || selectedEmployees.some(emp => emp.id === currentSelection)}
                  className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {selectedEmployees.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Selected Employees ({selectedEmployees.length})
                  </Label>
                  <div className="border rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                    {selectedEmployees.map((employee) => (
                      <div 
                        key={employee.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 border-b last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {employee.name}
                          </p>
                          {employee.department && (
                            <p className="text-xs text-gray-500">
                              {employee.department}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEmployees.length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4 border rounded-lg bg-gray-50">
                  No employees selected. Use the dropdown above to add employees.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-green-600 hover:bg-green-700"
            disabled={applicableEmployees === 'selected' && selectedEmployees.length === 0}
          >
            Activate Leave Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}