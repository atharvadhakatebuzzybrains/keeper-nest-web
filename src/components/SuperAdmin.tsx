import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { databases, functions, SUPER_ADMIN } from '../appwrite/config';
import { Snackbar, useNotification } from './Alerts';
import { sendMail } from '../server/emailSender';

export default function SuperAdmin() {
    const { employeeId } = useParams<{ employeeId: string }>()
    const navigate = useNavigate();
    const { snackbar, showSnackbar, closeSnackbar } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [actionType, setActionType] = useState<'reject' | 'accept' | null>(null);

    const handleReject = async () => {
        if (!employeeId) return;

        setIsLoading(true);
        setActionType('reject');

        try {
            const execution = await functions.createExecution(
                "delete-user",
                JSON.stringify({
                    userId: employeeId,
                    documentId: employeeId
                })
            );

            await databases.deleteDocument('user_info', 'user_info', employeeId);

            await sendMail({
                to: SUPER_ADMIN,
                subject: 'Admin Request Rejected',
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Admin Request Rejected</h2>
                    <p>Admin request for Employee ID <strong>${employeeId}</strong> has been rejected.</p>
                    <p>The user account has been removed from the system.</p>
                  </div>
                `
            });

            showSnackbar(`Rejection successful`, 'success');
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.log("Super admin: ", err);
            showSnackbar(`Rejection failed`, 'error');
        } finally {
            setIsLoading(false);
            setActionType(null);
        }
    }

    const handleApprove = async () => {
        if (!employeeId) return;

        setIsLoading(true);
        setActionType('accept');

        try {
            await databases.updateDocument('user_info', 'user_info', employeeId, {
                status: 'active',
            });

            await sendMail({
                to: SUPER_ADMIN,
                subject: 'Admin Request Approved',
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Admin Request Approved</h2>
                    <p>Admin request for Employee ID <strong>${employeeId}</strong> has been approved.</p>
                    <p>The user now has admin privileges.</p>
                  </div>
                `
            });

            showSnackbar(`Acceptance successful`, 'success');
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.log("Super Admin error: ", err);
            showSnackbar(`Acceptance failed`, 'error');
        } finally {
            setIsLoading(false);
            setActionType(null);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Verification - {employeeId}</h1>
                        <p className="text-gray-600">Review and verify the admin registration</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleReject}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && actionType === 'reject' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reject
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && actionType === 'accept' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Accept
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                isOpen={snackbar.isOpen}
                onClose={closeSnackbar}
                message={snackbar.message}
                type={snackbar.type}
                duration={4000}
            />
        </div>
    )
}