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
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import CustomDropdown from '../../CustomDropdown';
import { Settings, ToggleRight } from 'lucide-react';

interface CreateLeaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface ToggleItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  value?: string | number;
  unit?: string;
  isUnlimited?: boolean; // For rules that can be unlimited
  hasUnlimitedOption?: boolean; // Indicates if rule supports unlimited option
}

export default function CreateLeaveDialog({ isOpen, onClose, onSubmit }: CreateLeaveDialogProps) {
  const [formData, setFormData] = useState({
    leaveName: '',
    shortCode: '',
    color: 'blue',
    creditType: 'yearly' as 'yearly' | 'monthly-accrual' | 'not-applicable',
    totalDaysYear: '',
    creditDate: 'january-1st',
    customCreditDate: '',
    description: '',
  });

  const [creditRules, setCreditRules] = useState<ToggleItem[]>([
    { id: 'block-probation', label: 'Block During Probation', description: 'No leaves allowed during probation period', enabled: false },
  ]);

  const [yearEndRules, setYearEndRules] = useState<ToggleItem[]>([
    { id: 'carry-forward', label: 'Carry Forward', description: 'Unused leaves roll over to next year', enabled: true, value: 5, unit: 'days' },
    { id: 'encashment', label: 'Encashment', description: 'Convert unused leaves to salary payout', enabled: false },
  ]);

  const [consumptionRules, setConsumptionRules] = useState<ToggleItem[]>([
    { id: 'max-days-app', label: 'Max Days Per Application', description: 'Single leave request limit', enabled: true, value: 5, unit: 'days', hasUnlimitedOption: true, isUnlimited: false },
    { id: 'max-days-month', label: 'Max Days Per Month', description: 'Monthly usage cap', enabled: true, value: 10, unit: 'days', hasUnlimitedOption: true, isUnlimited: false },
    { id: 'max-consecutive', label: 'Max Consecutive Days', description: 'Back-to-back leave limit', enabled: false, value: 7, unit: 'days', hasUnlimitedOption: true, isUnlimited: false },
    { id: 'min-gap', label: 'Minimum Gap Between Leaves', description: 'Required rest between applications', enabled: false, value: 2, unit: 'days', hasUnlimitedOption: false },
    { id: 'notice-period', label: 'Notice Period', description: 'Advance days required before applying', enabled: true, value: 1, unit: 'days', hasUnlimitedOption: false },
    { id: 'backdated', label: 'Allow Backdated Leave', description: 'Apply for past dates', enabled: false },
    { id: 'half-day', label: 'Half Day Allowed', description: 'First half / second half sessions', enabled: true },
    { id: 'count-weekends', label: 'Count Weekends', description: 'Saturday & Sunday counted in leave days', enabled: false },
    { id: 'count-holidays', label: 'Count Holidays', description: 'Public holidays counted in leave days', enabled: false },
  ]);
  const toggleItem = (list: ToggleItem[], id: string, setter: any) => {
    setter(list.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const updateValue = (list: ToggleItem[], id: string, value: string | number, setter: any) => {
    setter(list.map(item => item.id === id ? { ...item, value } : item));
  };

  const toggleUnlimited = (list: ToggleItem[], id: string, setter: any) => {
    setter(list.map(item => item.id === id ? { ...item, isUnlimited: !item.isUnlimited } : item));
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      creditRules: creditRules.filter((r: ToggleItem) => r.enabled),
      yearEndRules: yearEndRules.filter((r: ToggleItem) => r.enabled),
      consumptionRules: consumptionRules.filter((r: ToggleItem) => r.enabled),
    };
    onSubmit(payload);
    
    // Reset all form data
    setFormData({
      leaveName: '',
      shortCode: '',
      color: 'blue',
      creditType: 'yearly' as 'yearly' | 'monthly-accrual' | 'not-applicable',
      totalDaysYear: '',
      creditDate: 'january-1st',
      customCreditDate: '',
      description: '',
    });

    // Reset all rules to default
    setCreditRules([
      { id: 'block-probation', label: 'Block During Probation', description: 'No leaves allowed during probation period', enabled: false },
    ]);

    setYearEndRules([
      { id: 'carry-forward', label: 'Carry Forward', description: 'Unused leaves roll over to next year', enabled: true, value: 5, unit: 'days' },
      { id: 'encashment', label: 'Encashment', description: 'Convert unused leaves to salary payout', enabled: false },
    ]);

    setConsumptionRules([
      { id: 'max-days-app', label: 'Max Days Per Application', description: 'Single leave request limit', enabled: true, value: 5, unit: 'days', hasUnlimitedOption: true, isUnlimited: false },
      { id: 'max-days-month', label: 'Max Days Per Month', description: 'Monthly usage cap', enabled: true, value: 10, unit: 'days', hasUnlimitedOption: true, isUnlimited: false },
      { id: 'max-consecutive', label: 'Max Consecutive Days', description: 'Back-to-back leave limit', enabled: false, value: 7, unit: 'days', hasUnlimitedOption: true, isUnlimited: false },
      { id: 'min-gap', label: 'Minimum Gap Between Leaves', description: 'Required rest between applications', enabled: false, value: 2, unit: 'days', hasUnlimitedOption: false },
      { id: 'notice-period', label: 'Notice Period', description: 'Advance days required before applying', enabled: true, value: 1, unit: 'days', hasUnlimitedOption: false },
      { id: 'backdated', label: 'Allow Backdated Leave', description: 'Apply for past dates', enabled: false },
      { id: 'half-day', label: 'Half Day Allowed', description: 'First half / second half sessions', enabled: true },
      { id: 'count-weekends', label: 'Count Weekends', description: 'Saturday & Sunday counted in leave days', enabled: false },
      { id: 'count-holidays', label: 'Count Holidays', description: 'Public holidays counted in leave days', enabled: false },
    ]);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl">Create Leave Type</DialogTitle>
          <DialogDescription>
            Configure leave type with credit rules, consumption rules, and special policies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Leave Name</Label>
                <Input
                  placeholder="e.g., Earned Leave"
                  value={formData.leaveName}
                  onChange={(e) => setFormData({ ...formData, leaveName: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Short Code</Label>
                <Input
                  placeholder="e.g., EL"
                  maxLength={3}
                  value={formData.shortCode}
                  onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <CustomDropdown
                  options={[
                    { value: 'blue', label: 'Blue' },
                    { value: 'red', label: 'Red' },
                    { value: 'green', label: 'Green' },
                    { value: 'yellow', label: 'Yellow' },
                    { value: 'purple', label: 'Purple' },
                  ]}
                  value={formData.color}
                  onChange={(value) => setFormData({ ...formData, color: value })}
                  isSearchable={false}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  placeholder="Brief description of this leave type"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white resize-none min-h-24"
                />
              </div>
            </div>
          </div>

          {/* Credit Rules */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              CREDIT RULES
            </h3>
            
            <div className="space-y-4">
              {/* Credit Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Label className="text-sm text-gray-700 col-span-full">Credit Type</Label>
                {(['yearly', 'monthly-accrual', 'not-applicable'] as const).map((type: 'yearly' | 'monthly-accrual' | 'not-applicable') => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, creditType: type })}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                      formData.creditType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type === 'yearly' ? 'Yearly' : type === 'monthly-accrual' ? 'Monthly Accrual' : 'Not Applicable'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Total Days / Year</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="e.g., 18"
                      value={formData.totalDaysYear}
                      onChange={(e) => setFormData({ ...formData, totalDaysYear: e.target.value })}
                      className="bg-white border-gray-300"
                    />
                    <span className="flex items-center text-gray-500">days</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Credit Date</Label>
                  <CustomDropdown
                    options={[
                      { value: 'january-1st', label: 'January 1st (Calendar Year)' },
                      { value: 'april-1st', label: 'April 1st (Financial Year)' },
                      { value: 'custom', label: 'Custom Date' },
                    ]}
                    value={formData.creditDate}
                    onChange={(value) => setFormData({ ...formData, creditDate: value })}
                    isSearchable={false}
                  />
                </div>

                {formData.creditDate === 'custom' && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm text-gray-700">Select Custom Date (Month & Day)</Label>
                    <Input
                      type="date"
                      value={formData.customCreditDate}
                      onChange={(e) => setFormData({ ...formData, customCreditDate: e.target.value })}
                      className="bg-white border-gray-300"
                    />
                    <p className="text-xs text-gray-500">Choose the date when leaves will be credited annually</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                {creditRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{rule.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleItem(creditRules, rule.id, setCreditRules)}
                        className="ml-4 flex-shrink-0 mt-0.5"
                      >
                        <ToggleRight
                          className={`h-6 w-6 transition-colors ${
                            rule.enabled ? 'text-green-600' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {rule.enabled && rule.value !== undefined && (
                      <div className="mt-3 flex gap-2 items-end">
                        <div className="flex-1">
                          <Label className="text-xs font-medium text-gray-600 block mb-1">Value</Label>
                          <Input
                            type="number"
                            value={rule.value}
                            onChange={(e) => updateValue(creditRules, rule.id, parseInt(e.target.value) || 0, setCreditRules)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white h-8 text-sm"
                            min="0"
                          />
                        </div>
                        {rule.unit && (
                          <span className="text-xs font-medium text-gray-600 pb-1.5">{rule.unit}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              YEAR-END RULES
            </h3>
            <div className="space-y-3">
              {yearEndRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{rule.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleItem(yearEndRules, rule.id, setYearEndRules)}
                      className="ml-4 flex-shrink-0 mt-0.5"
                    >
                      <ToggleRight
                        className={`h-6 w-6 transition-colors ${
                          rule.enabled ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {rule.enabled && rule.value !== undefined && (
                    <div className="mt-3 flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs font-medium text-gray-600 block mb-1">Max Days</Label>
                        <Input
                          type="number"
                          value={rule.value}
                          onChange={(e) => updateValue(yearEndRules, rule.id, parseInt(e.target.value) || 0, setYearEndRules)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white h-8 text-sm"
                          min="0"
                        />
                      </div>
                      {rule.unit && (
                        <span className="text-xs font-medium text-gray-600 pb-1.5">{rule.unit}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              CONSUMPTION RULES
            </h3>
            <div className="space-y-3">
              {consumptionRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{rule.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleItem(consumptionRules, rule.id, setConsumptionRules)}
                      className="ml-4 flex-shrink-0 mt-0.5"
                    >
                      <ToggleRight
                        className={`h-6 w-6 transition-colors ${
                          rule.enabled ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {rule.enabled && rule.value !== undefined && (
                    <div className="mt-3 space-y-3">
                      {/* Unlimited Toggle Option */}
                      {rule.hasUnlimitedOption && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleUnlimited(consumptionRules, rule.id, setConsumptionRules)}
                            className="flex items-center gap-2"
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              rule.isUnlimited 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'border-gray-300 hover:border-blue-400'
                            }`}>
                              {rule.isUnlimited && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-gray-600">Unlimited</span>
                          </button>
                        </div>
                      )}

                      {!rule.isUnlimited && (
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label className="text-xs font-medium text-gray-600 block mb-1">Value</Label>
                            <Input
                              type="number"
                              value={rule.value}
                              onChange={(e) => updateValue(consumptionRules, rule.id, parseInt(e.target.value) || 0, setConsumptionRules)}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white h-8 text-sm"
                              min="0"
                            />
                          </div>
                          {rule.unit && (
                            <span className="text-xs font-medium text-gray-600 pb-1.5">{rule.unit}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Create Leave Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}