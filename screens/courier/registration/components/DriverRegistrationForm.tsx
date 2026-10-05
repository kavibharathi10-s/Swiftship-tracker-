"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput, ValidationResult } from "@/screens/global/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploadCard from "./ImageUploadCard";
import { CheckCircle } from "lucide-react";
import useDriverRegistration from "@/screens/courier/registration/utils/DriverRegistration";
import { z } from "zod";
import { getClientById } from "@/actions/clientActions";
import { useAuth } from "@clerk/nextjs";

// Define the form data interface
interface FormData {
  phoneNumber: string;
  location: string;
  vehicleMake: string;
  vehicleModel: string;
  typeOfVehicle: string;
  vehicleColor: string;
  idPhotoUrl?: string; // Added idPhotoUrl as optional
}

const driverRegistrationSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .nonempty("Phone number is required"),
  location: z.string().nonempty("Address is required"),
  vehicleMake: z.string().nonempty("Vehicle make is required"),
  vehicleModel: z.string().nonempty("Vehicle model is required"),
  typeOfVehicle: z.string().nonempty("Vehicle type is required"),
  vehicleColor: z.string().nonempty("Vehicle color is required"),
});

export default function DriverRegistrationForm() {
  const {
    files,
    existingImages,
    formData,
    loading,
    isLoading,
    handleFileChange,
    handleInputChange,
    handleUpload,
  } = useDriverRegistration();

  // Add local state to manage form data
  const [localFormData, setLocalFormData] = useState<FormData>({
    phoneNumber: formData.phoneNumber || "",
    location: formData.location || "",
    vehicleMake: formData.vehicleMake || "",
    vehicleModel: formData.vehicleModel || "",
    typeOfVehicle: formData.typeOfVehicle || "",
    vehicleColor: formData.vehicleColor || "",
    idPhotoUrl: "",
  });

  const [phoneValidation, setPhoneValidation] =
    useState<ValidationResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { userId } = useAuth();

  const handleSubmit = async () => {
    try {
      setErrors({});
      driverRegistrationSchema.parse(localFormData);
      await handleUpload();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  // Handle local form data changes
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    handleInputChange(e); // Also update the original form data
  };

  // useEffect(() => {
  //   const fetchClient = async () => {
  //     if (userId) {
  //       try {
  //         const client = await getClientById(userId);
  //         if (client?.data) {
  //           setLocalFormData((prev) => ({
  //             ...prev,
  //             phoneNumber: client.data.phoneNumber || "",
  //             idPhotoUrl: client.data.idPhotoUrl || "",
  //           }));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching client data:", error);
  //       }
  //     }
  //   };

  //   fetchClient();
  // }, [userId]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardHeader>
        <CardContent className="p-6 shadow-md">
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-60 w-full" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
          <Skeleton className="h-12 w-full mt-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-3xl text-center font-bold text-gray-900">
          Registration
        </CardTitle>
        <CardDescription className="text-lg text-center text-gray-600">
          Upload the required documents and provide additional information to be
          verified and start working with us.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 shadow-md">
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploadCard
            folder="profile-photo"
            cardTitle="Profile Photo"
            onFileChange={handleFileChange("profile-photo")}
            existingImageUrl={existingImages["profile-photo"]}
          />
          <ImageUploadCard
            folder="id-document"
            cardTitle="ID Photo"
            onFileChange={handleFileChange("id-document")}
            existingImageUrl={
              existingImages["id-document"] || localFormData.idPhotoUrl
            }
          />
          <ImageUploadCard
            folder="drivers-license"
            cardTitle="Drivers License"
            onFileChange={handleFileChange("drivers-license")}
            existingImageUrl={existingImages["drivers-license"]}
          />
          <ImageUploadCard
            folder="license-disc"
            cardTitle="Vehicle Disc"
            onFileChange={handleFileChange("license-disc")}
            existingImageUrl={existingImages["license-disc"]}
          />
          <ImageUploadCard
            folder="car-photos-front"
            cardTitle="Vehicle Front View"
            onFileChange={handleFileChange("car-photos-front")}
            existingImageUrl={existingImages["car-photos-front"]}
          />
          <ImageUploadCard
            folder="car-photos-side"
            cardTitle="Vehicle Side View"
            onFileChange={handleFileChange("car-photos-side")}
            existingImageUrl={existingImages["car-photos-side"]}
          />
          <ImageUploadCard
            folder="car-photos-rear"
            cardTitle="Vehicle Rear View"
            onFileChange={handleFileChange("car-photos-rear")}
            existingImageUrl={existingImages["car-photos-rear"]}
          />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <PhoneInput
              value={localFormData.phoneNumber}
              placeholder="Phone Number"
              onValueChange={({ phoneNumber, validation }) => {
                setPhoneValidation(validation);
                handleLocalInputChange({
                  target: {
                    name: "phoneNumber",
                    value: phoneNumber as string,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <Input
              name="location"
              placeholder="Residential Address"
              value={localFormData.location}
              onChange={handleLocalInputChange}
              required
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
          <div>
            <Input
              name="vehicleMake"
              placeholder="Vehicle Make (e.g., Toyota, Honda, Hyundai, etc.)"
              value={localFormData.vehicleMake}
              onChange={handleLocalInputChange}
              required
            />
            {errors.vehicleMake && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleMake}</p>
            )}
          </div>
          <div>
            <Input
              name="vehicleModel"
              placeholder="Vehicle Model (e.g., Hilux, Fit, H100 etc.)"
              value={localFormData.vehicleModel}
              onChange={handleLocalInputChange}
              required
            />
            {errors.vehicleModel && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>
            )}
          </div>
          <div>
            <Select
              value={localFormData.typeOfVehicle}
              onValueChange={(value: string) =>
                handleLocalInputChange({
                  target: { name: "typeOfVehicle", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="Mini-Bus Taxi">Mini-Bus Taxi</SelectItem>
                <SelectItem value="Mini-Truck">Mini-Truck</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
              </SelectContent>
            </Select>
            {errors.typeOfVehicle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.typeOfVehicle}
              </p>
            )}
          </div>
          <div>
            <Input
              name="vehicleColor"
              placeholder="Vehicle Color"
              value={localFormData.vehicleColor}
              onChange={handleLocalInputChange}
              required
            />
            {errors.vehicleColor && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleColor}</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            "Uploading..."
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Upload
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
