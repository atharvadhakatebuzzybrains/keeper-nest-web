import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, IdCard, PlusCircle, RefreshCcw } from "lucide-react"

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
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      employeeId: "",
      gender: "",
    },
  })

  function onSubmit(values: EmployeeFormValues) {
    console.log("Employee Data:", values)
  }

  return (
    <div className="max-w-4xl mx-auto p-0 bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 mt-10 mb-10">
      
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

                {/* Email Address */}
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
                {/* Employee ID */}
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

                {/* Gender Dropdown */}
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
                className="bg-blue-600 hover:bg-blue-700 px-10 h-11 text-base font-semibold shadow-lg transition-all active:scale-95"
              >
                <RefreshCcw className="mr-2 h-5 w-5" /> Create Employee
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}