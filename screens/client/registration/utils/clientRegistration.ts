import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { uploadImage } from "./upload";
import { upsertDriver, getDriverByID } from "@/actions/driverActions";
import { createClient, getClientById } from "@/actions/clientActions";
import { toast } from "sonner";

export default function useclientRegistration() {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    "id-documents": null,
  });
  const [existingImages, setExistingImages] = useState<{
    [key: string]: string | null;
  }>({
    "id-documents": null,
  });
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchClientData = async () => {
      if (userId) {
        try {
          const client = await getClientById(userId);
          if (client.success) {
            toast.error("User already exists"); // client already exists
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      }
      setIsLoading(false);
    };

    fetchClientData();
  }, [userId]); // Ensure that userId changes trigger the effect

  const handleFileChange = (folder: string) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [folder]: file }));
    if (file) {
      setExistingImages((prev) => ({ ...prev, [folder]: null }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    const allFilesSelectedOrExisting = Object.entries(files).every(
      ([key, file]) => file !== null || existingImages[key] !== null
    );
    if (!allFilesSelectedOrExisting) {
      return alert("Please select all required files or use existing images");
    }

    if (Object.values(formData).some((value) => value === "")) {
      return alert("Please fill in all fields");
    }
    oneNumber: formData.phoneNumber, setLoading(true);

    const updateData: any = {
      clerkId: userId || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phoneNumber: formData.phoneNumber,
      photoUrl: user?.imageUrl,
    };

    for (const [folder, file] of Object.entries(files)) {
      if (file) {
        const { url, error } = await uploadImage(file, folder, userId || "");

        if (error) {
          setLoading(false);
          return alert(`Error uploading ${folder}: ${error}`);
        }

        const fieldName = folder === "id-documents" && "idPhotoUrl";

        if (fieldName) {
          updateData[fieldName] = url;
        }
      } else if (existingImages[folder]) {
        const fieldName = folder === "id-documents" ? "idPhotoUrl" : null;

        if (fieldName) {
          updateData[fieldName] = existingImages[folder];
        }
      }
    }

    const result = await createClient(updateData);

    if (result.success) {
      router.push("/onboarding/client-onboarding/face-recog");
    } else {
      alert(`Error saving to database: ${result.error}`);
    }

    setLoading(false);
  };

  return {
    files,
    existingImages,
    formData,
    loading,
    isLoading,
    handleFileChange,
    handleInputChange,
    handleUpload,
  };
}
