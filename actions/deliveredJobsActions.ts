"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates a new delivered job record
 * @param data Object containing activeJobId, locationId, and proofOfDeliveryUrl
 * @returns The created delivered job with ActiveJob and Location relations
 */
export async function createDeliveredJob(data: {
  activeJobId: string;
  locationId: string;
  proofOfDeliveryUrl: string;
}) {
  try {
    const deliveredJob = await prisma.deliveredJobs.create({
      data: {
        activeJobId: data.activeJobId,
        locationId: data.locationId,
        proofOfDeliveryUrl: data.proofOfDeliveryUrl,
        isDriverConfirmed: true,
        isClientConfirmed: false,
      },
      include: {
        ActiveJob: true,
        Location: true,
      },
    });

    return deliveredJob;
  } catch (error) {
    console.error("Error creating delivered job:", error);
    throw error;
  }
}

/**
 * Updates a delivered job to mark it as confirmed by the client
 * @param deliveredJobId The ID of the delivered job to confirm
 * @returns The updated delivered job
 */
export async function confirmClientDelivery(deliveredJobId: string) {
  try {
    const updatedJob = await prisma.deliveredJobs.update({
      where: {
        Id: deliveredJobId,
      },
      data: {
        isClientConfirmed: true,
      },
    });

    return updatedJob;
  } catch (error) {
    console.error("Error confirming delivery for client:", error);
    throw error;
  }
}

/**
 * Retrieves a delivered job by its associated active job ID
 * @param activeJobId The ID of the active job
 * @returns The delivered job if found
 */
export async function getDeliveryByActiveJobId(activeJobId: string) {
  try {
    const deliveredJob = await prisma.deliveredJobs.findFirst({
      where: {
        activeJobId: activeJobId,
      },
    });
    return deliveredJob;
  } catch (error) {
    console.error("Error fetching delivered job by activeJobId:", error);
    throw error;
  }
}

/**
 * Retrieves detailed information about a delivered job
 * @param deliveredJobId The ID of the delivered job
 * @returns The delivered job with related ActiveJob (including Client, Driver, CourierJob) and Location
 */
export async function getDeliveredJobDetails(deliveredJobId: string) {
  try {
    const deliveredJobs = await prisma.deliveredJobs.findMany({
      where: {
        Id: deliveredJobId,
      },
      include: {
        ActiveJob: {
          include: {
            Client: true,
            Driver: true,
            CourierJob: true,
          },
        },
        Location: true,
      },
    });

    return deliveredJobs;
  } catch (error) {
    console.error("Error fetching delivered job details:", error);
    throw error;
  }
}

/**
 * Retrieves all delivered jobs for a specific driver
 * @param driverId The ID of the driver
 * @returns Array of delivered jobs with ActiveJob and Location relations
 */
export async function getDeliveredJobsByDriver(driverId: string) {
  try {
    const deliveredJobs = await prisma.deliveredJobs.findMany({
      where: {
        ActiveJob: {
          driverId: driverId,
        },
      },
      include: {
        ActiveJob: true,
        Location: true,
      },
    });

    return deliveredJobs;
  } catch (error) {
    console.error("Error fetching delivered jobs for driver:", error);
    throw error;
  }
}

/**
 * Retrieves all delivered jobs with their related information
 * @returns Array of delivered jobs with related ActiveJob (including Client, Driver, CourierJob) and Location, sorted by delivery date
 */
export const getAllDeliveries = async () => {
  try {
    const deliveredJobs = await prisma.deliveredJobs.findMany({
      include: {
        ActiveJob: {
          include: {
            Client: true,
            Driver: true,
            CourierJob: true,
          },
        },
        Location: true,
      },
      orderBy: {
        deliveryDate: "desc", // Sorting by deliveryDate (latest to oldest)
      },
    });
    return deliveredJobs;
  } catch (error) {
    console.error("Error fetching all deliveries:", error);
    throw new Error("Failed to fetch all deliveries");
  }
};
