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
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Loader2, Pencil, Laptop, Tag, FileText } from 'lucide-react';
import { databases } from '../../appwrite/config';

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

    useEffect(() => {
        if (asset) {
            setAssetName(asset.assetName || '');
            setAssetId(asset.assetId || '');
            setDescription(asset.description || '');
        }
    }, [asset, visible]);



    const handleSubmit = async () => {
        console.log('Submitting update:', { assetName, assetId, description });
        setLoading(true);

        try {
            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset!.$id,
                {
                    assetName,
                    assetId,
                    description,
                }
            );
        }catch(err){
            console.log("Update asset error: ", err);
        }finally{
            setLoading(false);
            onClose();
        }
  };

    if (!asset) return null;

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="w-[calc(100%-32px)] max-w-lg mx-auto p-0 sm:p-6 my-4 sm:my-0">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-0 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Pencil className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold">Update Asset</DialogTitle>
                                <DialogDescription className="text-sm mt-1">
                                    Update details for asset: {asset.assetId}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <Card className="border-0 shadow-none mx-4 sm:mx-0">
                    <CardContent className="p-0 sm:p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="assetName" className="flex items-center gap-1">
                                Asset Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3">
                                    <Laptop className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="assetName"
                                    placeholder="e.g., Dell Inspiron Laptop"
                                    className="pl-10 h-11"
                                    value={assetName}
                                    onChange={(e) => setAssetName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assetId" className="flex items-center gap-1">
                                Asset ID <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="assetId"
                                    placeholder="e.g., ASSET-001"
                                    className="pl-10 h-11"
                                    value={assetId}
                                    onChange={(e) => setAssetId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Textarea
                                    id="description"
                                    placeholder="Optional description or notes..."
                                    className="pl-10 min-h-[100px] resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4 px-4 sm:px-0 pb-4 sm:pb-0 border-t border-gray-200 sm:border-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-11 px-6 gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Pencil className="h-4 w-4" />
                                Update Asset
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}