"use server";
import { Prisma, PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();
/**
 * Creates a new scheduled trip in the database
 * @param tripData The data for creating the scheduled trip
 * @returns The newly created scheduled trip
 */
export async function createScheduledTrip(
  tripData: Prisma.ScheduledTripsCreateInput
) {
  try {
    const newTrip = await prisma.scheduledTrips.create({
      data: tripData,
    });
    return newTrip;
  } catch (err) {
    console.error("Error creating scheduled trip:", err);
    throw err;
  }
}

/**
 * Retrieves all scheduled trips from the database
 * @returns Array of all scheduled trips
 */
export async function getScheduledTrips() {
  try {
    const trips = await prisma.scheduledTrips.findMany();
    return trips;
  } catch (err) {
    console.error("Error fetching scheduled trips:", err);
    throw err;
  }
}

/**
 * Retrieves a single scheduled trip by its ID
 * @param id The ID of the scheduled trip to retrieve
 * @returns The scheduled trip if found, null otherwise
 */
export async function getScheduledTripById(id: string) {
  try {
    const trip = await prisma.scheduledTrips.findUnique({
      where: {
        id: id,
      },
    });
    return trip;
  } catch (err) {
    console.error("Error fetching scheduled trip:", err);
    throw err;
  }
}

/**
 * Updates an existing scheduled trip
 * @param id The ID of the scheduled trip to update
 * @param updatedData The new data to update the trip with
 * @returns The updated scheduled trip
 */
export async function updateScheduledTrip(
  id: string,
  updatedData: Prisma.ScheduledTripsUpdateInput
) {
  try {
    const updatedTrip = await prisma.scheduledTrips.update({
      where: {
        id: id,
      },
      data: updatedData,
    });
    return updatedTrip;
  } catch (err) {
    console.error("Error updating scheduled trip:", err);
    throw err;
  }
}

/**
 * Helper function to fetch scheduled trips for a specific driver
 * @param driverId The ID of the driver
 * @returns Array of scheduled trips for the specified driver
 */
const fetchScheduledTripsByDriverId = async (driverId: string) => {
  try {
    const trips = await prisma.scheduledTrips.findMany({
      where: {
        driver: {
          Id: driverId,
        },
        status: "SCHEDULED",
      },
    });
    return trips;
  } catch (err) {
    console.error("Error fetching scheduled trips:", err);
    throw err;
  }
};

/**
 * Retrieves cached scheduled trips for a specific driver
 * @param driverId The ID of the driver
 * @returns Cached array of scheduled trips for the specified driver
 */
export async function getScheduledTripsByDriverId(driverId: string) {
  const getCachedTrips = unstable_cache(
    async () => fetchScheduledTripsByDriverId(driverId),
    [`driver-scheduled-trips-${driverId}`],
    { tags: ["scheduledTrips"], revalidate: 60 }
  );

  return getCachedTrips();
}

/**
 * Deletes a scheduled trip from the database
 * @param id The ID of the scheduled trip to delete
 * @returns The deleted scheduled trip
 */
export async function deleteScheduledTrip(id: string) {
  try {
    const deletedTrip = await prisma.scheduledTrips.delete({
      where: {
        id: id,
      },
    });
    return deletedTrip;
  } catch (err) {
    console.error("Error deleting scheduled trip:", err);
    throw err;
  }
}

/**
 * Retrieves all scheduled trips with their associated driver information
 * @returns Array of scheduled trips with driver details
 */
export const getScheduledTripsWithDriver = async () => {
  try {
    const trips = await prisma.scheduledTrips.findMany({
      where: {
        status: "SCHEDULED",
      },
      include: {
        driver: {
          select: {
            Id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            vehicleType: true,
            isVerified: true,
          },
        },
      },
      orderBy: {
        tripDate: "asc",
      },
    });

    return trips.map((trip) => ({
      id: trip.id,
      driverId: trip.driverId,
      fromLocation: trip.fromLocation,
      toLocation: trip.toLocation,
      routeDetails: trip.routeDetails,
      tripDate: trip.tripDate,
      status: trip.status,
      driver: {
        Id: trip.driver.Id,
        firstName: trip.driver.firstName,
        lastName: trip.driver.lastName,
        photoUrl: trip.driver.photoUrl,
        vehicleType: trip.driver.vehicleType,
        isVerified: trip.driver.isVerified,
      },
    }));
  } catch (error) {
    console.error("Error fetching scheduled trips with driver:", error);
    throw error;
  }
};
