"use server";
import { PrismaClient } from "@prisma/client";
import notifyAboutJob from "./knock";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new active job and notifies the assigned driver
 * @param data Object containing job details
 * @param data.courierJobId The ID of the courier job
 * @param data.driverId The ID of the assigned driver
 * @param data.clientId The ID of the client
 * @param data.startDate The start date of the job
 * @returns The newly created active job with included relations, or undefined if creation fails
 */
export async function createActiveJob(data: {
  courierJobId: string;
  driverId: string;
  clientId: string;
  startDate: string;
}) {
  // remember to send notification to driver that they have been hired for a new job here
  try {
    const newJob = await prisma.activeJobs.create({
      data: {
        courierJobId: data.courierJobId,
        driverId: data.driverId,
        clientId: data.clientId,
        startDate: data.startDate,
      },
      include: {
        Client: true,
        Driver: true,
        CourierJob: true,
      },
    });

    if (newJob.Id) {
      await notifyAboutJob(
        newJob.Driver,
        newJob.CourierJob,
        "",
        newJob.Client.firstName || "" + newJob.Client.lastName || ""
      );
    }
    return newJob;
  } catch (error) {
    console.error("Error creating ActiveJob:", error);
  }
}

/**
 * Retrieves all active jobs with their related data
 * @returns Array of active jobs including CourierJob, Driver, and Client relations, or undefined if fetch fails
 */
export async function getActiveJobs() {
  try {
    const jobs = await prisma.activeJobs.findMany({
      include: {
        CourierJob: true,
        Driver: true,
        Client: true,
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching ActiveJobs:", error);
  }
}

/**
 * Helper function to fetch active jobs for a specific driver
 * @param driverId The unique identifier of the driver
 * @returns Array of active jobs including CourierJob, Driver, and Client relations
 */
const fetchActiveJobsByDriverId = async (driverId: string) => {
  try {
    const jobs = await prisma.activeJobs.findMany({
      where: { driverId: driverId },
      include: {
        CourierJob: true,
        Driver: true,
        Client: true,
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching all ActiveJobs by driverId:", error);
  }
};

/**
 * Retrieves cached active jobs for a specific driver
 * @param driverId The unique identifier of the driver
 * @returns Cached array of active jobs including CourierJob, Driver, and Client relations
 */
export async function getAllActiveJobsByDriverId(driverId: string) {
  const getCachedJobs = unstable_cache(
    async () => fetchActiveJobsByDriverId(driverId),
    [`driver-active-jobs-${driverId}`],
    { tags: ["activeJobs"], revalidate: 60 }
  );

  return getCachedJobs();
}

/**
 * Retrieves all active jobs for a specific client
 * @param clientId The unique identifier of the client
 * @returns Array of active jobs for the specified client, or undefined if fetch fails
 */
export async function getAllActiveJobsByClientId(clientId: string) {
  try {
    const jobs = await prisma.activeJobs.findMany({
      where: { clientId: clientId },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching all ActiveJobs by clientId:", error);
  }
}

/**
 * Retrieves an active job by its courier job ID
 * @param courierJobId The unique identifier of the courier job
 * @returns The active job matching the courier job ID, or null if not found or fetch fails
 */
export async function getActiveJobByCourierJobId(courierJobId: string) {
  try {
    const job = await prisma.activeJobs.findFirst({
      where: { courierJobId: courierJobId },
    });
    return job;
  } catch (error) {
    console.error("Error fetching ActiveJob by courierJobId:", error);
    return null;
  }
}

/**
 * Updates the status of an active job and related courier job
 * @param id The unique identifier of the active job
 * @param status The new status to set for the job
 * @returns The updated active job, or throws an error if update fails
 */
export async function updateActiveJobStatus(id: string, status: string) {
  try {
    const updatedData: { jobStatus: string; endDate?: string } = {
      jobStatus: status,
    };
    console.log("Id", id);
    console.log("Status", status);

    if (status === "delivered") {
      updatedData.endDate = new Date().toISOString();
    }

    const updatedJob = await prisma.activeJobs.update({
      where: { Id: id },
      data: updatedData,
    });
    console.log("Updated Job:", updatedJob);

    if (updatedJob.courierJobId) {
      await prisma.courierJobs.update({
        where: { Id: updatedJob.courierJobId },
        data: { packageStatus: status },
      });
    }

    return updatedJob;
  } catch (error) {
    console.error("Error updating Job status:", error);
    throw error;
  }
}

/**
 * Deletes an active job by its ID
 * @param id The unique identifier of the active job to delete
 * @returns The deleted active job, or undefined if deletion fails
 */
export async function deleteActiveJob(id: string) {
  try {
    const deletedJob = await prisma.activeJobs.delete({
      where: { Id: id },
    });
    return deletedJob;
  } catch (error) {
    console.error("Error deleting ActiveJob:", error);
  }
}
