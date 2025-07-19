import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BadgeUploaderProps {
  onBadgeUpload?: (badgeData: { id: string; name: string; imagePath: string }) => void;
}

const BadgeUploader: React.FC<BadgeUploaderProps> = ({ onBadgeUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [badgeName, setBadgeName] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a PNG, JPG, or SVG image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !badgeName || !badgeId) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select an image",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, you would upload to your server/storage here
      // For now, we'll simulate the upload and create a local path
      const imagePath = `/badges/${badgeId}.png`;
      
      // Call the callback with badge data
      onBadgeUpload?.({
        id: badgeId,
        name: badgeName,
        imagePath
      });

      toast({
        title: "Badge uploaded successfully",
        description: `Badge "${badgeName}" has been added to your collection`,
      });

      // Reset form
      setSelectedFile(null);
      setBadgeName('');
      setBadgeId('');
      setPreviewUrl(null);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your badge",
        variant: "destructive"
      });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Upload Custom Badge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="badge-name">Badge Name</Label>
          <Input
            id="badge-name"
            placeholder="e.g., Speed Demon"
            value={badgeName}
            onChange={(e) => setBadgeName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badge-id">Badge ID</Label>
          <Input
            id="badge-id"
            placeholder="e.g., speed-demon"
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          />
          <p className="text-xs text-muted-foreground">
            This will be used as the filename (lowercase, hyphens only)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="badge-image">Badge Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {!selectedFile ? (
              <div>
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to select or drag and drop
                </p>
                <Input
                  id="badge-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('badge-image')?.click()}
                >
                  Select Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative inline-block">
                  <img
                    src={previewUrl!}
                    alt="Preview"
                    className="h-16 w-16 object-contain rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={clearSelection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600">{selectedFile.name}</p>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !badgeName || !badgeId}
          className="w-full"
        >
          Upload Badge
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Requirements:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>PNG, JPG, or SVG format</li>
            <li>Maximum 2MB file size</li>
            <li>Recommended: 64x64 or 128x128 pixels</li>
            <li>Transparent background preferred</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeUploader; 