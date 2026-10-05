"use server";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new contact between a client and driver
 * @param contactData Object containing clientId and driverId
 * @returns Object with success status and contact data or error message
 */
export const createcontact = async (contactData: {
  clientId: string;
  driverId: string;
}) => {
  const contact = await getcontact(contactData.clientId, contactData.driverId);

  if (contact.error === "contact not found") {
    // try {
    const newcontact = await prisma.contacts.create({
      data: {
        clientId: contactData.clientId,
        driverId: contactData.driverId,
        isConversating: true,
      },
    });
    if (newcontact.Id) return { success: true, data: newcontact };
    else return { success: false };
  } else {
    return { success: false, error: "contact already exists" };
  }
  // } catch (error) {
  //   return { success: false, error: "Error creating contact" };
  // }
};

/**
 * Retrieves a contact by its ID
 * @param contactId The unique identifier of the contact
 * @returns Object with success status and contact data or error message
 */

const fetchContactById = async (contactId: string) => {
  try {
    const contact = await prisma.contacts.findUnique({
      where: { Id: contactId },
    });
    if (contact) {
      return { success: true, data: contact };
    } else {
      return { success: false, error: "contact not found" };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving contact by ID" };
  }
};

/**
 * Retrieves a contact by its ID
 * @param contactId The unique identifier of the contact
 * @returns Object with success status and contact data or error message
 */

export const getcontactById = async (contactId: string) => {
  const getCachedContact = unstable_cache(
    async () => fetchContactById(contactId),
    [`contact-${contactId}`],
    { tags: ["contact"], revalidate: 60 }
  );

  return getCachedContact();
};

/**
 * Helper function to fetch contact data by client and driver IDs
 * @param clientId The ID of the client
 * @param driverId The ID of the driver
 * @returns Object with success status and contact data or error message
 */
const fetchContact = async (clientId: string, driverId: string) => {
  try {
    const contact = await prisma.contacts.findMany({
      where: { clientId: clientId, driverId: driverId },
    });
    if (contact.length > 0) {
      return { success: true, data: contact };
    } else {
      return { success: false, error: "contact not found" };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving contact" };
  }
};

/**
 * Retrieves cached contact by client and driver IDs
 * @param clientId The ID of the client
 * @param driverId The ID of the driver
 * @returns Cached object with success status and contact data or error message
 */
export const getcontact = async (clientId: string, driverId: string) => {
  const getCachedContact = unstable_cache(
    async () => fetchContact(clientId, driverId),
    [`contact-${clientId}-${driverId}`],
    { tags: ["contact"], revalidate: 60 }
  );

  return getCachedContact();
};

/**
 * Retrieves all contacts from the database
 * @returns Object with success status and array of contacts or error message
 */
export const getAllcontacts = async () => {
  const contacts = await prisma.contacts.findMany(); // Remove where clause to get all contacts
  if (contacts.length > 0) {
    return { success: true, data: contacts };
  } else {
    return { success: false, error: "No contacts found" };
  }
};

/**
 * Helper function to fetch first contact matching driver and client IDs
 * @param driverId The ID of the driver
 * @param clientId The ID of the client
 * @returns Object with success status and contact data or error message
 */
const fetchContactByDriverAndClientId = async (
  driverId: string,
  clientId: string
) => {
  const contacts = await prisma.contacts.findFirst({
    where: { driverId: driverId, clientId: clientId },
  });
  if (contacts?.Id) {
    return { success: true, data: contacts };
  } else {
    return { success: false, error: "No contacts found" };
  }
};

/**
 * Retrieves cached first contact matching the driver and client IDs
 * @param driverId The ID of the driver
 * @param clientId The ID of the client
 * @returns Cached object with success status and contact data or error message
 */
export const getContactByDriverAndClientId = async (
  driverId: string,
  clientId: string
) => {
  const getCachedContact = unstable_cache(
    async () => fetchContactByDriverAndClientId(driverId, clientId),
    [`contact-driver-client-${driverId}-${clientId}`],
    { tags: ["contact"], revalidate: 60 }
  );

  return getCachedContact();
};

/**
 * Deletes a contact by its ID
 * @param contactId The unique identifier of the contact to delete
 * @returns Object with success status and deleted contact data or error message
 */
export const deletecontact = async (contactId: string) => {
  try {
    const deletedcontact = await prisma.contacts.delete({
      where: { Id: contactId },
    });
    return { success: true, data: deletedcontact };
  } catch (error) {
    return { success: false, error: "Error deleting contact" };
  }
};
