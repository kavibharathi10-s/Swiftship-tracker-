import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, RotateCw, Check } from "lucide-react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageUploadCardProps {
  folder: string;
  cardTitle: string;
  onFileChange: (file: File | null) => void;
  existingImageUrl?: string | null;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  folder,
  cardTitle,
  onFileChange,
  existingImageUrl = null,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | undefined>(
    undefined
  );
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  useEffect(() => {
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
      setOriginalImageUrl(existingImageUrl); // Save the original image
      
    }
  }, [existingImageUrl]);
  

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      return "Only PNG & JPG files are allowed.";
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        onFileChange(null);
        return;
      }

      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setTempImageUrl(objectUrl);
      setIsEditing(true);
      setOriginalImageUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleRotate = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.rotate(90);
    }
  };

  const handleCropComplete = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped_image.jpg", {
            type: "image/jpeg",
          });
          onFileChange(croppedFile);
          setImageUrl(URL.createObjectURL(blob));
          setIsEditing(false);
          setTempImageUrl(undefined);
        }
      }, "image/jpeg");
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setTempImageUrl(originalImageUrl || undefined);
    // Reset the file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Card className="w-full bg-white shadow-md overflow-hidden transition-all duration-200 ease-in-out transform hover:shadow-lg hover:scale-105">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {cardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            {imageUrl ? (
              <div className="relative w-full h-48">
                <img
                  src={imageUrl}
                  alt="Document Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center bg-gray-50">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm">No Image Selected</span>
              </div>
            )}

            <label
              htmlFor={`file-upload-${folder}`}
              className="absolute bottom-2 right-2 bg-black text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-200"
            >
              <Upload className="w-4 h-4 inline-block mr-2" />
              {imageUrl ? "Replace Image" : "Upload Image"}
            </label>
            <input
              id={`file-upload-${folder}`}
              ref={fileInputRef} // Add ref here
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Custom Dialog */}
      {isEditing && tempImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-3xl bg-white rounded-lg">
            <div className="relative h-full">
              <Cropper
                ref={cropperRef}
                src={tempImageUrl}
                style={{ height: "100%", width: "100%" }}
                aspectRatio={NaN}
                guides={true}
                viewMode={1}
                dragMode="move"
                background={false}
                rotatable={true}
                scalable={true}
                zoomable={true}
                autoCropArea={1}
              />
            </div>

            <div className="absolute bottom-0 w-full bg-white text-black p-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRotate}
                className="rounded-full"
                type="button"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDiscard} type="button">
                  Cancel
                </Button>
                <Button onClick={handleCropComplete} type="button">
                  <Check />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ImageUploadCard;
