"use server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates or updates an FCM token for a user
 * @param FCMTokenData Object containing userId and token
 * @returns Object with success status and created/updated token data
 */
export const createFCMToken = async (FCMTokenData: {
  userId: string;
  token: string;
}) => {
  try {
    const newFCMToken = await prisma.fCMTokens.upsert({
      where: {
        userId: FCMTokenData.userId,
      },
      update: {
        token: FCMTokenData.token,
      },
      create: {
        userId: FCMTokenData.userId,
        token: FCMTokenData.token,
      },
    });
    if (newFCMToken.userId) return { success: true, data: newFCMToken };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error creating FCMToken" + error };
  }
};

/**
 * Retrieves all FCM tokens for a specific user
 * @param userId The ID of the user
 * @returns Object with success status and array of FCM tokens
 */
export const getFCMToken = async (userId: string) => {
  try {
    // Get all FCMTokens
    const FCMTokens = await prisma.fCMTokens.findMany({
      where: { userId },
    });

    if (FCMTokens.length > 0) {
      return {
        success: true,
        data: {
          all: FCMTokens,
        },
      };
    } else {
      return { success: false, error: "No FCMTokens found for this user" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving FCMToken: ${error}` };
  }
};

/**
 * Alternative function to get all FCM tokens for a user
 * @param userId The ID of the user
 * @returns Object with success status and array of FCM tokens
 */
export const getAllFCMTokens = async (userId: string) => {
  try {
    const FCMTokens = await prisma.fCMTokens.findMany({
      where: { userId },
    });

    if (FCMTokens.length > 0) {
      return { success: true, data: FCMTokens };
    } else {
      return { success: false, error: "No FCMTokens found for this user" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving FCMTokens: ${error}` };
  }
};

/**
 * Deletes an FCM token for a specific user
 * @param userId The ID of the user
 * @returns Object with success status and deleted token data
 */
export const deleteFCMToken = async (userId: string) => {
  try {
    const deletedFCMToken = await prisma.fCMTokens.delete({
      where: { userId: userId },
    });
    return { success: true, data: deletedFCMToken };
  } catch (error) {
    return { success: false, error: "Error deleting FCMToken" + error };
  }
};
