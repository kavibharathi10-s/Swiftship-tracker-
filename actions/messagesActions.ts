"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Creates a new message between a driver and client
 * @param messageData Object containing driverId, clientId, message, and senderId
 * @returns Object with success status and created message data
 */
export const createMessage = async (messageData: {
  driverId: string;
  clientId: string;
  message: string;
  senderId: string;
}) => {
  const newmessage = await prisma.messages.create({
    data: {
      driverId: messageData.driverId,
      clientId: messageData.clientId,
      senderId: messageData.senderId,
      message: messageData.message,
    },
  });
  if (newmessage.Id) return { success: true, data: newmessage };
  else return { success: false };
};

/**
 * Retrieves all messages between a specific client and driver
 * @param clientId The ID of the client
 * @param driverId The ID of the driver
 * @returns Object with success status and array of messages
 */
export const getMessages = async (clientId: string, driverId: string) => {
  try {
    const messages = await prisma.messages.findMany({
      where: { clientId: clientId, driverId: driverId },
    });
    if (messages.length > 0) return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: "Error retrieving client message" };
  }
};

/**
 * Retrieves a specific message by its ID
 * @param messageId The ID of the message to retrieve
 * @returns Object with success status and message data
 */
export const getMessageById = async (messageId: string) => {
  try {
    if (messageId.length > 0) {
      const messages = await prisma.messages.findMany({
        where: { Id: messageId },
      });
      if (messages.length > 0) return { success: true, data: messages };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client messages" };
  }
};

/**
 * Updates an existing message
 * @param messageId The ID of the message to update
 * @param messageData Partial object containing fields to update
 * @returns Object with success status and updated message data
 */
export const updateMessage = async (
  messageId: string,
  messageData: Partial<any>
) => {
  try {
    const updatedmessage = await prisma.messages.update({
      where: { Id: messageId },
      data: messageData,
    });
    return { success: true, data: updatedmessage };
  } catch (error) {
    return { success: false, error: "Error updating client message" };
  }
};

/**
 * Deletes a message by its ID
 * @param messageId The ID of the message to delete
 * @returns Object with success status and deleted message data
 */
export const deleteMessage = async (messageId: string) => {
  try {
    const deletedmessage = await prisma.messages.delete({
      where: { Id: messageId },
    });
    return { success: true, data: deletedmessage };
  } catch (error) {
    return { success: false, error: "Error deleting client message" };
  }
};
