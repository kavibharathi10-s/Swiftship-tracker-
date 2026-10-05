"use server";
import { PrismaClient } from "@prisma/client";
import { revalidateTag } from "next/cache";

const prisma = new PrismaClient();

interface UserRole {
  userId: string;
  driver?: boolean;
  client?: boolean;
}

/**
 * Creates or updates a user role for a given user ID
 * @param {UserRole} params - Object containing userId and optional driver/client flags
 * @returns {Promise} The created or updated user role
 */
export const createUserRole = async ({
  userId,
  driver = false,
  client = false,
}: UserRole) => {
  try {
    const userRole = await prisma.userRole.upsert({
      where: { userId }, // Match the userRole by userId
      update: {
        driver, // Update fields if the role already exists
        client,
      },
      create: {
        userId, // Create a new userRole if it doesn't exist
        driver,
        client,
      },
    });
    return userRole;
  } catch (error) {
    console.error("Error upserting user role:", error);
    throw error;
  }
};

/**
 * Updates an existing user role
 * @param {UserRole} params - Object containing userId and driver/client flags to update
 * @returns {Promise} The updated user role
 */
export const updateUserRole = async ({ userId, driver, client }: UserRole) => {
  try {
    const updatedUserRole = await prisma.userRole.update({
      where: { userId },
      data: {
        driver,
        client,
      },
    });
    revalidateTag("userRole");
    return updatedUserRole;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Retrieves a user role by user ID
 * @param {string} userId - The ID of the user to find the role for
 * @returns {Promise} The user role if found, null otherwise
 */
export const getUserRole = async (userId: string) => {
  try {
    const userRole = await prisma.userRole.findUnique({
      where: { userId },
    });
    return userRole;
  } catch (error) {
    console.error("Error retrieving user role:", error);
    throw error;
  }
};

/**
 * Deletes a user role by user ID
 * @param {string} userId - The ID of the user whose role should be deleted
 * @returns {Promise} The deleted user role
 */
export const deleteUserRole = async (userId: string) => {
  try {
    const deletedUserRole = await prisma.userRole.delete({
      where: { userId },
    });
    return deletedUserRole;
  } catch (error) {
    console.error("Error deleting user role:", error);
    throw error;
  }
};
