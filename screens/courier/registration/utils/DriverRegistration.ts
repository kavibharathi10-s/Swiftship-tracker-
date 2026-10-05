import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/screens/courier/registration/utils/Upload";
import { upsertDriver, getDriverByID } from "@/actions/driverActions";

export default function useDriverRegistration() {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    "profile-photo": null,
    "id-document": null,
    "drivers-license": null,
    "license-disc": null,
    "car-photos-front": null,
    "car-photos-side": null,
    "car-photos-rear": null,
  });
  const [existingImages, setExistingImages] = useState<{
    [key: string]: string | null;
  }>({
    "profile-photo": null,
    "id-document": null,
    "drivers-license": null,
    "license-disc": null,
    "car-photos-front": null,
    "car-photos-side": null,
    "car-photos-rear": null,
  });
  const [formData, setFormData] = useState({
    phoneNumber: "",
    location: "",
    vehicleMake: "",
    vehicleModel: "",
    typeOfVehicle: "",
    vehicleColor: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchDriverData = async () => {
      if (userId) {
        try {
          const driver = await getDriverByID(userId);
          if (driver) {
            console.log("Fetched Driver Data:", driver); // Debugging line
            const vehicleTypeParts = driver.data?.vehicleType
              ? driver.data?.vehicleType.split(",")
              : [];
            const vehicleImageParts = driver.data?.vehicleImagesUrls
              ? driver.data?.vehicleImagesUrls.split(",")
              : [];

            setFormData({
              phoneNumber: driver.data?.phoneNumber || "",
              location: driver.data?.location || "",
              vehicleMake: vehicleTypeParts[1] || "",
              vehicleModel: vehicleTypeParts[2] || "",
              typeOfVehicle: vehicleTypeParts[3] || "",
              vehicleColor: vehicleTypeParts[0] || "",
            });
            setExistingImages({
              "profile-photo": driver.data?.photoUrl || null,
              "id-document": driver.data?.idPhotoUrl || null,
              "drivers-license": driver.data?.licensePhotoUrl || null,
              "license-disc": driver.data?.discPhotoUrl || null,
              "car-photos-front": vehicleImageParts[0] || null,
              "car-photos-side": vehicleImageParts[1] || null,
              "car-photos-rear": vehicleImageParts[2] || null,
            });
          }
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      }
      setIsLoading(false);
    };

    fetchDriverData();
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

    setLoading(true);

    const updateData: any = {
      clerkId: userId || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phoneNumber: formData.phoneNumber,
      location: formData.location,
      vehicleType:
        `${formData.vehicleColor}, ${formData.vehicleMake}, ${formData.vehicleModel}, ${formData.typeOfVehicle}`.trim(),
    };

    let vehicleImages = [];
    for (const [folder, file] of Object.entries(files)) {
      if (file) {
        const { url, error } = await uploadImage(file, folder, userId || "");

        if (error) {
          setLoading(false);
          return alert(`Error uploading ${folder}: ${error}`);
        }

        const fieldName =
          folder === "profile-photo"
            ? "photoUrl"
            : folder === "id-document"
            ? "idPhotoUrl"
            : folder === "drivers-license"
            ? "licensePhotoUrl"
            : folder === "license-disc"
            ? "discPhotoUrl"
            : null;

        if (fieldName) {
          updateData[fieldName] = url;
        }

        if (
          ["car-photos-front", "car-photos-side", "car-photos-rear"].includes(
            folder
          )
        ) {
          vehicleImages.push(url);
        }
      } else if (existingImages[folder]) {
        const fieldName =
          folder === "profile-photo"
            ? "photoUrl"
            : folder === "id-document"
            ? "idPhotoUrl"
            : folder === "drivers-license"
            ? "licensePhotoUrl"
            : folder === "license-disc"
            ? "discPhotoUrl"
            : null;

        if (fieldName) {
          updateData[fieldName] = existingImages[folder];
        }

        // Collect car photo URLs from existing images
        if (
          ["car-photos-front", "car-photos-side", "car-photos-rear"].includes(
            folder
          )
        ) {
          vehicleImages.push(existingImages[folder]);
        }
      }
    }

    // Assign collected URLs to vehicleImagesUrls, separated by commas
    if (vehicleImages.length > 0) {
      updateData.vehicleImagesUrls = vehicleImages.join(",");
    }

    const result = await upsertDriver(updateData);

    if (result.success) {
      router.push("/onboarding/driver-onboarding/face-recog");
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
