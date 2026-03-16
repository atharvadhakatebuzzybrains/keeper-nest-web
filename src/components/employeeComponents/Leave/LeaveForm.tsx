import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../ui/card";
import { CalendarDays, Clock, Users, FileText } from "lucide-react";
import Header from '../../Header';
import DynamicTable from '../../DyanamicTable';
import CustomDropdown from '../../CustomDropdown';
import { databases } from "../../../appwrite/config";
import { useEffect, useState } from "react";
import ApplyLeaveDialog from './ApplyLeaveDialog';
import type { LeaveFormData } from './ApplyLeaveDialog';
import { useNavigate } from "react-router-dom";

export default function LeaveForm() {
    const [isApplyLeaveDialogOpen, setIsApplyLeaveDialogOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('Apr');
    const navigate = useNavigate();

    const monthData = async () => {
        const response = await databases.listDocuments(
            'user_info',
            'leave-management',
        );
        console.log('Leave management data:', response);
    }
    useEffect(() => {
        monthData();
    }, []);

    const handleApplyLeaveSubmit = (formData: LeaveFormData) => {
        console.log('Leave application submitted:', formData);
        alert(`Leave request submitted!\n\nDetails:\n- Type: ${formData.leaveType}\n- Date: ${formData.date}\n- First Half: ${formData.firstHalf}\n- Second Half: ${formData.secondHalf}\n- Reason: ${formData.reason || 'N/A'}`);
    };

    const accrualData = [
        { month: 'Apr', credited: '0.00', applied: '0.00', penalty: '-', closing: '-' },
        { month: 'May', credited: '0.00', applied: '0.00', penalty: '-', closing: '-' },
        { month: 'Jun', credited: '0.00', applied: '0.00', penalty: '-', closing: '-' },
        { month: 'Jul', credited: '0.00', applied: '0.00', penalty: '-', closing: '-' },
        { month: 'Aug', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Sep', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Oct', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Nov', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Dec', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Jan', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Feb', credited: '-', applied: '-', penalty: '-', closing: '-' },
        { month: 'Mar', credited: '3.50', applied: '0.00', penalty: '-', closing: '-' },
    ];

    return (
        <>
            <Header title="Leave Management" subtitle="View your leave balance, history, and apply for new leaves" />
            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="container mx-auto max-w-7xl px-2 sm:px-4">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        {/* Main Balance Card */}
                        <Card className="md:col-span-2 border border-blue-100 bg-white shadow-sm">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                    <span className="truncate">Earned Leave</span>
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Your leave summary and balance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                    <div className="bg-blue-50 p-2 sm:p-3 md:p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 truncate">Credited Leaves</p>
                                        <p className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mt-1">6.5</p>
                                    </div>
                                    <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 truncate">Total Leaves</p>
                                        <p className="text-base sm:text-lg md:text-xl font-semibold text-green-700 mt-1">6</p>
                                    </div>
                                    <div className="bg-yellow-50 p-2 sm:p-3 md:p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 truncate">Applied Leaves</p>
                                        <p className="text-base sm:text-lg md:text-xl font-semibold text-yellow-700 mt-1">4.5</p>
                                    </div>
                                    <div className="bg-red-50 p-2 sm:p-3 md:p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 truncate">Payroll Deduction</p>
                                        <p className="text-base sm:text-lg md:text-xl font-semibold text-red-700 mt-1">0.00</p>
                                    </div>
                                </div>

                                <div className="border-t pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm sm:text-base text-gray-600">Leave Balance</span>
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">2.00</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-blue-100 bg-white shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 sm:space-y-3">
                                <button
                                    onClick={() => setIsApplyLeaveDialogOpen(true)}
                                    className="w-full p-2 sm:p-3 text-left text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                                >
                                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                    <span className="font-medium truncate">Apply for Leave</span>
                                </button>
                                <button className="w-full p-2 sm:p-3 text-left text-xs sm:text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2 sm:gap-3" onClick={() => navigate('leaveLogs')}>
                                    <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="font-medium truncate">Leave Logs</span>
                                </button>
                                <button className="w-full p-2 sm:p-3 text-left text-xs sm:text-sm bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-2 sm:gap-3">
                                    <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                    <span className="font-medium truncate">Rules & Policy</span>
                                </button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border border-blue-100 bg-white shadow-sm mb-6">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="text-lg sm:text-xl">Accrual History</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Monthly breakdown of leave accruals</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                                    Select Month
                                </label>
                                <CustomDropdown
                                    options={accrualData.map(item => ({
                                        value: item.month,
                                        label: item.month,
                                        ...item
                                    }))}
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    placeholder="Select a month"
                                />
                            </div>

                            {accrualData.find(item => item.month === selectedMonth) && (
                                <div className="border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 mb-3 sm:mb-4">
                                        {selectedMonth} - Leave Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-200">
                                            <p className="text-xs text-gray-600 mb-1 truncate">Credited Leaves</p>
                                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 truncate">
                                                {accrualData.find(item => item.month === selectedMonth)?.credited}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                                            <p className="text-xs text-gray-600 mb-1 truncate">Applied Leaves</p>
                                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 truncate">
                                                {accrualData.find(item => item.month === selectedMonth)?.applied}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
                                            <p className="text-xs text-gray-600 mb-1 truncate">Penalty Deduction</p>
                                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 truncate">
                                                {accrualData.find(item => item.month === selectedMonth)?.penalty}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-purple-200">
                                            <p className="text-xs text-gray-600 mb-1 truncate">Closing Balance</p>
                                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 truncate">
                                                {accrualData.find(item => item.month === selectedMonth)?.closing}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <ApplyLeaveDialog
                isOpen={isApplyLeaveDialogOpen}
                onClose={() => setIsApplyLeaveDialogOpen(false)}
                onSubmit={handleApplyLeaveSubmit}
            />
        </>
    );
}