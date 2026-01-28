import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Mail, Key, Lock, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { account, databases } from "../../appwrite/config";
import { Query } from "appwrite";
import { Snackbar, useNotification } from "../Alerts";
import { decrypt, encrypt } from "../../appwrite/encrypt_decrypt_password";
import { sendMail } from "../../server/emailSender";

interface ForgotPasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { snackbar, showSnackbar, closeSnackbar } = useNotification();
    const [loading, setLoading] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");

    const otp_generator = () => {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    };

    const handleSendOtp = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await databases.listDocuments('user_info', 'user_info', [Query.equal("email", email)]);
            if (res.documents.length === 0) {
                showSnackbar("Email not found", "error");
                return;
            }
            const generatedOtp = otp_generator();
            setGeneratedOtp(generatedOtp);
            console.log("Generated OTP:", generatedOtp);

            await sendMail({
                to: email,
                subject: `KeeperNest — Password Reset Verification Code`,
                html: `
<style>
  @media (max-width: 600px) {
    .email-container { padding: 20px !important; }
    .email-wrapper { margin: 0 !important; }
    .header { padding: 20px 16px !important; }
    .header h1 { font-size: 20px !important; }
    .body { padding: 20px 16px !important; }
    .body p { font-size: 14px !important; }
    .otp-box { padding: 20px 16px !important; margin: 20px 0 !important; }
    .otp-code { font-size: 18px !important; letter-spacing: 8px !important; }
    .otp-text { font-size: 14px !important; }
    .warning-box { padding: 12px 14px !important; margin: 16px 0 !important; font-size: 12px !important; }
    .warning-box ul { font-size: 12px !important; }
    .signature { font-size: 14px !important; }
    .footer { padding: 12px 16px !important; }
    .footer p { font-size: 10px !important; }
  }
</style>
<div class="email-container" style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
  <div class="email-wrapper" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);">
    <div class="header" style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
      <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">Password Reset Request</h1>
    </div>

    <div class="body" style="padding: 30px 25px; text-align: left;">
      <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">Hi there,</p>
      <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
        We received a request to reset your KeeperNest account password. 
        Use the verification code below to complete the process.
      </p>

      <div class="otp-box" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 25px 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #0369a1; font-size: 14px;">YOUR VERIFICATION CODE</p>
        
        <p class="otp-text" style="font-size:16px; color:#000; margin: 10px 0;">
          <strong>Your OTP code is: ${generatedOtp}</strong>
        </p>
        <p style="margin: 10px 0 0 0; color: #64748b; font-size: 13px;">
          This code will expire in <strong>10 minutes</strong>
        </p>
      </div>

      <div class="warning-box" style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 500;">
          <strong>Important:</strong> 
        </p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #92400e; font-size: 14px;">
          <li style="margin: 6px 0;">Enter this code in the KeeperNest mobile app to verify your identity</li>
          <li style="margin: 6px 0;">This code is valid for 10 minutes only</li>
          <li style="margin: 6px 0;">If you didn't request this, please ignore this email</li>
        </ul>
      </div>

      <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
        If you're having trouble or didn't request a password reset, please contact our support team immediately.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p class="signature" style="color: #333; font-size: 15px;">
        Stay secure,<br>
        <strong>The KeeperNest Security Team</strong>
      </p>
    </div>

    <div class="footer" style="background: #f9fafb; padding: 15px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
        This is an automated message. Please do not reply to this email.
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 0;">
        © ${new Date().getFullYear()} KeeperNest. All rights reserved.<br>
        KeeperNest, 123 Security Lane, Digital City
      </p>
    </div>
  </div>
</div>
`,
            });

            setStep(2);
        } catch (error) {
            console.error("Error sending OTP:", error);
            setStep(1);
        }finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = () => {
        setLoading(true);
        if (otp === generatedOtp) {
            setStep(3);
        } else {
            showSnackbar("Invalid OTP. Please try again.", "error");
        }
        setLoading(false);
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            showSnackbar("Passwords do not match", "error");
            return;
        }
        setLoading(true);

        try {
            let session;
            const res = await databases.listDocuments('user_info', 'user_info', [Query.equal("email", email)]);
            if (res.documents.length === 0) {
                showSnackbar("Email not found", "error");
                return;
            }

            const currentPassword: string = decrypt(res.documents[0].password);

            try {
                session = await account.createEmailPasswordSession(email, currentPassword);
                console.log("Session created successfully");
            } catch (sessionError: any) {
                console.log("Session creation failed:", sessionError.message);
                showSnackbar("Error creating session for password reset", "error");
                return;
            }

            await account.updatePassword(newPassword, currentPassword);

            await databases.updateDocument('user_info', 'user_info', res.documents[0].$id, {
                password: encrypt(newPassword),
            });
            showSnackbar("Password reset successfully", "success");
            onOpenChange(false);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error resetting password:", error);
            showSnackbar("Error resetting password", "error");
        }finally {
            setLoading(false);
        }
    }

    const handleResetPassword = () => {
        if (newPassword !== confirmPassword) {
            showSnackbar("Passwords do not match", "error");
            return;
        }
        
        showSnackbar("Password reset successfully", "success");
        onOpenChange(false);
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
    }


    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) {
                setStep(1);
                setEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setGeneratedOtp("");
                setLoading(false);
            }
            onOpenChange(newOpen);
        }}>
            <DialogContent className="w-[calc(100%-32px)] max-w-md mx-auto p-0 sm:p-6 my-4 sm:my-0">

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <Card className="border-0 shadow-none mx-4 sm:mx-0">
                        <CardContent className="p-6 sm:p-0 space-y-6">
                            <div className="flex flex-col items-center space-y-2 mb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Enter your email</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    We'll send you a verification code to reset your password
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-10 sm:h-12 text-sm sm:text-base"
                                    />
                                </div>

                                <Button
                                    className="w-full h-10 sm:h-12 text-sm sm:text-base mt-4"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span className="hidden sm:inline">Sending Code...</span>
                                            <span className="sm:hidden">Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Send Verification Code</span>
                                            <span className="sm:hidden">Send Code</span>
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <Card className="border-0 shadow-none mx-4 sm:mx-0">
                        <CardContent className="p-6 sm:p-0 space-y-6">
                            <div className="flex flex-col items-center space-y-2 mb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Key className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Enter Verification Code</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Enter the 6-digit code sent to {email}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm sm:text-base">Verification Code</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="h-10 sm:h-12 text-center tracking-widest font-bold"
                                        maxLength={6}
                                    />
                                    <p className="text-xs sm:text-sm text-muted-foreground text-center">
                                        Didn't receive code? <button className="text-primary hover:underline" onClick={() => handleSendOtp()}>Resend</button>
                                    </p>
                                </div>

                                <div className="flex gap-2 sm:gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                                        onClick={() => setStep(1)}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Back</span>
                                    </Button>
                                    <Button
                                        className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                                        onClick={() => handleVerifyOtp()}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span className="hidden sm:inline">Verifying...</span>
                                            <span className="sm:hidden">Verify...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Verify</span>
                                            <span className="sm:hidden">Verify</span>
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <Card className="border-0 shadow-none mx-4 sm:mx-0">
                        <CardContent className="p-6 sm:p-0 space-y-6">
                            <div className="flex flex-col items-center space-y-2 mb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Set New Password</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Create a new password for your account
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword" className="text-sm sm:text-base">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-10 sm:h-12 text-sm sm:text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-10 sm:h-12 text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 sm:gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                                        onClick={() => setStep(2)}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Back</span>
                                    </Button>
                                    <Button
                                        className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                                        onClick={() => handleChangePassword()}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span className="hidden sm:inline">Resetting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Reset Password</span>
                                            <span className="sm:hidden">Reset</span>
                                        </>
                                    )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
}