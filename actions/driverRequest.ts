"use server";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new driver request
 * @param requestData Object containing receiverId and senderId
 * @returns Object with success status and created request data
 */
export const createDriverRequest = async (requestData: {
  receiverId: string;
  senderId: string;
}) => {
  const newRequest = await prisma.driverRequests.create({
    data: {
      receiverId: requestData.receiverId,
      senderId: requestData.senderId,
      isPending: true,
    },
  });
  if (newRequest.Id) return { success: true, data: newRequest };
  else return { success: false };
};

/**
 * Helper function to fetch specific driver request data
 * @param senderId ID of the request sender
 * @param receiverId ID of the request receiver
 * @returns Object with success status and request data
 */
const fetchDriverRequest = async (senderId: string, receiverId: string) => {
  try {
    const requests = await prisma.driverRequests.findMany({
      where: { senderId: senderId, receiverId: receiverId },
    });
    if (requests.length > 0) return { success: true, data: requests };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error retrieving driver request" };
  }
};

/**
 * Retrieves cached driver request based on sender and receiver IDs
 * @param senderId ID of the request sender
 * @param receiverId ID of the request receiver
 * @returns Cached object with success status and request data
 */
export const getDriverRequest = async (
  senderId: string,
  receiverId: string
) => {
  const getCachedRequest = unstable_cache(
    async () => fetchDriverRequest(senderId, receiverId),
    [`driver-request-${senderId}-${receiverId}`],
    { tags: ["driverRequest"], revalidate: 60 }
  );

  return getCachedRequest();
};

/**
 * Helper function to fetch driver requests from database
 * @param senderId Optional ID of the sender (driver)
 * @param receiverId Optional ID of the receiver (client)
 * @returns Object with success status and array of requests
 */
const fetchDriverRequests = async (
  senderId: string = "",
  receiverId: string = ""
) => {
  try {
    if (senderId.length > 0) {
      // driver as sender
      const requests = await prisma.driverRequests.findMany({
        where: { senderId: senderId },
      });
      if (requests.length > 0) return { success: true, data: requests };
      else return { success: false };
    } else {
      // client as receiver
      const requests = await prisma.driverRequests.findMany({
        where: { receiverId: receiverId },
      });
      if (requests.length > 0) return { success: true, data: requests };
      else return { success: false };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving driver requests" };
  }
};

/**
 * Retrieves cached driver requests for either a sender or receiver
 * @param senderId Optional ID of the sender (driver)
 * @param receiverId Optional ID of the receiver (client)
 * @returns Cached object with success status and array of requests
 */
export const getDriverRequests = async (
  senderId: string = "",
  receiverId: string = ""
) => {
  const getCachedRequests = unstable_cache(
    async () => fetchDriverRequests(senderId, receiverId),
    [`driver-requests-${senderId}-${receiverId}`],
    { tags: ["driverRequests"], revalidate: 60 }
  );

  return getCachedRequests();
};

/**
 * Updates an existing driver request and creates a contact relationship
 * @param requestId ID of the request to update
 * @param requestData Partial data to update the request with
 * @returns Object with success status and updated request data
 */
export const updateDriverRequest = async (
  requestId: string,
  requestData: Partial<any>
) => {
  try {
    const updatedRequest = await prisma.driverRequests.update({
      where: { Id: requestId },
      data: requestData,
    });

    await prisma.contacts.create({
      data: {
        clientId: requestData.receiverId,
        driverId: requestData.senderId,
      },
    });
    return { success: true, data: updatedRequest };
  } catch (error) {
    return { success: false, error: "Error updating driver request" };
  }
};

/**
 * Deletes a driver request
 * @param requestId ID of the request to delete
 * @returns Object with success status and deleted request data
 */
export const deleteDriverRequest = async (requestId: string) => {
  try {
    const deletedRequest = await prisma.driverRequests.delete({
      where: { Id: requestId },
    });
    return { success: true, data: deletedRequest };
  } catch (error) {
    return { success: false, error: "Error deleting driver request" };
  }
};

/**
 * Creates a new driver request with validation checks
 * @param requestData Object containing receiverId and senderId
 * @returns Object with success status and created request data or error message
 */
export const createDriverRequestV1 = async (requestData: {
  receiverId: string;
  senderId: string;
}) => {
  try {
    // First verify the sender (Driver) exists
    const senderExists = await prisma.drivers.findUnique({
      where: { Id: requestData.senderId },
    });

    if (!senderExists) {
      return {
        success: false,
        error: "Driver not found",
      };
    }

    // Then verify the receiver (Client) exists
    const receiverExists = await prisma.clients.findUnique({
      where: { Id: requestData.receiverId },
    });

    if (!receiverExists) {
      return {
        success: false,
        error: "Client not found",
      };
    }

    // If both exist, create the request
    const newRequest = await prisma.driverRequests.create({
      data: {
        receiverId: requestData.receiverId,
        senderId: requestData.senderId,
        isPending: true,
      },
    });

    return { success: true, data: newRequest };
  } catch (error) {
    console.error("Error creating driver request:", error);
    if (error instanceof Error && "code" in error && error.code === "P2003") {
      return {
        success: false,
        error: "Invalid sender or receiver ID",
      };
    }
    return {
      success: false,
      error: "Error creating driver request",
    };
  }
};
