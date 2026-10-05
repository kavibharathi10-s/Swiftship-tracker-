"use server";
import { Prisma, PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new client and assigns client role
 * @param clientData Object containing client details (clerkId, email, phoneNumber, firstName, lastName, photoUrl, idPhotoUrl)
 * @returns Object with success status and client data or error message
 */
export const createClient = async (clientData: {
  clerkId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
}) => {
  try {
    const newClient = await prisma.clients.create({
      data: {
        Id: clientData.clerkId,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        photoUrl: clientData.photoUrl,
        idPhotoUrl: clientData.idPhotoUrl,
      },
    });
    await prisma.userRole.upsert({
      where: {
        userId: clientData.clerkId, // Assuming userId is a unique field
      },
      create: {
        userId: clientData.clerkId,
        driver: false,
        client: true,
      },
      update: {
        driver: false,
        client: true,
      },
    });
    if (newClient.Id) return { success: true, data: newClient };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error creating client" + error };
  }
};

/**
 * Retrieves all unverified clients from the database
 * @returns Object with success status and array of unverified clients or error message
 */
export const getUnverifiedClients = async () => {
  try {
    const unverifiedClients = await prisma.clients.findMany({
      where: {
        isVerified: false,
      },
    });
    if (unverifiedClients.length > 0) {
      return { success: true, data: unverifiedClients };
    } else {
      return { success: false, error: "No unverified clients found" };
    }
  } catch (error) {
    return {
      success: false,
      error: "Error retrieving unverified clients" + error,
    };
  }
};

/**
 * Verifies a client by updating their verification status
 * @param clientId The ID of the client to verify
 * @returns Object with success status and updated client data or error message
 */
export const verifyClient = async (clientId: string) => {
  try {
    const updatedClient = await prisma.clients.update({
      where: { Id: clientId },
      data: { isVerified: true },
    });
    if (updatedClient) {
      return { success: true, data: updatedClient };
    } else {
      return { success: false, error: "Client not found" };
    }
  } catch (error) {
    return { success: false, error: "Error updating client" + error };
  }
};

/**
 * Helper function to fetch client data from database
 * @param clientId The ID of the client to fetch
 * @returns Object with success status and client data or error message
 */
const fetchClientById = async (clientId: string) => {
  try {
    const client = await prisma.clients.findUnique({
      where: { Id: clientId },
    });
    if (client) {
      return { success: true, data: client };
    } else {
      return { success: false, error: "Client not found" };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client by ID" + error };
  }
};

/**
 * Retrieves a cached client by their ID
 * @param clientId The ID of the client to retrieve
 * @returns Cached object with success status and client data or error message
 */
export const getClientById = async (clientId: string) => {
  const getCachedClient = unstable_cache(
    async () => fetchClientById(clientId),
    [`client-${clientId}`],
    { tags: ["client"], revalidate: 60 }
  );

  return getCachedClient();
};

/**
 * Helper function to fetch all clients from database
 * @returns Object with success status and array of all clients or error message
 */
const fetchAllClients = async () => {
  const clients = await prisma.clients.findMany();
  if (clients.length > 0) {
    return { success: true, data: clients };
  } else {
    return { success: false, error: "No clients found" };
  }
};

/**
 * Retrieves cached list of all clients
 * @returns Cached object with success status and array of all clients or error message
 */
export const getAllClients = async () => {
  const getCachedClients = unstable_cache(
    async () => fetchAllClients(),
    ["all-clients"],
    { tags: ["clients"], revalidate: 60 }
  );

  return getCachedClients();
};

/**
 * Updates a client's information
 * @param clientId The ID of the client to update
 * @param clientData The data to update the client with
 * @returns Object with success status and updated client data or error message
 */
export const updateClient = async (
  clientId: string,
  clientData: Prisma.clientsUpdateInput
) => {
  try {
    const updatedClient = await prisma.clients.update({
      where: { Id: clientId },
      data: clientData,
    });
    return { success: true, data: updatedClient };
  } catch (error) {
    return { success: false, error: "Error updating client" + error };
  }
};

/**
 * Deletes a client from the database
 * @param clientId The ID of the client to delete
 * @returns Object with success status and deleted client data or error message
 */
export const deleteClient = async (clientId: string) => {
  try {
    const deletedClient = await prisma.clients.delete({
      where: { Id: clientId },
    });
    return { success: true, data: deletedClient };
  } catch (error) {
    return { success: false, error: "Error deleting client" + error };
  }
};
