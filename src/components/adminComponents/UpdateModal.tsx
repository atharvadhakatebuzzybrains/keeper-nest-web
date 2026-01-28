import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Loader2, Pencil, Laptop, Tag, FileText, X, Check } from 'lucide-react';
import { databases } from '../../appwrite/config';
import { Snackbar, useNotification } from '../Alerts';

interface Asset {
    $id: string;
    assetId: string;
    assetName: string;
    description: string;
    status?: string;
    assetType?: string;
    assignedTo?: string;
    purchaseDate?: string;
}

interface UpdateAssetModalProps {
    asset: Asset | null;
    visible: boolean;
    onClose: () => void;
}

export default function UpdateAssetModal({ asset, visible, onClose }: UpdateAssetModalProps) {
    const [loading, setLoading] = useState(false);
    const [assetName, setAssetName] = useState(asset?.assetName || '');
    const [assetId, setAssetId] = useState(asset?.assetId || '');
    const [description, setDescription] = useState(asset?.description || '');
    const [errors, setErrors] = useState<{ assetName?: string; assetId?: string }>({});
    const { snackbar, showSnackbar, closeSnackbar } = useNotification();

    useEffect(() => {
        if (asset) {
            setAssetName(asset.assetName || '');
            setAssetId(asset.assetId || '');
            setDescription(asset.description || '');
            setErrors({});
        }
    }, [asset, visible]);

    const validateForm = () => {
        const newErrors: { assetName?: string; assetId?: string } = {};

        if (!assetName.trim()) {
            newErrors.assetName = 'Asset name is required';
        }

        if (!assetId.trim()) {
            newErrors.assetId = 'Asset ID is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        console.log('Submitting update:', { assetName, assetId, description });
        setLoading(true);

        try {
            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset!.$id,
                {
                    assetName: assetName.trim(),
                    assetId: assetId.trim(),
                    description: description.trim(),
                }
            );

            showSnackbar('Asset updated successfully!', 'success');
        } catch (err) {
            console.log("Update asset error: ", err);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    if (!asset) return null;

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-lg sm:max-h-[85vh] p-0 rounded-lg sm:rounded-xl">
                <DialogHeader className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Pencil className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                    Update Asset
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-600 truncate">
                                    {asset.assetName} • {asset.assetId}
                                </DialogDescription>
                            </div>
                        </div>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                </DialogHeader>

                <Card className="border-0 shadow-none mx-0">
                    <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="assetName" className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                    <Laptop className="h-3.5 w-3.5 text-blue-500" />
                                    Asset Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                {errors.assetName && (
                                    <span className="text-xs text-red-500 font-medium">{errors.assetName}</span>
                                )}
                            </div>
                            <Input
                                id="assetName"
                                placeholder="Enter asset name (e.g., Dell Inspiron Laptop)"
                                className={`h-11 text-sm ${errors.assetName ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                value={assetName}
                                onChange={(e) => {
                                    setAssetName(e.target.value);
                                    if (errors.assetName) {
                                        setErrors(prev => ({ ...prev, assetName: undefined }));
                                    }
                                }}
                                disabled={loading}
                            />
                        </div>

                        {/* Asset ID Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="assetId" className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                    <Tag className="h-3.5 w-3.5 text-blue-500" />
                                    Asset ID
                                    <span className="text-red-500">*</span>
                                </Label>
                                {errors.assetId && (
                                    <span className="text-xs text-red-500 font-medium">{errors.assetId}</span>
                                )}
                            </div>
                            <Input
                                id="assetId"
                                placeholder="Enter asset ID (e.g., ASSET-001)"
                                className={`h-11 text-sm font-mono ${errors.assetId ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                                value={assetId}
                                onChange={(e) => {
                                    setAssetId(e.target.value);
                                    if (errors.assetId) {
                                        setErrors(prev => ({ ...prev, assetId: undefined }));
                                    }
                                }}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                <FileText className="h-3.5 w-3.5 text-blue-500" />
                                Description
                                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Add description, specifications, or notes about this asset..."
                                className="min-h-[120px] text-sm resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                </Card>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-11 w-full sm:w-auto px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="hidden sm:inline">Updating Asset...</span>
                                <span className="sm:hidden">Updating...</span>
                            </>
                        ) : (
                            <>
                                <Pencil className="h-4 w-4" />
                                <span className="hidden sm:inline">Update Asset</span>
                                <span className="sm:hidden">Update</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
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