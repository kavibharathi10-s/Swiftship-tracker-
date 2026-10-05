"use server";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Upserts a driver in the database
 * @param driverData Object containing driver information including required clerkId, email, phoneNumber, firstName, lastName, vehicleType, and location
 * @returns Object with success status and either the upserted driver data or error message
 */
export const upsertDriver = async (driverData: {
  clerkId: string;
  email: string;
  phoneNumber: string; // Now required
  firstName: string;
  lastName: string;
  photoUrl?: string;
  idPhotoUrl?: string;
  idNumber?: string;
  licensePhotoUrl?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType: string; // Now required
  plateNumber?: string;
  vehicleRegistrationNo?: string;
  discExpiry?: string;
  discPhotoUrl?: string;
  location: string; // Now required
  vehicleImagesUrls?: string;
}) => {
  try {
    const upsertedDriver = await prisma.drivers.upsert({
      where: { Id: driverData.clerkId },
      update: {
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        location: driverData.location,
        vehicleType: driverData.vehicleType,
        ...(driverData.photoUrl && { photoUrl: driverData.photoUrl }),
        ...(driverData.idPhotoUrl && { idPhotoUrl: driverData.idPhotoUrl }),
        ...(driverData.idNumber && { idNumber: driverData.idNumber }),
        ...(driverData.licensePhotoUrl && {
          licensePhotoUrl: driverData.licensePhotoUrl,
        }),
        ...(driverData.vehicleImagesUrls && {
          vehicleImagesUrls: driverData.vehicleImagesUrls,
        }),
        ...(driverData.licenseNumber && {
          licenseNumber: driverData.licenseNumber,
        }),
        ...(driverData.licenseExpiry && {
          licenseExpiry: driverData.licenseExpiry,
        }),
        ...(driverData.plateNumber && { plateNumber: driverData.plateNumber }),
        ...(driverData.discPhotoUrl && {
          discPhotoUrl: driverData.discPhotoUrl,
        }),
        ...(driverData.vehicleRegistrationNo && {
          vehicleRegistrationNo: driverData.vehicleRegistrationNo,
        }),
        ...(driverData.discExpiry && { discExpiry: driverData.discExpiry }),
      },
      create: {
        Id: driverData.clerkId,
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        location: driverData.location,
        vehicleType: driverData.vehicleType,
        photoUrl: driverData.photoUrl || "",
        idPhotoUrl: driverData.idPhotoUrl || "",
        idNumber: driverData.idNumber,
        licensePhotoUrl: driverData.licensePhotoUrl,
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: driverData.licenseExpiry,
        plateNumber: driverData.plateNumber,
        discPhotoUrl: driverData.discPhotoUrl,
        vehicleRegistrationNo: driverData.vehicleRegistrationNo,
        discExpiry: driverData.discExpiry,
        vehicleImagesUrls: driverData.vehicleImagesUrls || "",
      },
    });
    return { success: true, data: upsertedDriver };
  } catch (error) {
    console.error("Prisma error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Retrieves all unverified drivers from the database
 * @returns Array of unverified drivers
 */
export const getUnverifiedDrivers = async () => {
  try {
    const unverifiedDrivers = await prisma.drivers.findMany({
      where: {
        isVerified: false,
      },
    });
    return unverifiedDrivers;
  } catch (error) {
    console.error("Error fetching unverified drivers:", error);
    throw error;
  }
};

/**
 * Updates the verification status of a driver
 * @param driverId The ID of the driver to update
 * @param isVerified Boolean indicating verification status (defaults to true)
 * @returns Updated driver object
 */
export const updateDriverVerification = async (
  driverId: string,
  isVerified: boolean = true
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { isVerified: isVerified },
    });
    return updatedDriver;
  } catch (error) {
    console.error("Error updating driver verification:", error);
    throw error;
  }
};

/**
 * Verifies a driver and updates their documentation details
 * @param driverId The ID of the driver to verify
 * @param data Object containing vehicle and license documentation details
 * @returns Updated driver object
 */
export const VerifyDriver = async (
  driverId: string,
  data: {
    vehicleRegistrationNo: string;
    plateNumber: string;
    discExpiry: string;
    idNumber: string;
    licenseNumber: string;
    licenseExpiry: string;
  }
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { isVerified: true, ...data },
    });
    return updatedDriver;
  } catch (error) {
    console.error("Error updating driver verification:", error);
    throw error;
  }
};

/**
 * Retrieves a driver by their ID
 * @param driverId The ID of the driver to fetch
 * @returns Object with success status and either the driver data or error message
 */
const fetchDriverById = async (driverId: string) => {
  try {
    const driver = await prisma.drivers.findUnique({
      where: {
        Id: driverId,
      },
    });

    if (!driver) {
      return { success: false, error: "Driver not found" };
    }

    return { success: true, data: driver };
  } catch (error) {
    console.error("Error fetching driver by ID:", error);
    throw error;
  }
};

export const getDriverByID = async (driverId: string) => {
  const getCachedDriver = unstable_cache(
    async () => fetchDriverById(driverId),
    [`driver-${driverId}`],
    { tags: ["driver"], revalidate: 60 } // Cache for 1 hour
  );

  return getCachedDriver();
};

/**
 * Helper function to fetch all drivers from database
 * @returns Object with success status and array of drivers or error message
 */
const fetchAllDrivers = async () => {
  const drivers = await prisma.drivers.findMany();
  if (drivers.length > 0) {
    return { success: true, data: drivers };
  } else {
    return { success: false, error: "No clients found" };
  }
};

/**
 * Retrieves cached list of all drivers
 * @returns Cached object with success status and array of drivers or error message
 */
export const getAllDrivers = async () => {
  const getCachedDrivers = unstable_cache(
    async () => fetchAllDrivers(),
    ["all-drivers"],
    { tags: ["drivers"], revalidate: 60 }
  );

  return getCachedDrivers();
};

/**
 * Retrieves all verified drivers from the database
 * @returns Object with success status and either array of verified drivers or error message
 */
export const getAllVerifiedDrivers = async () => {
  const drivers = await prisma.drivers.findMany({
    where: { isVerified: true },
  });
  if (drivers.length > 0) {
    return { success: true, data: drivers };
  } else {
    return { success: false, error: "No verified drivers found" };
  }
};

/**
 * Updates driver information
 * @param driverId The ID of the driver to update
 * @param driverData Partial object containing fields to update
 * @returns Object with success status and either updated driver data or error message
 */
export const updateDriver = async (
  driverId: string,
  driverData: Partial<any>
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: driverData,
    });

    return { success: true, data: updatedDriver };
  } catch (error) {
    return { success: false, error: "Error updating driver" };
  }
};

/**
 * Updates a driver's online status
 * @param driverId The ID of the driver to update
 * @param isOnline Boolean indicating online status
 * @returns Object with success status and either updated driver data or error message
 */
export const updateOnlineStatus = async (
  driverId: string,
  isOnline: boolean
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { isOnline: isOnline },
    });
    return { success: true, data: updatedDriver };
  } catch (error) {
    return { success: false, error: "Error updating driver" };
  }
};

/**
 * Deletes a driver from the database
 * @param driverId The ID of the driver to delete
 * @returns Object with success status and either deleted driver data or error message
 */
export const deleteDriver = async (driverId: string) => {
  try {
    const deletedDriver = await prisma.drivers.delete({
      where: { Id: driverId },
    });
    return { success: true, data: deletedDriver };
  } catch (error) {
    return { success: false, error: "Error deleting driver" };
  }
};

/**
 * Updates the vehicle images URLs for a driver
 * @param driverId The ID of the driver to update
 * @param vehicleImagesUrls String containing vehicle image URLs
 * @returns Object with success status and either updated driver data or error message
 */
export const updateVehicleImages = async (
  driverId: string,
  vehicleImagesUrls: string
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { vehicleImagesUrls },
    });
    return { success: true, data: updatedDriver };
  } catch (error) {
    return { success: false, error: "Error updating vehicle images URLs" };
  }
};
