"use server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates multiple location records for a driver
 * @param locationBuffer Array of location data including driver ID, coordinates, accuracy and timestamp
 * @returns Object with success status and created records data or error message
 */
export const createLocation = async (
  locationBuffer: {
    driverId: string;
    latitude: number; // Float
    longitude: number; // Float
    accuracy: number;
    timestamp: Date;
  }[]
) => {
  try {
    const result = await prisma.location.createMany({
      data: locationBuffer.map((loc) => ({
        driverId: loc.driverId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        time: loc.timestamp,
      })),
    });
    if (result.count > 0) return { success: true, data: result };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error creating location" + error };
  }
};

/**
 * Retrieves all locations and latest location for a specific driver
 * @param driverId The ID of the driver
 * @returns Object containing all locations and latest location or error message
 */
export const getLocation = async (driverId: string) => {
  try {
    // Get all locations
    const locations = await prisma.location.findMany({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    // Get latest location
    const latestLocation = await prisma.location.findFirst({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    if (locations.length > 0) {
      return {
        success: true,
        data: {
          all: locations,
          latest: latestLocation,
        },
      };
    } else {
      return { success: false, error: "No locations found for this driver" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving location: ${error}` };
  }
};

/**
 * Retrieves all locations for a specific driver
 * @param driverId The ID of the driver
 * @returns Object containing all locations or error message
 */
export const getAllLocations = async (driverId: string) => {
  try {
    const locations = await prisma.location.findMany({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    if (locations.length > 0) {
      return { success: true, data: locations };
    } else {
      return { success: false, error: "No locations found for this driver" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving locations: ${error}` };
  }
};

/**
 * Retrieves the most recent location for a specific driver
 * @param driverId The ID of the driver
 * @returns Object containing the latest location or error message
 */
export const getLatestLocation = async (driverId: string) => {
  try {
    const location = await prisma.location.findFirst({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    if (location) {
      return { success: true, data: location };
    } else {
      return { success: false, error: "No location found for this driver" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving location: ${error}` };
  }
};

/**
 * Deletes a specific location record
 * @param locationId The ID of the location to delete
 * @returns Object with success status and deleted location data or error message
 */
export const deleteLocation = async (locationId: string) => {
  try {
    const deletedlocation = await prisma.location.delete({
      where: { Id: locationId },
    });
    return { success: true, data: deletedlocation };
  } catch (error) {
    return { success: false, error: "Error deleting location" + error };
  }
};
