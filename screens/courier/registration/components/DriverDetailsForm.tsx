"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useDriverDetails from "@/screens/courier/registration/utils/DriverDetails";
import Loading from "@/screens/courier/registration/ui/Loading";
import Image from "next/image";

interface ImageDisplayProps {
  url: string | null | undefined;
  alt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url, alt }) =>
  url ? (
    <Image
      src={url}
      alt={alt}
      className="w-full h-40 object-cover rounded-md shadow-sm"
      width={500}
      height={500}
    />
  ) : (
    <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
      <span className="text-gray-400">No image available</span>
    </div>
  );

export default function DriverDetailsForm(): JSX.Element {
  const { driverData, loading, error, handleConfirm, handleEdit } =
    useDriverDetails();

// const addUserRole = async () => {
//   const newRole = await createUserRole({ userId: driverData.Id, driver: true, client: false });
//   console.log(newRole);
// };

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-screen pt-24">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  if (!driverData)
    return (
      <div className="flex justify-center items-center h-screen">
        No driver data found
      </div>
    );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-2xl">Driver Details</CardTitle>
        <CardDescription>View and manage driver's information</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={driverData.firstName}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={driverData.lastName}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={driverData.email}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={driverData.phoneNumber || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={driverData.location || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              value={driverData.idNumber || ""}
              readOnly
              className="bg-gray-50"
            />
          </div> */}
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={driverData.licenseNumber || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseExpiry">License Expiry</Label>
            <Input
              id="licenseExpiry"
              value={driverData.licenseExpiry || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Input
              id="vehicleType"
              value={
                driverData.vehicleType
                  ? driverData.vehicleType.replace(/,/g, "")
                  : ""
              }
              readOnly
              className="bg-gray-50"
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="plateNumber">Plate Number</Label>
            <Input
              id="plateNumber"
              value={driverData.plateNumber || ""}
              readOnly
              className="bg-gray-50"
            />
          </div> */}
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="Vehicle Registration Number">Vehicle Registration Number</Label>
            <Input
              id="vehicleRegistrationNo"
              value={driverData.vehicleRegistrationNo || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discExpiry">Disc Expiry</Label>
            <Input
              id="discExpiry"
              value={driverData.discExpiry || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Driver Photo</Label>
            <ImageDisplay url={driverData.photoUrl} alt="Driver Photo" />
          </div>
          <div className="space-y-2">
            <Label>ID Photo</Label>
            <ImageDisplay url={driverData.idPhotoUrl} alt="ID Photo" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>License Photo</Label>
            <ImageDisplay
              url={driverData.licensePhotoUrl}
              alt="License Photo"
            />
          </div>
          <div className="space-y-2">
            <Label>Disc Photo</Label>
            <ImageDisplay url={driverData.discPhotoUrl} alt="Disc Photo" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 border-t p-6">
        <Button
          onClick={handleEdit}
          className="w-full md:w-1/2 mr-2 bg-white text-black hover:bg-gray-100 border border-black"
        >
          Edit
        </Button>

        <Button
          className="w-full md:w-1/2 ml-2 bg-black text-white hover:bg-gray-800"
          onClick={handleConfirm}
          disabled={driverData.isVerified || loading}
        >
          {driverData.isVerified ? "Verified" : "Proceed"}
        </Button>
      </CardFooter>
    </Card>
  );
}
