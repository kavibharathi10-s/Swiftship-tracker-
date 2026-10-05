import { useEffect, useState } from "react";
import supabase from "@/app/utils/supabase";
import { getScheduledTripsWithDriver } from "@/actions/scheduledTripsActions";

type TripStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OTHER_STATUS";

type ScheduledTrip = {
  id: string;
  driverId: string;
  fromLocation: string;
  toLocation: string;
  routeDetails: string;
  tripDate: Date;
  status: TripStatus;
  driver: {
    Id: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
    vehicleType: string | null;
    isVerified: boolean;
  };
};

export const useScheduledTrips = () => {
  const [trips, setTrips] = useState<ScheduledTrip[]>([]);

  useEffect(() => {
    // Fetch initial data from Prisma
    const fetchTrips = async () => {
      try {
        const tripsData = await getScheduledTripsWithDriver();
        setTrips(tripsData || []);
      } catch (error) {
        console.error("Error loading scheduled trips:", error);
      }
    };

    fetchTrips();

    // Set up real-time subscription with Supabase
    const subscription = supabase
      .channel("scheduled-trips-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ScheduledTrips",
        },
        (payload) => {
          // Handle INSERT event (New trip added)
          setTrips((prevTrips) => [...prevTrips, payload.new as ScheduledTrip]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return trips;
};
