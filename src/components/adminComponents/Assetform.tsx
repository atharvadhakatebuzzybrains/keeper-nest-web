"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { LuShapes } from "react-icons/lu"
import { MdLaptop } from "react-icons/md"
import { FaCalendarDay } from "react-icons/fa6"
import {
  CalendarIcon,
  Hash,
  FileText,
  Package,
  PlusCircle,
} from "lucide-react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
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
import { Calendar } from "../ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { cn } from "../../lib/utils"

/* ---------------- Schema ---------------- */
const assetSchema = z.object({
  assetName: z.string().min(1, "Asset name is required"),
  assetType: z.string().min(1, "Asset type is required"),
  assetId: z.string().min(1, "Asset ID is required"),
  purchaseDate: z.date({
    message: "Purchase date is required",
  }),
  description: z.string().optional(),
})

type AssetFormValues = z.infer<typeof assetSchema>

export default function CreateAsset() {
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      assetName: "",
      assetType: "",
      assetId: "",
      purchaseDate: undefined,
      description: "",
    },
  })

  function onSubmit(values: AssetFormValues) {
    console.log("Asset Data:", values)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 mt-10 mb-10">
      
      {/* Header */}
      <div className="relative bg-[#3b82f6] border-b border-gray-300 px-8 py-6">
        <div className="flex sm:flex-row items-center justify-between">
          
          {/* LOGO – dead center on mobile, unchanged on desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <div className="relative border-2 border-white rounded-xl shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                <PlusCircle className="h-3 w-3 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="hidden sm:block ml-4">
            <h1 className="text-2xl font-bold text-white">Create New Asset</h1>
            <p className="text-sm text-white mt-1">
              Add a new asset to your inventory
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Asset Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Asset Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="assetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MdLaptop className="absolute left-3.5 top-3 h-5 w-5 text-blue-500" />
                          <Input {...field} className="pl-12 h-11" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-3 h-5 w-5 text-blue-500" />
                          <Input {...field} className="pl-12 h-11" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="assetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="mouse">Mouse</SelectItem>
                        <SelectItem value="keyboard">Keyboard</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Purchase Date */}
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-11">
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select purchase date"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <Button type="submit" className="bg-blue-600 px-10">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}
