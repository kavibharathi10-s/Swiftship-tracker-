"use server";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new client request between a sender and receiver
 * @param requestData Object containing receiverId and senderId
 * @returns Object with success status and created request data
 */
export const createClientRequest = async (requestData: {
  receiverId: string;
  senderId: string;
}) => {
  const newRequest = await prisma.clientRequests.create({
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
 * Retrieves a specific client request between a sender and receiver
 * @param senderId ID of the request sender
 * @param receiverId ID of the request receiver
 * @returns Object with success status and request data if found
 */
export const getClientRequest = async (
  senderId: string,
  receiverId: string
) => {
  try {
    const requests = await prisma.clientRequests.findMany({
      where: { senderId: senderId, receiverId: receiverId },
    });
    if (requests.length > 0) return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: "Error retrieving client request" };
  }
};

/**
 * Helper function to fetch client requests from database
 * @param senderId Optional ID of the sender to filter requests
 * @param receiverId Optional ID of the receiver to filter requests
 * @returns Object with success status and array of requests if found
 */
const fetchClientRequests = async (
  senderId: string = "",
  receiverId: string = ""
) => {
  try {
    if (senderId.length > 0) {
      const requests = await prisma.clientRequests.findMany({
        where: { senderId: senderId },
      });
      if (requests.length > 0) return { success: true, data: requests };
    } else {
      const requests = await prisma.clientRequests.findMany({
        where: { receiverId: receiverId },
      });
      if (requests.length > 0) return { success: true, data: requests };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client requests" };
  }
};

/**
 * Retrieves cached client requests for either a sender or receiver
 * @param senderId Optional ID of the sender to filter requests
 * @param receiverId Optional ID of the receiver to filter requests
 * @returns Cached object with success status and array of requests if found
 */
export const getClientRequests = async (
  senderId: string = "",
  receiverId: string = ""
) => {
  const getCachedRequests = unstable_cache(
    async () => fetchClientRequests(senderId, receiverId),
    [`client-requests-${senderId}-${receiverId}`],
    { tags: ["clientRequests"], revalidate: 60 }
  );

  return getCachedRequests();
};

/**
 * Updates an existing client request and creates a contact relationship
 * @param requestId ID of the request to update
 * @param requestData Partial data to update the request with
 * @returns Object with success status and updated request data
 */
export const updateClientRequest = async (
  requestId: string,
  requestData: Partial<any>
) => {
  try {
    const updatedRequest = await prisma.clientRequests.update({
      where: { Id: requestId },
      data: requestData,
    });
    await prisma.contacts.create({
      data: {
        clientId: requestData.senderId,
        driverId: requestData.receiverId,
      },
    });
    return { success: true, data: updatedRequest };
  } catch (error) {
    return { success: false, error: "Error updating client request" };
  }
};

/**
 * Deletes a client request
 * @param requestId ID of the request to delete
 * @returns Object with success status and deleted request data
 */
export const deleteClientRequest = async (requestId: string) => {
  try {
    const deletedRequest = await prisma.clientRequests.delete({
      where: { Id: requestId },
    });
    return { success: true, data: deletedRequest };
  } catch (error) {
    return { success: false, error: "Error deleting client request" };
  }
};
