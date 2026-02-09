import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { LuPlus, LuShapes } from "react-icons/lu";
import { MdLaptop } from "react-icons/md";
import { FaCalendarDay } from "react-icons/fa6";
import {
  CalendarIcon,
  Hash,
  FileText,
  Package,
  PlusCircle,
  Monitor,
  Loader2,
  RefreshCcw
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
import { databases } from "../../appwrite/config";
import { Query } from "appwrite";
import { Snackbar, useNotification } from "../Alerts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const assetSchema = z.object({
  assetName: z.string().min(1, "Asset name is required"),
  assetType: z.string().min(1, "Asset type is required"),
  assetId: z.string().min(1, "Asset ID is required"),
  purchaseDate: z.date({
    message: "Purchase date is required",
  }),
  description: z.string().optional(),
  osType: z.enum(["Windows", "Ubuntu", "macOS"]).optional(),
}).superRefine((data, ctx) => {
  if (data.assetType === "Laptop" && !data.osType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "OS Type is required for Laptops",
      path: ["osType"],
    });
  }
});

type AssetFormValues = z.infer<typeof assetSchema>

export default function CreateAsset() {
  const navigate = useNavigate();
  const { snackbar, showSnackbar, closeSnackbar } = useNotification();
  const [loading, setLoading] = useState(false);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [isAddingNewType, setIsAddingNewType] = useState<boolean>(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [assetLoading, setAssetLoading] = useState(false);

  // FIXED: Correct useEffect with async function inside
  useEffect(() => {
    const fetchAssetTypes = async () => {
      try {
        const res = await databases.listDocuments('assetManagement', 'asset-type');
        let types = res.documents.map(doc => doc.assetType);

        // Fallback if collection is empty
        if (types.length === 0) {
          types = ['Laptop', 'Mouse', 'Keyboard', 'Other'];
        }

        console.log(types);
        setAssetTypes(types);
      } catch (err) {
        console.error("Error fetching asset types:", err);
        // Fallback on error
        setAssetTypes(['Laptop', 'Mouse', 'Keyboard', 'Other']);
        showSnackbar('Loaded default asset types.', 'info');
      }
    };

    fetchAssetTypes();
  }, [showSnackbar]);

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

  const assetType = form.watch("assetType");

  async function onSubmit(values: AssetFormValues) {
    console.log("Asset Data:", values);
    setLoading(true);

    try {
      const res = await databases.listDocuments('assetManagement', 'assets', [
        Query.equal('assetId', values.assetId),
      ]);

      if (res.total > 0) {
        showSnackbar('Asset ID already exists. Please use a unique Asset ID.', 'error');
        setLoading(false);
        return;
      }

      const currentYear = new Date().getFullYear();
      const expiredAt = new Date(currentYear, 11, 31);

      await databases.createDocument('assetManagement', 'assets', 'unique()', {
        assetName: values.assetName,
        assetType: values.assetType,
        assetId: values.assetId,
        purchaseDate: values.purchaseDate.toISOString(),
        description: values.description || '',
        osType: values.osType || null,
        status: 'Available',
        expiredAt: expiredAt.toISOString(),
        historyQueue: [JSON.stringify({ updation: "Asset Created", date: new Date().toISOString() })]
      });

      showSnackbar('Asset created successfully!', 'success');
      form.reset();
      navigate('/dashboard/viewAssets');

    } catch (err) {
      console.error("Error creating asset:", err);
      showSnackbar('Failed to create asset. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNewType() {
    setAssetLoading(true);
    try {
      if (assetTypes.includes(newTypeName)) {
        showSnackbar('Asset Type already exists!', 'error');
        return;
      }

      await databases.createDocument('assetManagement', 'asset-type', 'unique()', { assetType: newTypeName });

      setAssetTypes(prev => [...prev, newTypeName]);
      showSnackbar('Asset Type added successfully', 'success');
      setNewTypeName('');
    } catch (err) {
      console.log(`Asset Type addition error: ${err}`);
      showSnackbar('Failed to add asset type', 'error');
    } finally {
      setAssetLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200">
        <div className="bg-[#3b82f6] border-b border-gray-300 px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative border-2 border-white rounded-xl shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                  <PlusCircle className="h-3 w-3 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Asset</h1>
                <p className="text-sm text-white mt-1">Add a new asset to your inventory</p>
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
                  <h3 className="text-lg font-semibold text-gray-800">Asset Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="assetName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Asset Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <MdLaptop className="absolute left-3.5 h-5 w-5 text-blue-500 z-10" />
                            <Input
                              {...field}
                              placeholder="e.g., Dell Inspiron Laptop"
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
                    name="assetId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Asset ID <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Hash className="absolute left-3.5 h-5 w-5 text-blue-500 z-10" />
                            <Input
                              {...field}
                              placeholder="e.g.,ASSET-001"
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
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Asset Type <span className="text-red-500">*</span></FormLabel>
                        <div className="flex gap-2">
                          <div className="relative flex items-center flex-1">
                            <LuShapes className="absolute left-3.5 h-5 w-5 text-blue-500 z-10 pointer-events-none" />
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 pl-12 border-gray-200 focus:ring-blue-100 flex-1">
                                  <SelectValue placeholder="Select asset type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {assetTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                                <div className="p-2 border-t">
                                  <button
                                    type="button"
                                    className="flex items-center justify-center w-full px-2 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                    onClick={() => {
                                      setIsAddingNewType(true);
                                      form.setValue('assetType', '');
                                    }}
                                  >
                                    <LuPlus className="h-4 w-4 mr-1.5" />
                                    Add New Type
                                  </button>
                                </div>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-11 w-11"
                            onClick={() => {
                              setIsAddingNewType(true);
                              form.setValue("assetType", "");
                            }}
                          >
                            <LuPlus className="h-5 w-5" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {assetType === "Laptop" && (
                    <FormField
                      control={form.control}
                      name="osType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">OS Type <span className="text-red-500">*</span></FormLabel>
                          <div className="relative flex items-center">
                            <Monitor className="absolute left-3.5 h-5 w-5 text-blue-500 z-10 pointer-events-none" />
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 pl-12 border-gray-200 focus:ring-blue-100">
                                  <SelectValue placeholder="Select OS" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Windows">Windows</SelectItem>
                                <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                                <SelectItem value="macOS">macOS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Add new type form */}
                {isAddingNewType && (
                  <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Enter new asset type..."
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            className="h-10"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNewType();
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9"
                          onClick={() => {
                            setIsAddingNewType(false);
                            setNewTypeName('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-9"
                          onClick={handleAddNewType}
                          disabled={!newTypeName.trim() || assetLoading}
                        >
                          {assetLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <LuPlus className="h-4 w-4 mr-2" />
                          )}
                          Add Type
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Purchase Details</h3>
                </div>

                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-700">Purchase Date <span className="text-red-500">*</span></FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <div className="relative flex items-center">
                              <FaCalendarDay className="absolute left-3.5 h-5 w-5 text-blue-500 z-10" />
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full h-11 pl-12 text-left font-normal border-gray-200",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Select purchase date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </div>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Additional Info</h3>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Description</FormLabel>
                      <FormControl>
                        <div className="relative flex items-start">
                          <FileText className="absolute left-3.5 top-3 h-5 w-5 text-blue-500 z-10" />
                          <Textarea
                            {...field}
                            placeholder="Optional description or notes..."
                            className="pl-12 min-h-[120px] border-gray-200 focus:ring-blue-100"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-10" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-5 w-5" />
                      Create Asset
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
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