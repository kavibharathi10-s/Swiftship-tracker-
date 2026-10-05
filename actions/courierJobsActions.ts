"use server";
import { PrismaClient } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new courier job in the database
 * @param jobData FormData containing all the job details
 * @returns Object with success status and either job data or error message
 */
export const createJob = async (jobData: FormData) => {
  try {
    // Extract values from FormData
    const title = jobData.get("title") as string | null;
    const description = jobData.get("description") as string | null;
    const budget = jobData.get("budget") as string | null;
    const clientId = jobData.get("clientId") as string | null;
    const dropOff = jobData.get("dropOff") as string | null;
    const pickUp = jobData.get("pickUp") as string | null;
    const districtDropOff = jobData.get("districtDropoff") as string | null;
    const districtPickUp = jobData.get("districtPickup") as string | null;
    const parcelSize = jobData.get("parcelSize") as string | null;
    const pickupPhoneNumber = jobData.get("pickupPhoneNumber") as string | null;
    const dropoffPhoneNumber = jobData.get("dropoffPhoneNumber") as
      | string
      | null;
    const dropOffEmail = jobData.get("dropoffEmail") as string | null;
    const collectionDate = jobData.get("collectionDate") as string | null;
    const isDirect = jobData.get("isDirect") === "true" ? true : false; // Default to false if not provided
    const weight = jobData.get("weight") as string | null;
    const dimensions = jobData.get("dimensions") as string | null;
    const suitableVehicles = jobData.get("suitableVehicles") as string | null;
    const packageType = jobData.get("packageType") as string | null;
    const isPackaged = jobData.get("isPackaged") ? true : false; // Convert to boolean
    const recipientName = jobData.get("recipientName") as string | null;
    const recipientGender = jobData.get("recipientGender") as string | null;
    const paymentMode = jobData.get("paymentMode") as string | null;
    const handlingRequirements = jobData.get("handlingRequirements") as
      | string
      | null;
    const deliveryDate = jobData.get("deliveryDate") as string | null;

    // Ensure none of the required fields are null or undefined
    if (!clientId) {
      return { success: false, error: "Client ID is required." };
    }

    // Create a new job in the database
    const newJob = await prisma.courierJobs.create({
      data: {
        Title: title,
        Description: description,
        Budget: budget,
        clientId: clientId,
        DropOff: dropOff,
        PickUp: pickUp,
        districtDropOff: districtDropOff,
        districtPickUp: districtPickUp,
        parcelSize: parcelSize,
        pickupPhoneNumber: pickupPhoneNumber,
        dropoffPhoneNumber: dropoffPhoneNumber,
        dropOffEmail: dropOffEmail,
        collectionDate: collectionDate ? new Date(collectionDate) : undefined, // Convert to Date
        packageStatus: "unclaimed",
        weight: weight,
        dimensions: dimensions,
        suitableVehicles: suitableVehicles,
        isDirect: isDirect, // Add the isDirect flag to the job data
        packageType: packageType,
        isPackaged: isPackaged,
        recipientName: recipientName,
        recipientGender: recipientGender,
        paymentMethod: paymentMode,
        parcelHandling: handlingRequirements,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined, // Convert to Date
      },
    });

    // Revalidate the cache for the client dashboard path
    revalidateTag("courierJobs");
    return { success: true, data: newJob };
  } catch (error: any) {
    console.error("Detailed error creating job:", error); // Log full error message
    return { success: false, error: `Error creating job: ${error.message}` }; // Return detailed error
  }
};

/**
 * Helper function to fetch all unclaimed and non-direct courier jobs
 * @returns Object with success status and jobs array or error message
 */
const fetchAllJobs = async () => {
  try {
    const jobs = await prisma.courierJobs.findMany({
      include: { client: true },
      where: {
        packageStatus: "unclaimed",
        isDirect: false,
      },
    });
    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return { success: false, error: "Error retrieving jobs." };
  }
};

/**
 * Retrieves cached unclaimed and non-direct courier jobs
 * @returns Cached object with success status and jobs array or error message
 */
export const getAllJobs = async () => {
  const getCachedJobs = unstable_cache(
    async () => fetchAllJobs(),
    ["all-unclaimed-jobs"],
    { tags: ["courierJobs"], revalidate: 60 }
  );

  return getCachedJobs();
};

/**
 * Helper function to fetch filtered jobs for a specific client
 * @param clientId The ID of the client
 * @returns Object with success status and filtered jobs array or error message
 */
const fetchFilteredJobs = async (clientId: string) => {
  try {
    const jobs = await prisma.courierJobs.findMany({
      where: { clientId: clientId },
      include: {
        client: true,
        DirectRequest: true,
      },
    });
    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return { success: false, error: "Error retrieving jobs." };
  }
};

/**
 * Retrieves cached jobs for a specific client
 * @param clientId The ID of the client
 * @returns Cached object with success status and filtered jobs array or error message
 */
export const getAllJobsFiltered = async (clientId: string) => {
  const getCachedJobs = unstable_cache(
    async () => fetchFilteredJobs(clientId),
    [`client-jobs-${clientId}`],
    { tags: ["courierJobs"], revalidate: 60 }
  );

  return getCachedJobs();
};

/**
 * Retrieves a specific job by its ID
 * @param jobId The ID of the job to retrieve
 * @returns Object with success status and either job data or error message
 */
export const getJobById = async (jobId: string) => {
  try {
    const job = await prisma.courierJobs.findUnique({
      where: { Id: jobId },
    });
    if (job) {
      return { success: true, data: job };
    } else {
      return { success: false, error: "Job not found" };
    }
  } catch (error: any) {
    console.error("Error retrieving job:", error.message);
    return { success: false, error: "Error retrieving job." };
  }
};

/**
 * Updates the payment status of a job
 * @param jobId The ID of the job to update
 * @param isPaid Boolean indicating whether the job is paid
 * @returns Object with success status and either updated job data or error message
 */
export async function updateJobPaymentStatus(jobId: string, isPaid: boolean) {
  try {
    const updatedJob = await prisma.courierJobs.update({
      where: { Id: jobId },
      data: { isPaid: isPaid },
    });
    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Failed to update job payment status:", error);
    return { success: false, error: "Failed to update job payment status" };
  }
}

/**
 * Updates a job's details
 * @param jobId The ID of the job to update
 * @param jobData Partial object containing the fields to update
 * @returns Object with success status and either updated job data or error message
 */
export const updateJob = async (jobId: string, jobData: Partial<any>) => {
  try {
    const updatedJob = await prisma.courierJobs.update({
      where: { Id: jobId },
      data: jobData,
    });
    return { success: true, data: updatedJob };
  } catch (error: any) {
    console.error("Error updating job:", error.message);
    return { success: false, error: "Error updating job." };
  }
};

/**
 * Deletes a job from the database
 * @param jobId The ID of the job to delete
 * @returns Object with success status and either deleted job data or error message
 */
export const deleteJob = async (jobId: string) => {
  try {
    const deletedJob = await prisma.courierJobs.delete({
      where: { Id: jobId },
    });
    return { success: true, data: deletedJob };
  } catch (error: any) {
    console.error("Error deleting job:", error.message);
    return { success: false, error: "Error deleting job." };
  }
};

/**
 * Updates the package status of a job
 * @param id The ID of the job to update
 * @param status The new status to set
 * @returns Updated job data or undefined if error occurs
 */
export async function updateJobStatus(id: string, status: string) {
  try {
    const updatedJob = await prisma.courierJobs.update({
      where: { Id: id },
      data: { packageStatus: status },
    });
    return updatedJob;
  } catch (error) {
    console.error("Error updating Job status:", error);
  }
}
