"use server";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Helper function to fetch and check driver role status
 * @param driverId The ID of the user to check
 * @returns true if user has driver role, false otherwise
 */
const fetchDriverRole = async (driverId: string) => {
  try {
    const driver = await prisma.userRole.findUnique({
      where: {
        userId: driverId,
      },
    });
    if (driver?.driver === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching driver role:", error);
    throw error;
  }
};

/**
 * Checks if a user has a driver role using cached data
 * @param driverId The ID of the user to check
 * @returns Cached boolean indicating if user has driver role
 */
export const checkDriverRole = async (driverId: string) => {
  const getCachedDriverRole = unstable_cache(
    async () => fetchDriverRole(driverId),
    [`driver-role-${driverId}`],
    { tags: ["userRole"], revalidate: 60 }
  );

  return getCachedDriverRole();
};

/**
 * Checks the roles of a user
 * @param userId - The ID of the user to check
 * @returns Object containing success status and role type ('client' or 'driver') or null if no role found
 */
export const checkRoles = async (userId: string) => {
  try {
    const user = await prisma.userRole.findUnique({
      where: {
        userId: userId,
      },
    });
    if (user?.client === true) {
      return {
        success: true,
        data: "client",
      };
    } else if (user?.driver === true) {
      return {
        success: true,
        data: "driver",
      };
    }
    return {
      success: false,
      data: null,
    };
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};
