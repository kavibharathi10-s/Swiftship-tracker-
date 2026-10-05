"use client";
import { useState } from "react";
import { useScheduledTrips } from "@/screens/client/utils/useScheduledTrips";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import DropdownMenuComponent from "./DropDownMenu";

type Driver = {
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  vehicleType: string | null;
  isVerified: boolean;
};

type Trip = {
  id: string;
  fromLocation: string;
  toLocation: string;
  tripDate: Date;
  driver: Driver;
  routeDetails: string;
};

const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const removeCommas = (text: string | null) => {
  return text ? text.replace(/,/g, "") : "No vehicle type specified";
};

const TripCard = () => {
  const trips = useScheduledTrips();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter trips based on search term
  const filteredTrips = trips.filter((trip) => {
    const tripDate = formatDate(trip.tripDate).toLowerCase();
    const fromLocation = trip.fromLocation.toLowerCase();
    const toLocation = trip.toLocation.toLowerCase();
    const driverName =
      `${trip.driver.firstName} ${trip.driver.lastName}`.toLowerCase();

    return (
      fromLocation.includes(searchTerm.toLowerCase()) ||
      toLocation.includes(searchTerm.toLowerCase()) ||
      driverName.includes(searchTerm.toLowerCase()) ||
      tripDate.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 w-[100%]">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Scheduled Trips
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by location, driver name, or date"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
      />

      {filteredTrips.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-500">No scheduled trips available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className="
              transition-all 
              duration-300 
              transform 
              lg:hover:scale-105 hover:scale-100 hover:shadow-2xl rounded-xl border border-gray-200 overflow-hidden"
            >
              <CardHeader className="p-4 bg-slate-600 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <div className="flex-1">
                        <p className="text-sm opacity-90">From</p>
                        <p className="font-medium">{trip.fromLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <div className="flex-1">
                        <p className="text-sm opacity-90">To</p>
                        <p className="font-medium">{trip.toLocation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <DropdownMenuComponent driverId={trip.driver.Id} />
                  </div>
                </div>
              </CardHeader>

              <div className="p-4 space-y-4">
                <div className="flex flex-row text-sm text-gray-600">
                  <Calendar className="w-4 h-4" /> {formatDate(trip.tripDate)}
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                    <AvatarImage
                      src={trip.driver.photoUrl || undefined}
                      alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {`${trip.driver.firstName[0]}${trip.driver.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900">
                        {trip.driver.firstName} {trip.driver.lastName}
                      </p>
                      {trip.driver.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {removeCommas(trip.driver.vehicleType)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}{" "}
        </div>
      )}
    </div>
  );
};

export default TripCard;
