"use server";
import { PrismaClient } from "@prisma/client";
import { createDirectRequest } from "@/actions/directRequestActions";
import { createJob } from "@/actions/courierJobsActions";
import { getcontactById } from "@/actions/contactsActions";
const prisma = new PrismaClient();

// Function to create a direct request after creating the job
export const createJobAndDirectRequest = async (
  jobData: FormData,
  clientId: string,
  driverId: string
) => {
  try {
    // Set `isDirect` to true in jobData
    jobData.append("isDirect", "true");

    // Create the job using the createJob action
    const job = await createJob(jobData); // Ensure you're passing the right job data
    if (job.success && job.data) {
      // After creating the job, create the direct request
      const directRequest = await createDirectRequest(
        job.data.Id,
        clientId,
        driverId
      );

      if (directRequest.success) {
        return {
          success: true,
          data: {
            job: job.data,
            directRequest: directRequest.data,
          },
        };
      } else {
        return { success: false, error: directRequest.error };
      }
    } else {
      return { success: false, error: job.error || "Job creation failed" };
    }
  } catch (error) {
    console.error("Error creating job and direct request:", error);
    return { success: false, error: "Error creating job and direct request." };
  }
};
