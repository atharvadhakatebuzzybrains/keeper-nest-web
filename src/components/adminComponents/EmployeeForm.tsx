import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, IdCard, PlusCircle, RefreshCcw, Loader, Loader2 } from "lucide-react"
import { useState } from "react"
import { Snackbar, useNotification } from '../Alerts';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Query } from "appwrite"
import { account, databases } from "../../appwrite/config"
import { encrypt } from "../../appwrite/encrypt_decrypt_password"
import { sendMail } from "../../server/emailSender";
import { useNavigate } from "react-router"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  employeeId: z.string().min(1, "Employee ID is required"),
  gender: z.string({
    message: "Please select a gender",
  }).min(1, "Please select a gender"),
})

type EmployeeFormValues = z.infer<typeof formSchema>

export default function AddEmployeeDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useNotification();
  const navigate = useNavigate();
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      employeeId: "",
      gender: "",
    },
  })

  async function onSubmit(values: EmployeeFormValues) {
    setIsLoading(true);
    console.log("Employee Data:", values);

    const dbId = "user_info";
    const collectionId = "user_info";

    try {
      const existingEmp = await databases.listDocuments(
        dbId,
        collectionId,
        [Query.equal("employeeId", values.employeeId)]
      );

      if (existingEmp.total > 0) {
        showSnackbar(`Employee ID "${values.employeeId}" already exists.`, 'error');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error checking existing employee:", err);
      showSnackbar("Failed to check existing employee. Please try again.", 'error');
      setIsLoading(false);
      return;
    }

    try {
      const existingEmail = await databases.listDocuments(
        dbId,
        collectionId,
        [Query.equal("email", values.email)]
      );

      if (existingEmail.total > 0) {
        showSnackbar(`Email "${values.email}" is already registered.`, 'error');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error checking existing email:", err);
      showSnackbar("Failed to check existing email. Please try again.", 'error');
      setIsLoading(false);
      return;
    }

    try {
      const password = `EMPLOYEE_${values.employeeId}`;
      let user = null;
      try {
        user = await account.get();
      } catch (error) {
        console.log("Error getting admin user: ", error);
        setIsLoading(false);
        showSnackbar("Failed to get admin information. Please log in again.", 'error');
        return;
      }

      const adminId = user.$id;
      const adminName = user.name;

      await account.create(
        values.employeeId,
        values.email,
        password,
        values.fullName
      );

      await databases.createDocument(
        dbId,
        collectionId,
        values.employeeId,
        {
          employeeId: values.employeeId,
          name: values.fullName,
          email: values.email,
          password: encrypt(password),
          gender: values.gender,
          role: "employee",
          creatorMail: `${adminName} (${adminId})`,
        }
      );

      // Note: Email sending is now disabled because it requires a backend API
      // To enable email sending, create an API endpoint that calls the sendEmail function

      await sendMail({
        to: values.email,
        subject: `Welcome to KeeperNest — Your Employee Account Details`,
        html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(79,70,229,0.15);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
        <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">Welcome to KeeperNest</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px 25px; text-align: left;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${values.fullName}</strong>,</p>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          We're excited to have you on board at <strong>KeeperNest</strong>!<br>
          Your employee account has been created successfully. Below are your login credentials — please use them to access your account.
        </p>

        <!-- Login Details Card -->
        <div style="background: #f8fafc; border: 1px solid #e5e7eb; padding: 18px 20px; border-radius: 10px; margin: 25px 0;">
          <p style="margin: 0; font-weight: bold; color: #111;">Username (Email):</p>
          <p style="margin: 6px 0 12px; color: #333;">${values.email}</p>

          <p style="margin: 0; font-weight: bold; color: #111;">Password:</p>
          <p style="margin: 6px 0; color: #333;">${password}</p>
        </div>

        <!-- Instructions -->
        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          <strong>Important:</strong> Please change your password after your first login to keep your account secure.
        </p>

        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          If you face any issues while signing in, our IT support team is here to help — just reply to this email or reach out via the support portal.
        </p>

        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <!-- Signature -->
        <p style="color: #333; font-size: 15px;">
          Cheers,<br>
          <strong>The KeeperNest Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px;">
        <p style="color: #aaa; font-size: 13px; margin: 0;">
          © ${new Date().getFullYear()} KeeperNest. All rights reserved.
        </p>
      </div>
    </div>
  </div>
  `,
      });

      showSnackbar(`Employee "${values.fullName}" created successfully!`, 'success');
      navigate('/dashboard/employees');
      form.reset();
      setIsLoading(false);

    } catch (err) {
      console.error("Error creating employee:", err);
      showSnackbar("Failed to create employee. Please try again.", 'error');
      setIsLoading(false);
      return;
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200">

          <div className="bg-[#3b82f6] border-b border-gray-300 px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative border-2 border-white rounded-xl shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                    <PlusCircle className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Employee Registration</h1>
                  <p className="text-sm text-white mt-1">Register a new employee to the organization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="relative flex items-center">
                              <User className="absolute left-3.5 h-5 w-5 text-blue-500 z-10" />
                              <Input
                                {...field}
                                placeholder="Enter employee's full name"
                                className="pl-12 h-11 border-gray-200 focus:ring-blue-100"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="relative flex items-center">
                              <Mail className="absolute left-3.5 h-5 w-5 text-blue-500 z-10" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter employee's email"
                                className="pl-12 h-11 border-gray-200 focus:ring-blue-100"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Employee ID <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="relative flex items-center">
                              <IdCard className="absolute left-3.5 h-5 w-5 text-blue-500 z-10" />
                              <Input
                                {...field}
                                placeholder="e.g., EMP-1001"
                                className="pl-12 h-11 border-gray-200 focus:ring-blue-100"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Gender <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-200 focus:ring-blue-100">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-10 h-11 text-base font-semibold shadow-lg transition-all active:scale-95"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-5 w-5" /> Create Employee
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </Form>
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
    </>
  )
}