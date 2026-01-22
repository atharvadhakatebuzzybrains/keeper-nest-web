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
<div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);">
    <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
      <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">Password Reset Request</h1>
    </div>

    <div style="padding: 30px 25px; text-align: left;">
      <p style="font-size: 16px; color: #333;">Hi there,</p>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        We received a request to reset your KeeperNest account password. 
        Use the verification code below to complete the process.
      </p>

      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 25px 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #0369a1; font-size: 14px;">YOUR VERIFICATION CODE</p>
        <div style="background:#ffffff;border:2px dashed #3b82f6;border-radius:8px;padding:15px;display:inline-block;margin:10px 0;">
          <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:10px;color:#000 !important;">
            ${generatedOtp} <!-- Use the local variable here -->
          </h1>
        </div>
        <p style="font-size:16px;color:#000;">
          <strong>Your OTP code is: ${generatedOtp}</strong>
        </p>
        <p style="margin: 10px 0 0 0; color: #64748b; font-size: 13px;">
          This code will expire in <strong>10 minutes</strong>
        </p>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
          <strong>Important:</strong> 
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>Enter this code in the KeeperNest mobile app to verify your identity</li>
            <li>This code is valid for 10 minutes only</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </p>
      </div>

      <p style="color: #444; font-size: 15px; line-height: 1.6;">
        If you're having trouble or didn't request a password reset, please contact our support team immediately.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #333; font-size: 15px;">
        Stay secure,<br>
        <strong>The KeeperNest Security Team</strong>
      </p>
    </div>

    <div style="background: #f9fafb; padding: 15px; border-top: 1px solid #e5e7eb;">
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
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12"
                                    />
                                </div>

                                <Button
                                    className="w-full h-12 mt-4"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            Send Verification Code
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
                                    <Label>Verification Code</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="h-12 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                    />
                                    <p className="text-sm text-muted-foreground text-center">
                                        Didn't receive code? <button className="text-primary hover:underline" onClick={() => handleSendOtp()}>Resend</button>
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                        onClick={() => setStep(1)}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        className="flex-1 h-12"
                                        onClick={() => handleVerifyOtp()}
                                        disabled={loading}

                                    >
                                        {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying Code...
                                        </>
                                    ) : (
                                        <>
                                            Verify
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
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                        onClick={() => setStep(2)}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        className="flex-1 h-12"
                                        onClick={() => handleChangePassword()}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
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