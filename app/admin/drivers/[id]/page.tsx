"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Truck, X } from "lucide-react";
import {
  getDriverByID,
  updateDriverVerification,
  VerifyDriver,
} from "@/actions/driverActions";
import { toast } from "@/hooks/use-toast";
import GetDriverInfoForm from "@/screens/admin/SubmitDriverInfoForm";

type Driver = {
  Id: string;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  vehicleType: string | null;
  dateCreated: string;
  dateUpdated: string;
  vehicleRegistrationNo: string | null;
  idNumber: string | null;
  licenseExpiry: string | null;
  licenseNumber: string | null;
  plateNumber: string | null;
  discExpiry: string | null;
  discPhotoUrl: string | null;
  licensePhotoUrl: string | null;
  location: string | null;
  isVerified: boolean;
};

export default function DriverPage() {
  const { id } = useParams();
  const [submitInfo, setSubmitInfo] = useState(false);
  const [driver, setDriver] = useState<Driver>({
    Id: "",
    email: "",
    phoneNumber: null,
    firstName: "",
    lastName: "",
    photoUrl: "",
    idPhotoUrl: "",
    vehicleType: null,
    dateCreated: "",
    dateUpdated: "",
    vehicleRegistrationNo: null,
    idNumber: null,
    licenseExpiry: null,
    licenseNumber: null,
    plateNumber: null,
    discExpiry: null,
    discPhotoUrl: null,
    licensePhotoUrl: null,
    location: null,
    isVerified: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDriver = async () => {
      const driverResponse = await getDriverByID(id as string);
      setIsLoading(false);
      if (driverResponse.data?.Id) {
        setDriver({
          ...driverResponse.data,
          dateCreated: driverResponse.data.dateCreated.toISOString(),
          dateUpdated: driverResponse.data.dateUpdated.toISOString(),
        });
      } else {
        toast({
          title: "Error",
          description: "Driver not found",
          variant: "destructive",
        });
      }
    };
    getDriver();
  }, [id]);

  const handleVerify = async (userId: string, user: any, data: any) => {
    const response = await VerifyDriver(userId, data);

    if (response.isVerified) {
      setDriver({
        ...response,
        dateCreated: response.dateCreated.toISOString(),
        dateUpdated: response.dateUpdated.toISOString(),
      });
      toast({
        description: "Driver verified successfully",
      });
    } else {
      toast({
        description: "Error verifying driver, please try again",
        variant: "destructive",
      });
    }
    setSubmitInfo(false);
  };

  const handleReject = () => {
    // In a real application, you would handle the rejection process here
    alert("Driver rejected");
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          {/* Animated Delivery Truck */}
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      )}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Driver Details</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {driver.firstName} {driver.lastName}
              </span>
              <Badge variant={driver.isVerified ? "secondary" : "default"}>
                {driver.isVerified ? "Verified" : "Pending"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Email:</p>
                <p>{driver.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>{driver.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Vehicle Type:</p>
                <p>{driver.vehicleType || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Vehicle Registration Number:</p>
                <p>{driver.vehicleRegistrationNo || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">ID Number:</p>
                <p>{driver.idNumber || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">License Number:</p>
                <p>{driver.licenseNumber || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">License Expiry:</p>
                <p>{driver.licenseExpiry || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Plate Number:</p>
                <p>{driver.plateNumber || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">DISC Expiry:</p>
                <p>{driver.discExpiry || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p>{driver.location || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Date Created:</p>
                <p>{driver.dateCreated}</p>
              </div>
              <div>
                <p className="font-semibold">Date Updated:</p>
                <p>{driver.dateUpdated}</p>
              </div>
            </div>
          </CardContent>
          {!driver.isVerified && (
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              {submitInfo ? (
                <div className="w-full flex justify-center">
                  <GetDriverInfoForm
                    driverId={driver.Id}
                    user={driver}
                    Submit={handleVerify}
                  />
                </div>
              ) : (
                <>
                  <Button variant="destructive" onClick={handleReject}>
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button variant="default" onClick={() => setSubmitInfo(true)}>
                    <Check className="mr-2 h-4 w-4" /> Verify
                  </Button>
                </>
              )}
            </CardFooter>
          )}
        </Card>
        {!driver.isVerified && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>ID Document</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={driver.idPhotoUrl}
                  alt="ID Document"
                  className="w-full h-auto object-cover rounded-md"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Driver's License</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={driver.licensePhotoUrl || "/placeholder.svg"}
                  alt="Driver's License"
                  className="w-full h-auto object-cover rounded-md"
                />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>DISC Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={driver.discPhotoUrl || "/placeholder.svg"}
                  alt="DISC Photo"
                  className="w-full h-auto object-cover rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
