"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDriverByID } from "@/actions/driverActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploadCard from "@/screens/courier/registration/components/ImageUploadCard";
import { CheckCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import useclientRegistration from "@/screens/client/registration/utils/clientRegistration";
import { PhoneInput, ValidationResult } from "@/screens/global/phone-input";
import { useAuth } from "@clerk/nextjs";
// Zod schema for validation
const clientRegistrationSchema = z.object({
  idDocuments: z.instanceof(File, { message: "Identity document is required" }),
});

export default function ClientRegistrationForm() {
  const {
    files,
    existingImages,
    formData,
    loading,
    isLoading,
    handleFileChange,
    handleInputChange,
    handleUpload,
  } = useclientRegistration();
  const [phoneValidation, setPhoneValidation] =
    useState<ValidationResult | null>(null);
  const { userId } = useAuth();
  // State to manage validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // useEffect(() => {
  //   const fetchDriverData = async () => {
  //     if (userId) {
  //       const driver = await getDriverByID(userId);
  //       if (driver.success && driver.data) {
  //         // Convert idPhotoUrl to File
  //         if (driver.data.idPhotoUrl) {
  //           const file = await urlToFile(
  //             driver.data.idPhotoUrl,
  //             "id-document.jpg"
  //           );
  //           handleFileChange("id-documents")(file);
  //           console.log(existingImages["id-documents"]);
  //         }
  //         // Set the existing phone number
  //         handleInputChange({
  //           target: {
  //             name: "phoneNumber",
  //             value: driver.data.phoneNumber || "",
  //           },
  //         } as React.ChangeEvent<HTMLInputElement>);
  //       }
  //     }
  //   };

  //   fetchDriverData();
  // }, [userId, handleFileChange, handleInputChange]);

  async function urlToFile(url: string, fileName: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  const handleSubmit = async () => {
    try {
      // Validate file upload
      clientRegistrationSchema.parse({ idDocuments: files["id-documents"] });

      // Validate phone number
      if (!phoneValidation?.success) {
        setErrors({
          phoneNumber: phoneValidation?.error || "Invalid phone number",
        });
        return;
      }

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

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardHeader>
        <CardContent className="p-6 shadow-md">
          <div className="grid gap-6 ">
            <Skeleton className="h-60 w-full" />
          </div>
          <div className="mt-6 grid gap-4 ">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-12 w-full mt-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-3xl font-bold text-gray-900">
          Profile Verification
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Upload the required documents and provide additional information to be
          verified and start working with us.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 shadow-md">
        <div className="">
          <ImageUploadCard
            folder="id-document"
            cardTitle="ID Photo"
            onFileChange={handleFileChange("id-documents")}
            existingImageUrl={existingImages["id-documents"]}
          />
        </div>
        <div className="mt-6 grid gap-4 ">
          <div>
            <PhoneInput
              value={formData.phoneNumber}
              onValueChange={({ phoneNumber, validation }) => {
                setPhoneValidation(validation);
                handleInputChange({
                  target: {
                    name: "phoneNumber",
                    value: phoneNumber as string,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            {phoneValidation && !phoneValidation.success && (
              <p className="text-red-500 text-sm mt-1">
                {phoneValidation.error}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Submit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
