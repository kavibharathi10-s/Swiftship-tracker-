import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Edit, Check, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";
import {
  getScheduledTripsByDriverId,
  updateScheduledTrip,
} from "@/actions/scheduledTripsActions";

export interface ScheduledTrip {
  id: string;
  fromLocation: string;
  toLocation: string;
  routeDetails: string;
  tripDate: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledTrips = () => {
  const [trips, setTrips] = useState<ScheduledTrip[]>([]);
  const { user } = useUser();

  const fetchTrips = async () => {
    if (user?.id) {
      try {
        const fetchedTrips = await getScheduledTripsByDriverId(user.id);
        setTrips(fetchedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    }
  };

  useEffect(() => {
    fetchTrips();
    const intervalId = setInterval(fetchTrips, 30000);
    return () => clearInterval(intervalId);
  }, [user?.id]);

  const handleStatusUpdate = async (
    tripId: string,
    status: "COMPLETED" | "CANCELLED"
  ) => {
    try {
      await updateScheduledTrip(tripId, { status });
      fetchTrips();
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mylg:grid-cols-1 gap-4 w-full mx-auto mt-6">
      {trips.map((trip) => (
        <Card
          key={trip.id}
          className="bg-white rounded-xl w-full overflow-hidden"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start w-full">
              <div className="flex-1 min-w-0">
                {" "}
                {/* min-w-0 prevents flex item from overflowing */}
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mr-2">
                    {trip.fromLocation} → {trip.toLocation}
                  </h3>
                  {trip.status === "SCHEDULED" && (
                    <div className="flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                          <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(trip.id, "COMPLETED")
                            }
                            className="text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(trip.id, "CANCELLED")
                            }
                            className="text-red-600"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2 break-words overflow-hidden">
                  {trip.routeDetails}
                </p>
                <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(trip.tripDate)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        trip.status
                      )}`}
                    >
                      {trip.status.charAt(0) +
                        trip.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Created {formatDate(trip.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {trips.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No scheduled trips found
        </div>
      )}
    </div>
  );
};

export default ScheduledTrips;
