import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { User, Mail, Lock, Briefcase, UserCircle, Users, Eye, EyeOff, AlertCircle } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
  FormMessage,
} from "../components/ui/form"
import { account, databases } from "../appwrite/config"
import { encrypt } from '../appwrite/encrypt_decrypt_password'
import { roleCache } from '../utils/roleCache'

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

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  async function onSubmit(values: SignupFormValues) {
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

      await account.createEmailPasswordSession(values.email, values.password);
  // Cache role locally so DashboardRouter can pick it up immediately
  roleCache.setRole(values.role as 'admin' | 'employee');

  // Navigate to the dashboard (DashboardRouter will render admin/employee view based on role)
  navigate('/dashboard/');

    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error?.code === 409) {
        if (error.message?.includes("email")) {
          form.setError("email", {
            type: "manual",
            message: "This email is already registered"
          });
        } else if (error.message?.includes("user")) {
          form.setError("employeeId", {
            type: "manual",
            message: "This employee ID is already taken"
          });
        } else {
          setSubmitError("Account already exists with these credentials");
        }
      } else if (error?.code === 400) {
        setSubmitError("Invalid data provided. Please check your inputs.");
      } else if (error?.message?.includes("password")) {
        form.setError("password", {
          type: "manual",
          message: "Password does not meet requirements"
        });
      } else {
        setSubmitError("Something went wrong. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
              disabled={isLoading || !form.formState.isValid}
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
  )
}