import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  getDriverByID,
  updateDriverVerification,
} from "@/actions/driverActions";
import { useRouter } from "next/navigation";

import {
  createUserRole,
  updateUserRole,
  getUserRole,
  deleteUserRole,
} from "@/actions/roleAction";
import { ArrowLeftToLine } from "lucide-react";

interface DriverData {
  Id: string;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  vehicleType: string | null;
  dateCreated: Date;
  dateUpdated: Date;
  discPhotoUrl: string | null;
  vehicleRegistrationNo: string | null;
  discExpiry: string | null;
  idNumber: string | null;
  licensePhotoUrl: string | null;
  licenseExpiry: string | null;
  licenseNumber: string | null;
  plateNumber: string | null;
  location: string | null;
  isVerified: boolean;
  Contacts: Array<{
    Id: string;
    driverId: string;
    clientId: string;
    isConversating: boolean;
  }>;
  Messages: any[];
  clientRequests: any[];
}

export default function useDriverDetails() {
  const { userId } = useAuth();
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDriverData = async () => {
      if (userId) {
        try {
          const driver = await getDriverByID(userId);
          if (driver && driver.success && driver.data) {
            setDriverData({
              ...driver.data,
              vehicleRegistrationNo: driver.data.vehicleRegistrationNo ?? null,
              Contacts: [],
              Messages: [],
              clientRequests: [],
            } as DriverData);
          } else {
            setDriverData(null);
          }
        } catch (err) {
          setError("Failed to fetch driver data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDriverData();
  }, [userId]);

  const handleConfirm = async () => {
    if (driverData && userId) {
      try {
        setLoading(true);
        const updatedDriver = await updateDriverVerification(
          driverData.Id,
          false
        );
        setDriverData({
          ...updatedDriver,
          vehicleRegistrationNo:
            (updatedDriver as any).vehicleRegistrationNo ?? null,
          Contacts: [],
          Messages: [],
          clientRequests: [],
        } as DriverData);

        const createRole = await createUserRole({
          userId,
          driver: true,
          client: false,
        });
        if (createRole) {
          console.log("User role created successfully");
        } else {
          console.log("User role creation failed");
        }

        alert(
          "Thank you for the submission of your documents. They will be verified shortly."
        );
        router.push("/driver/dashboard/find-jobs");
      } catch (err) {
        setError("Failed to verify driver");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleEdit = () => {
    router.push("/onboarding/driver-onboarding/registration");
  };

  return {
    driverData,
    loading,
    error,
    handleConfirm,
    handleEdit,
  };
}
