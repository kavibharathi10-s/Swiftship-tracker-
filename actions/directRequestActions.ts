"use server";
import { PrismaClient, DirectRequest, Contacts } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

// Type for the createDirectRequest response
type CreateDirectRequestResponse = {
  success: boolean;
  data?: DirectRequest;
  error?: string;
};

/**
 * Creates a DirectRequest and establishes contact between client and driver if not already existing
 * @param courierJobId - The ID of the courier job
 * @param clientId - The ID of the client
 * @param driverId - The ID of the driver
 * @returns Promise containing success status and created DirectRequest data
 */
export const createDirectRequest = async (
  courierJobId: string,
  clientId: string,
  driverId: string
): Promise<CreateDirectRequestResponse> => {
  try {
    // Check if a contact already exists between the driver and client
    let contact = await prisma.contacts.findFirst({
      where: { clientId, driverId },
    });

    // If no contact exists, create one
    if (!contact) {
      contact = await prisma.contacts.create({
        data: {
          clientId,
          driverId,
          isConversating: true, // or true if needed
        },
      });
    }

    // Create the direct request
    const directRequest = await prisma.directRequest.create({
      data: {
        courierJobId,
        clientId,
        driverId,
        isApproved: false,
      },
    });

    return { success: true, data: directRequest };
  } catch (error) {
    console.error("Error creating direct request:", error);
    throw error;
  }
};

/**
 * Retrieves a DirectRequest by its ID
 * @param id - The ID of the DirectRequest to fetch
 * @returns Promise containing the DirectRequest or null if not found
 */
export const getDirectRequestById = async (
  id: string
): Promise<DirectRequest | null> => {
  try {
    const directRequest = await prisma.directRequest.findUnique({
      where: { Id: id },
    });
    return directRequest;
  } catch (error) {
    console.error("Error fetching direct request:", error);
    throw error;
  }
};

/**
 * Helper function to fetch direct requests for a specific driver
 * @param driverId The ID of the driver
 * @returns Promise containing array of DirectRequests with included relations
 */
const fetchDirectRequestsByDriverId = async (
  driverId: string
): Promise<DirectRequest[]> => {
  try {
    const directRequests = await prisma.directRequest.findMany({
      where: { driverId, isApproved: false },
      include: {
        CourierJob: {
          include: {
            client: true,
          },
        },
      },
    });
    return directRequests;
  } catch (error) {
    console.error("Error fetching direct requests by driver ID:", error);
    throw error;
  }
};

/**
 * Retrieves cached direct requests for a specific driver
 * @param driverId The ID of the driver
 * @returns Cached Promise containing array of DirectRequests with included relations
 */
export const getDirectRequestsByDriverId = async (
  driverId: string
): Promise<DirectRequest[]> => {
  const getCachedRequests = unstable_cache(
    async () => fetchDirectRequestsByDriverId(driverId),
    [`driver-direct-requests-${driverId}`],
    { tags: ["directRequests"], revalidate: 60 }
  );

  return getCachedRequests();
};

/**
 * Retrieves all DirectRequests associated with a specific client
 * @param clientId - The ID of the client
 * @returns Promise containing an array of DirectRequests
 */
export const getDirectRequestsByClientId = async (
  clientId: string
): Promise<DirectRequest[]> => {
  try {
    const directRequests = await prisma.directRequest.findMany({
      where: { clientId },
    });
    return directRequests;
  } catch (error) {
    console.error("Error fetching direct requests by client ID:", error);
    throw error;
  }
};

/**
 * Helper function to fetch direct requests for a specific courier job
 * @param courierJobId The ID of the courier job
 * @returns Promise containing array of DirectRequests
 */
const fetchDirectRequestsByCourierJobId = async (
  courierJobId: string
): Promise<DirectRequest[]> => {
  try {
    const directRequests = await prisma.directRequest.findMany({
      where: { courierJobId },
    });
    return directRequests;
  } catch (error) {
    console.error("Error fetching direct requests by courier job ID:", error);
    throw error;
  }
};

/**
 * Retrieves cached direct requests for a specific courier job
 * @param courierJobId The ID of the courier job
 * @returns Cached Promise containing array of DirectRequests
 */
export const getDirectRequestsByCourierJobId = async (
  courierJobId: string
): Promise<DirectRequest[]> => {
  const getCachedDirectRequests = unstable_cache(
    async () => fetchDirectRequestsByCourierJobId(courierJobId),
    [`courier-direct-requests-${courierJobId}`],
    { tags: ["directRequests"], revalidate: 60 }
  );

  return getCachedDirectRequests();
};

/**
 * Updates a DirectRequest by its ID with provided data
 * @param id - The ID of the DirectRequest to update
 * @param updateData - Partial DirectRequest data to update
 * @returns Promise containing the updated DirectRequest
 */
export const updateDirectRequest = async (
  id: string,
  updateData: Partial<DirectRequest>
): Promise<DirectRequest> => {
  try {
    const updatedRequest = await prisma.directRequest.update({
      where: { Id: id },
      data: updateData,
    });
    return updatedRequest;
  } catch (error) {
    console.error("Error updating direct request:", error);
    throw error;
  }
};

/**
 * Approves a DirectRequest and performs associated actions in a transaction
 * Creates JobRequest, updates CourierJob, and creates ActiveJob
 * @param id - The ID of the DirectRequest to approve
 * @returns Promise containing the updated DirectRequest
 */
export const approveDirectRequest = async (
  id: string
): Promise<DirectRequest> => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Update the DirectRequest to set isApproved to true
      const updatedRequest = await prisma.directRequest.update({
        where: { Id: id },
        data: { isApproved: true },
      });

      // Step 2: Create a JobRequest entry without clientId if not defined in the schema
      const jobRequest = await prisma.jobRequest.create({
        data: {
          courierJobId: updatedRequest.courierJobId,
          driverId: updatedRequest.driverId,
          isApproved: true,
        },
      });

      // Step 3: Update the corresponding CourierJob to set approvedRequestId
      await prisma.courierJobs.update({
        where: { Id: updatedRequest.courierJobId },
        data: { approvedRequestId: jobRequest.Id, packageStatus: "claimed" },
      });

      // Step 4: Create an entry in ActiveJobs with required fields
      const activeJob = await prisma.activeJobs.create({
        data: {
          courierJobId: updatedRequest.courierJobId,
          driverId: updatedRequest.driverId,
          clientId: updatedRequest.clientId,
          startDate: new Date().toISOString(),
        },
      });

      // Return the updatedRequest after all steps are complete
      return updatedRequest;
    });

    return result;
  } catch (error) {
    console.error("Error approving direct request:", error);
    throw error;
  }
};

/**
 * Deletes a DirectRequest by its ID
 * @param id - The ID of the DirectRequest to delete
 * @returns Promise containing a success message
 */
export const deleteDirectRequest = async (
  id: string
): Promise<{ message: string }> => {
  try {
    await prisma.directRequest.delete({
      where: { Id: id },
    });
    return { message: "Direct request deleted successfully" };
  } catch (error) {
    console.error("Error deleting direct request:", error);
    throw error;
  }
};
