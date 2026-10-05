"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { uploadImage } from "../../registration/utils/Upload";
import { getLocation } from "@/actions/locationAction";
import { createDeliveredJob } from "@/actions/deliveredJobsActions";
import { toast } from "@/hooks/use-toast";

interface PhotoCaptureProps {
  jobId: string | null;
  confirm: () => void;
  onClose?: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  jobId,
  confirm,
  onClose,
}) => {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }

      const constraints = {
        video: {
          facingMode: { exact: "environment" },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access camera");
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current?.srcObject) {
      try {
        setError(null);
        const video = videoRef.current;
        if (!video) {
          throw new Error("Video stream not available");
        }
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to create canvas context");
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to capture photo"
        );
        console.error("Photo capture error:", err);
      }
    }
  };

  const uploadPhoto = async () => {
    if (!photo) {
      setError("No photo to upload");
      return;
    }
    if (!userId) {
      setError("User ID not found");
      return;
    }
    if (!jobId) {
      setError("Job ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const blob = dataURItoBlob(photo);
      const file = new File([blob], `${jobId}-${Date.now()}.png`, {
        type: "image/png",
      });

      const { url, error } = await uploadImage(
        file,
        "proof-of-delivery",
        userId
      );

      if (error || !url) {
        throw new Error(error || "Failed to upload photo");
      }

      const locationResult = await getLocation(userId);
      if (
        !locationResult.success ||
        !locationResult.data ||
        !locationResult.data.latest
      ) {
        throw new Error(locationResult.error || "Failed to get location data");
      }

      const deliveredJob = await createDeliveredJob({
        activeJobId: jobId,
        locationId: locationResult.data.latest.Id,
        proofOfDeliveryUrl: url,
      });

      if (deliveredJob.Id) {
        console.log("Delivered job created successfully");
        confirm();
      } else {
        toast({
          title: "Error",
          description: "Failed to create delivered job",
          variant: "destructive",
        });
      }

      if (onClose) {
        onClose();
      } else {
        router.push("/driver/dashboard/my-jobs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
      console.error("Photo upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    try {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch (err) {
      throw new Error("Failed to convert photo data");
    }
  };

  return (
    <div className="photo-capture fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-95">
      {error && (
        <div className="absolute top-4 w-[90%] p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Camera Display */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Centered Start Camera Button */}
        {!isCameraReady && (
          <button
            onClick={startCamera}
            className="absolute inset-0 flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-slate-500 focus:ring focus:ring-white z-10"
            disabled={isLoading}
          >
            Tap to take proof of delivery
          </button>
        )}
      </div>

      {/* Capture Button */}
      {isCameraReady && (
        <button
          onClick={capturePhoto}
          className="absolute bottom-8 w-16 h-16 bg-white rounded-full shadow-md border-4 border-gray-300 hover:scale-105 transition-transform disabled:opacity-50"
          disabled={isLoading || !isCameraReady}
        />
      )}

      {/* Photo Preview */}
      {photo && (
        <div className="photo-preview flex flex-col items-center gap-4 fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-lg justify-center z-50">
          <Image
            src={photo}
            alt="Captured photo"
            width={580}
            height={580}
            className="rounded-lg shadow-md"
          />
          <button
            onClick={() => {
              uploadPhoto();
              stopCamera();
            }}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-500 transition w-full max-w-xs disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      )}
    </div>
  );
};
export default PhotoCapture;
