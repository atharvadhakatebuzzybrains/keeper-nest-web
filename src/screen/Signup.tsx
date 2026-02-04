import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { User, Mail, Lock, Briefcase, UserCircle, Users, Eye, EyeOff, AlertCircle, CheckCircle, XCircle, Loader2, X } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendMail } from "../server/emailSender";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form"
import { Snackbar, useNotification } from "../components/Alerts"
import { account, databases } from "../appwrite/config"
import { encrypt } from '../appwrite/encrypt_decrypt_password'
import { SUPER_ADMIN } from "../appwrite/config"

const signupSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  email: z.string()
    .email("Please enter a valid email address"),
  employeeId: z.string()
    .min(3, "Employee ID must be at least 3 characters")
    .max(20, "Employee ID is too long"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  gender: z.string()
    .min(1, "Please select your gender"),
  role: z.string()
    .min(1, "Please select your role")
})

type SignupFormValues = z.infer<typeof signupSchema>

type EmailVerificationStatus = 'idle' | 'checking' | 'pending' | 'valid' | 'invalid'

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<EmailVerificationStatus>('idle');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const { snackbar, showSnackbar, closeSnackbar } = useNotification();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      employeeId: "",
      password: "",
      gender: "",
      role: "",
    },
    mode: "onChange",
  })

  const otp_generator = () => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  };

  const verifyEmail = async () => {
    const email = form.getValues("email");

    try {
      signupSchema.shape.email.parse(email);
    } catch {
      form.setError("email", {
        type: "manual",
        message: "Please enter a valid email address"
      });
      setEmailVerificationStatus('invalid');
      return;
    }

    setIsVerifyingEmail(true);
    setEmailVerificationStatus('checking');

    try {
      const generatedOtp = otp_generator();
      setOtp(generatedOtp);
      console.log("The otp is: ", generatedOtp);

      await sendMail({
        to: email,
        subject: `KeeperNest — Email Verification Code`,
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
    .otp-text { font-size: 14px !important; }
    .footer { padding: 12px 16px !important; }
    .footer p { font-size: 10px !important; }
  }
</style>
<div class="email-container" style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
  <div class="email-wrapper" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);">
    <div class="header" style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
      <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">Verify Your Email</h1>
    </div>

    <div class="body" style="padding: 30px 25px; text-align: center;">
      <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
        Use the verification code below to verify your email address.
      </p>

      <div class="otp-box" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 25px 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p class="otp-text" style="font-size:16px; color:#000; margin: 10px 0;">
          <strong>${generatedOtp}</strong>
        </p>
        <p style="margin: 10px 0 0 0; color: #64748b; font-size: 13px;">
          Expires in 10 minutes
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
        If you didn't request this, please ignore this email.
      </p>
    </div>

    <div class="footer" style="background: #f9fafb; padding: 15px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
        KeeperNest Email Verification
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 0;">
        © ${new Date().getFullYear()} KeeperNest
      </p>
    </div>
  </div>
</div>
`,
      });

      setEmailVerificationStatus('pending');
      setOtpModal(true);
      showSnackbar("Verification code sent to your email!", 'success');
      form.clearErrors("email");

    } catch (error) {
      console.error("Error sending verification email:", error);
      setEmailVerificationStatus('invalid');
      form.setError("email", {
        type: "manual",
        message: "Failed to send verification email"
      });
      showSnackbar("Failed to send verification email. Please try again.", 'error');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const verifyOtp = () => {
    setIsVerifyingOtp(true);
    setOtpError('');

    // Simulate API call delay
    setTimeout(() => {
      if (userEnteredOtp === otp) {
        setEmailVerificationStatus('valid');
        setOtpModal(false);
        showSnackbar("Email verified successfully!", 'success');
      } else {
        setOtpError('Invalid verification code. Please try again.');
      }
      setIsVerifyingOtp(false);
    }, 1000);
  };

  const resendOtp = async () => {
    const email = form.getValues("email");
    const generatedOtp = otp_generator();
    setOtp(generatedOtp);

    try {
      await sendMail({
        to: email,
        subject: `KeeperNest — Email Verification Code`,
        html: `... same email template with ${generatedOtp} ...`,
      });

      showSnackbar("New verification code sent!", 'success');
      setUserEnteredOtp('');
      setOtpError('');
    } catch (error) {
      showSnackbar("Failed to resend verification code", 'error');
    }
  };

  async function onSubmit(values: SignupFormValues) {
    if (emailVerificationStatus !== 'valid') {
      showSnackbar("Please verify your email before submitting", 'warning');
      return;
    }

    setSubmitError("");
    setIsLoading(true);

    try {
      try {
        const currentUser = await account.get();
        if (currentUser) {
          await account.deleteSession('current');
        }
      } catch { }

      await account.create(values.employeeId, values.email, values.password, values.fullName);

      const dbId = "user_info";
      const collectionId = "user_info";



      if (values.role === 'admin') {
        try {
          await databases.createDocument(
            dbId,
            collectionId,
            values.employeeId,
            {
              employeeId: values.employeeId,
              password: encrypt(values.password),
              name: values.fullName,
              email: values.email,
              gender: values.gender,
              status: 'inactive',
              role: values.role,
              creatorMail: `${values.fullName} (${values.employeeId})`
            }
          );

          await sendMail({
            to: SUPER_ADMIN,
            subject: 'New Admin Registration Alert',
            html: `
<style>
  @media (max-width: 600px) {
    .email-container { padding: 20px !important; }
    .email-wrapper { margin: 0 !important; }
    .header { padding: 20px 16px !important; }
    .header h1 { font-size: 20px !important; }
    .body { padding: 20px 16px !important; }
    .body p { font-size: 14px !important; }
    .info-box { padding: 20px 16px !important; margin: 20px 0 !important; }
    .action-box { padding: 20px 16px !important; margin: 20px 0 !important; }
    .footer { padding: 12px 16px !important; }
    .footer p { font-size: 10px !important; }
  }
</style>
<div class="email-container" style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
  <div class="email-wrapper" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);">
    <div class="header" style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
      <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">New Admin Registration Alert</h1>
    </div>

    <div class="body" style="padding: 30px 25px; text-align: left;">
      <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
        A new user has registered as an Administrator for KeeperNest.
      </p>

      <div class="info-box" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 25px 20px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #0369a1; font-size: 18px;">Registration Details</h3>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <p style="margin: 10px 0; color: #333;">
            <strong>Name:</strong> ${values.fullName}
          </p>
          <p style="margin: 10px 0; color: #333;">
            <strong>Employee ID:</strong> ${values.employeeId}
          </p>
          <p style="margin: 10px 0; color: #333;">
            <strong>Email:</strong> ${values.email}
          </p>
          <p style="margin: 10px 0; color: #333;">
            <strong>Role:</strong> <span style="color: #3b82f6; font-weight: bold;">Admin</span>
          </p>
          <p style="margin: 10px 0; color: #333;">
            <strong>Gender:</strong> ${values.gender}
          </p>
          <p style="margin: 10px 0; color: #333;">
            <strong>Registration Time:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <div class="action-box" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 25px 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <h3 style="margin: 0 0 15px 0; color: #0369a1; font-size: 18px;">Action Required</h3>
        <p style="color: #0369a1; font-size: 15px; margin: 0 0 20px 0;">
          Please click the button below only once to verify this admin.
        </p>
        
        <div id="verifyButtonContainer">
          <a href="${window.location.origin}/superAdmin/${values.employeeId}" 
             id="verifyButton"
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s; cursor: pointer;"
             onclick="this.style.pointerEvents='none'; this.style.opacity='0.6'; this.style.background='linear-gradient(135deg, #10b981, #34d399)'; this.style.cursor='default'; this.style.boxShadow='none'; this.innerHTML='✓ Verified'; return true;">
            Verify Admin
          </a>
        </div>
        
        <script>
          // Store clicked state in localStorage to prevent multiple clicks
          (function() {
            const button = document.getElementById('verifyButton');
            const employeeId = '${values.employeeId}';
            const storageKey = 'keepernest_verified_' + employeeId;
            
            // Check if already clicked
            if (localStorage.getItem(storageKey) === 'true') {
              button.style.pointerEvents = 'none';
              button.style.opacity = '0.6';
              button.style.background = 'linear-gradient(135deg, #6b7280, #9ca3af)';
              button.style.cursor = 'default';
              button.style.boxShadow = 'none';
              button.innerHTML = '✓ Already Verified';
              button.href = 'javascript:void(0)';
            }
            
            // Add click handler
            button.addEventListener('click', function(e) {
              // Mark as clicked in localStorage
              localStorage.setItem(storageKey, 'true');
              
              // Change button appearance immediately
              this.style.pointerEvents = 'none';
              this.style.opacity = '0.6';
              this.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
              this.style.cursor = 'default';
              this.style.boxShadow = 'none';
              this.innerHTML = '✓ Verifying...';
              
              // The link will still work, but button won't change back
            });
          })();
        </script>
        
        <p style="color: #666; font-size: 12px; margin: 15px 0 0 0;">
          <strong>Note:</strong> This button works only once. After clicking, it will show "Verified".
        </p>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
          <strong>Note:</strong> This user has been granted admin privileges. Monitor their activities regularly.
        </p>
      </div>

      <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
        This is an automated alert. Please take appropriate action if you notice any suspicious activity.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #333; font-size: 15px;">
        Stay secure,<br>
        <strong>The KeeperNest Security Team</strong>
      </p>
    </div>

    <div class="footer" style="background: #f9fafb; padding: 15px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
        This is an automated alert message. Please do not reply to this email.
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
        } catch (emailError) {
          console.error("Failed to send admin notification email:", emailError);
        }
      } else {
        await databases.createDocument(
          dbId,
          collectionId,
          values.employeeId,
          {
            employeeId: values.employeeId,
            password: encrypt(values.password),
            name: values.fullName,
            email: values.email,
            gender: values.gender,
            role: values.role,
            creatorMail: `${values.fullName} (${values.employeeId})`
          }
        );
      }

      showSnackbar(`Account created successfully! Welcome, ${values.fullName}!`, 'success');

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      console.error("Signup error:", error);

      if (error?.code === 409) {
        showSnackbar("An account with this email or employee ID already exists. Please use different credentials.", 'error');
        form.setError("email", {
          type: "manual",
          message: "This email may already be registered"
        });
        form.setError("employeeId", {
          type: "manual",
          message: "This employee ID may already be taken"
        });
      } else if (error?.code === 400) {
        showSnackbar("Invalid data provided. Please check your inputs.", 'error');
      } else if (error?.message?.includes("password")) {
        showSnackbar("Password does not meet requirements (minimum 8 characters).", 'error');
        form.setError("password", {
          type: "manual",
          message: "Password does not meet requirements"
        });
      } else {
        showSnackbar("Something went wrong. Please try again.", 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex items-center gap-1.5 mt-1 text-red-600 text-xs">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/30 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-[#3b82f6] tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in your details to create your account
            </p>
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-4">

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${fieldState.error ? "text-red-400" : "text-gray-400"}`} size={18} />
                          <Input
                            placeholder="Enter your full name"
                            className={`pl-12 pr-4 py-3 bg-gray-50 border ${fieldState.error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 shadow-none h-auto`}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {fieldState.error && <ErrorDisplay message={fieldState.error.message || ""} />}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${fieldState.error ? "text-red-400" : "text-gray-400"}`} size={18} />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-12 pr-28 py-3 bg-gray-50 border ${fieldState.error || emailVerificationStatus === 'invalid' ? "border-red-300 focus:border-red-500" : emailVerificationStatus === 'valid' ? "border-green-300 focus:border-green-500" : emailVerificationStatus === 'pending' ? "border-yellow-300 focus:border-yellow-500" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 rounded-xl focus-visible:ring-2 ${emailVerificationStatus === 'valid' ? 'focus-visible:ring-green-500' : emailVerificationStatus === 'pending' ? 'focus-visible:ring-yellow-500' : 'focus-visible:ring-blue-500'} transition-all duration-200 shadow-none h-auto`}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Reset verification status when email changes
                              if (emailVerificationStatus !== 'idle') {
                                setEmailVerificationStatus('idle');
                                setOtp('');
                                setUserEnteredOtp('');
                              }
                            }}
                          />

                          {emailVerificationStatus === 'valid' && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                          )}

                          {emailVerificationStatus === 'invalid' && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <XCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}

                          {emailVerificationStatus === 'checking' && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                            </div>
                          )}

                          {emailVerificationStatus === 'pending' && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center">
                                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          )}

                          {emailVerificationStatus === 'idle' && (
                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                              <Button
                                type="button"
                                onClick={verifyEmail}
                                disabled={isVerifyingEmail || !field.value || !!fieldState.error}
                                size="sm"
                                className="h-7 px-3 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 border border-blue-200 rounded-lg transition-colors shadow-none"
                              >
                                {isVerifyingEmail ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  "Verify"
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>

                      <div className="mt-1 space-y-1">
                        {fieldState.error && <ErrorDisplay message={fieldState.error.message || ""} />}

                        {emailVerificationStatus === 'valid' && (
                          <div className="flex items-center gap-1.5 text-green-600 text-xs">
                            <CheckCircle className="h-3 w-3 flex-shrink-0" />
                            <span>Email verified successfully</span>
                          </div>
                        )}

                        {emailVerificationStatus === 'checking' && (
                          <div className="flex items-center gap-1.5 text-blue-600 text-xs">
                            <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                            <span>Sending verification code...</span>
                          </div>
                        )}

                        {emailVerificationStatus === 'pending' && (
                          <div className="flex items-center gap-1.5 text-yellow-600 text-xs">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse flex-shrink-0"></div>
                            <span>Verification code sent. Check your email.</span>
                          </div>
                        )}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Employee ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${fieldState.error ? "text-red-400" : "text-gray-400"}`} size={18} />
                          <Input
                            placeholder="Enter your employee ID"
                            className={`pl-12 pr-4 py-3 bg-gray-50 border ${fieldState.error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 shadow-none h-auto`}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {fieldState.error && <ErrorDisplay message={fieldState.error.message || ""} />}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${fieldState.error ? "text-red-400" : "text-gray-400"}`} size={18} />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className={`pl-12 pr-12 py-3 bg-gray-50 border ${fieldState.error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 shadow-none h-auto`}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      {fieldState.error && (
                        <div className="mt-1 space-y-1">
                          <ErrorDisplay message={fieldState.error.message || ""} />
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Gender</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className={`pl-10 h-auto py-3 bg-gray-50 border ${fieldState.error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 relative shadow-none`}>
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <UserCircle className={`h-[18px] w-[18px] ${fieldState.error ? "text-red-400" : "text-gray-400"}`} />
                              </div>
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-blue-100">
                            <SelectItem value="male" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">Male</SelectItem>
                            <SelectItem value="female" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.error && <ErrorDisplay message={fieldState.error.message || ""} />}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className={`pl-10 h-auto py-3 bg-gray-50 border ${fieldState.error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 relative shadow-none`}>
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <Users className={`h-[18px] w-[18px] ${fieldState.error ? "text-red-400" : "text-gray-400"}`} />
                              </div>
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-blue-100">
                            <SelectItem value="admin" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">Admin</SelectItem>
                            <SelectItem value="employee" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.error && <ErrorDisplay message={fieldState.error.message || ""} />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid || emailVerificationStatus !== 'valid'}
                className="w-full py-3.5 mt-4 bg-[#3b82f6] text-white font-semibold rounded-xl hover:bg-[#2563eb] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate('/')}
                    className="text-[#3b82f6] hover:underline transition-all cursor-pointer"
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Verify Email</h3>
              <button
                onClick={() => {
                  setOtpModal(false);
                  setUserEnteredOtp('');
                  setOtpError('');
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Enter Verification Code
              </h4>
              <p className="text-gray-600 text-sm">
                We've sent a 6-digit code to <span className="font-medium">{form.getValues("email")}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={userEnteredOtp}
                  onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest py-6"
                  maxLength={6}
                />
              </div>

              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{otpError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={verifyOtp}
                  disabled={userEnteredOtp.length !== 6 || isVerifyingOtp}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
        message={snackbar.message}
        type={snackbar.type}
        duration={4000}
      />
    </>
  )
}