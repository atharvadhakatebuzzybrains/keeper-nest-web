import { useState } from 'react';
import Header from '../../Header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import {
  AlertCircle,
  Edit2,
  Plus,
  Trash2,
  Users,
  Power,
  EyeOff,
} from 'lucide-react';
import CreateLeaveDialog from './CreateLeaveDialog';
import ActivateLeaveDialog from './ActivateLeaveDialog';
import ConfirmModal from '../../ConfirmModal';
import EditLeaveDialog from './EditLeaveDialog';

interface LeaveType {
  id: string;
  name: string;
  shortCode: string;
  maxDays: number;
  carryForward: number;
  requiresApproval: boolean;
  description: string;
  policies: string[];
  creditType?: 'yearly' | 'monthly-accrual' | 'not-applicable';
  totalDaysYear?: number;
  creditDate?: string;
  customCreditDate?: string;
  creditRules?: any[];
  yearEndRules?: any[];
  consumptionRules?: any[];
  isActive: boolean; 
  applicableEmployees?: 'all' | 'selected' | 'departments' | 'roles';
  employeeIds?: string[];
  roleIds?: string[];
  effectiveFrom?: string;
}

const leaveTypes: LeaveType[] = [];

const getColorClasses = (color: string) => {
  const colors: { [key: string]: { bg: string; text: string; border: string } } = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };
  return colors.blue;
};

export default function LeaveManagement() {
  const [leaveTypesList, setLeaveTypesList] = useState<LeaveType[]>(leaveTypes);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(leaveTypes[0]);
  const [isCreateLeaveOpen, setIsCreateLeaveOpen] = useState(false);
  const [isEditLeaveOpen, setIsEditLeaveOpen] = useState(false);
  const [leaveToEdit, setLeaveToEdit] = useState<LeaveType | null>(null);
  const [isActivateLeaveOpen, setIsActivateLeaveOpen] = useState(false);
  const [leaveToActivate, setLeaveToActivate] = useState<LeaveType | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const handleCreateLeave = (data: any) => {
    const newLeaveType: LeaveType = {
      id: String(leaveTypesList.length + 1),
      name: data.leaveName,
      shortCode: data.shortCode,
      maxDays: parseInt(data.totalDaysYear) || 20,
      carryForward: data.yearEndRules?.find((r: any) => r.id === 'carry-forward')?.value || 0,
      requiresApproval: true,
      description: data.description,
      policies: data.consumptionRules?.map((r: any) => `${r.label}: ${r.value ? r.value + ' ' + (r.unit || '') : 'Enabled'}`) || [],
      creditType: data.creditType,
      totalDaysYear: parseInt(data.totalDaysYear),
      creditDate: data.creditDate,
      creditRules: data.creditRules,
      yearEndRules: data.yearEndRules,
      consumptionRules: data.consumptionRules,
      isActive: false,
      applicableEmployees: 'all',
      employeeIds: [],
      roleIds: [],
      effectiveFrom: new Date().toISOString().split('T')[0],
    };

    setLeaveTypesList([...leaveTypesList, newLeaveType]);
    setSelectedLeaveType(newLeaveType);
    setIsCreateLeaveOpen(false);
    console.log('Leave type created:', newLeaveType);
  };

  const handleActivateLeave = (data: any) => {
    if (!leaveToActivate) return;

    const updatedLeaveTypes = leaveTypesList.map(leave => {
      if (leave.id === leaveToActivate.id) {
        return {
          ...leave,
          isActive: true,
          applicableEmployees: data.applicableEmployees,
          employeeIds: data.employeeIds || [],
          roleIds: data.roleIds || [],
          effectiveFrom: data.effectiveFrom,
        };
      }
      return leave;
    });

    setLeaveTypesList(updatedLeaveTypes);
    setSelectedLeaveType(updatedLeaveTypes.find(l => l.id === leaveToActivate.id) || null);
    setIsActivateLeaveOpen(false);
    setLeaveToActivate(null);
  };

  const handleDeactivateLeave = (leaveId: string) => {
    const updatedLeaveTypes = leaveTypesList.map(leave => {
      if (leave.id === leaveId) {
        return {
          ...leave,
          isActive: false,
          applicableEmployees: undefined,
          employeeIds: [],
          roleIds: [],
          effectiveFrom: undefined,
        };
      }
      return leave;
    });

    setLeaveTypesList(updatedLeaveTypes);
    setSelectedLeaveType(updatedLeaveTypes.find(l => l.id === leaveId) || null);
  };

  const handleEditLeave = (leave: LeaveType) => {
    setLeaveToEdit(leave);
    setIsEditLeaveOpen(true);
  };

  const handleUpdateLeave = (data: any) => {
    if (!leaveToEdit) return;

    const updatedLeaveTypes = leaveTypesList.map(leave => {
      if (leave.id === leaveToEdit.id) {
        return {
          ...leave,
          name: data.leaveName,
          shortCode: data.shortCode,
          color: data.color,
          maxDays: parseInt(data.totalDaysYear) || 20,
          carryForward: data.yearEndRules?.find((r: any) => r.id === 'carry-forward')?.value || 0,
          description: data.description,
          policies: data.consumptionRules?.map((r: any) => `${r.label}: ${r.value ? r.value + ' ' + (r.unit || '') : 'Enabled'}`) || [],
          creditType: data.creditType,
          totalDaysYear: parseInt(data.totalDaysYear),
          creditDate: data.creditDate,
          customCreditDate: data.customCreditDate,
          creditRules: data.creditRules,
          yearEndRules: data.yearEndRules,
          consumptionRules: data.consumptionRules,
        };
      }
      return leave;
    });

    setLeaveTypesList(updatedLeaveTypes);
    setSelectedLeaveType(updatedLeaveTypes.find(l => l.id === leaveToEdit.id) || null);
    setIsEditLeaveOpen(false);
    setLeaveToEdit(null);
    console.log('Leave type updated:', data);
  };

  const handleDeleteLeave = (leaveId: string) => {
    const updatedLeaveTypes = leaveTypesList.filter(leave => leave.id !== leaveId);
    setLeaveTypesList(updatedLeaveTypes);
    setSelectedLeaveType(null);
  };

  const openActivateDialog = (leave: LeaveType) => {
    setLeaveToActivate(leave);
    setIsActivateLeaveOpen(true);
  };

  return (
    <>
      <Header title="Leave Management" subtitle="Review and manage employee leave applications and policies" />

      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="lg:col-span-1 border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Leave Types</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">Manage leave categories</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsCreateLeaveOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {leaveTypesList.map((leave: LeaveType) => {
                  const colors = getColorClasses(leave.color);
                  const isSelected = selectedLeaveType?.id === leave.id;
                  return (
                    <button
                      key={leave.id}
                      onClick={() => setSelectedLeaveType(leave)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${colors.bg} border-blue-500 ${colors.text}`
                          : `border-gray-200 hover:border-blue-300 hover:bg-gray-50`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-xs sm:text-sm truncate">{leave.name}</p>
                            {!leave.isActive && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                                Inactive
                              </span>
                            )}
                            {leave.isActive && (
                              <span className="text-xs bg-green-200 text-green-700 px-1.5 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{leave.maxDays} days/year</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {selectedLeaveType && (
              <Card className="lg:col-span-2 border border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getColorClasses(selectedLeaveType.color).bg} ${getColorClasses(selectedLeaveType.color).text}`}>
                          {selectedLeaveType.shortCode}
                        </div>
                        <CardTitle className="text-lg sm:text-2xl">{selectedLeaveType.name}</CardTitle>
                        {!selectedLeaveType.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                        {selectedLeaveType.isActive && (
                          <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs sm:text-sm mt-1">
                        {selectedLeaveType.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!selectedLeaveType.isActive && (
                        <Button 
                          size="sm" 
                          onClick={() => openActivateDialog(selectedLeaveType)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Power className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      {selectedLeaveType.isActive && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeactivateLeave(selectedLeaveType.id)}
                          className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
                        >
                          <EyeOff className="h-4 w-4 mr-1" />
                          Deactivate
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleEditLeave(selectedLeaveType)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setConfirmModal(true)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Max Days/Year</p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">{selectedLeaveType.maxDays}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Carry Forward</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">{selectedLeaveType.carryForward}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Approval</p>
                      <p className="text-lg font-bold text-purple-600">
                        {selectedLeaveType.requiresApproval ? 'Required' : 'Auto'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-lg border border-yellow-200">
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <p className="text-lg font-bold text-yellow-600">
                        {selectedLeaveType.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {selectedLeaveType.isActive && selectedLeaveType.applicableEmployees && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Applicable To</h3>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          {selectedLeaveType.applicableEmployees === 'all' && (
                            <p className="text-sm text-gray-700">All Employees</p>
                          )}
                          {selectedLeaveType.applicableEmployees === 'selected' && (
                            <p className="text-sm text-gray-700">
                              {selectedLeaveType.employeeIds?.length || 0} Selected Employees
                            </p>
                          )}
                          {selectedLeaveType.applicableEmployees === 'roles' && (
                            <p className="text-sm text-gray-700">
                              {selectedLeaveType.roleIds?.length || 0} Roles
                            </p>
                          )}
                        </div>
                        {selectedLeaveType.effectiveFrom && (
                          <p className="text-xs text-gray-500">
                            Effective from: {new Date(selectedLeaveType.effectiveFrom).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">Policies & Rules</h3>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
                      {selectedLeaveType.policies.map((policy, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold text-blue-700">
                            {idx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 flex-1 pt-0.5">{policy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CreateLeaveDialog
        isOpen={isCreateLeaveOpen}
        onClose={() => setIsCreateLeaveOpen(false)}
        onSubmit={handleCreateLeave}
      />

      <EditLeaveDialog 
        isOpen={isEditLeaveOpen}
        onClose={() => {
          setIsEditLeaveOpen(false);
          setLeaveToEdit(null);
        }}
        onSubmit={handleUpdateLeave}
        currentLeave={leaveToEdit || {
          id: '',
          name: '',
          shortCode: '',
          color: 'blue',
          maxDays: 0,
          carryForward: 0,
          requiresApproval: false,
          description: '',
          policies: [],
          isActive: false,
        }}
      />

      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => {setConfirmModal(false)}}
        onConfirm={() => handleDeleteLeave(selectedLeaveType?.id || '')}
        title="Delete Leave Type"
        description="Are you sure you want to delete this leave type? This action cannot be undone."
        type='danger'
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ActivateLeaveDialog
        isOpen={isActivateLeaveOpen}
        onClose={() => {
          setIsActivateLeaveOpen(false);
          setLeaveToActivate(null);
        }}
        onSubmit={handleActivateLeave}
        leaveType={leaveToActivate}
      />
    </>
  );
}