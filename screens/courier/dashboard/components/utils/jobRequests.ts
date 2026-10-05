"use server";
import {
  createJobRequest,
  getJobRequestsByDriverId,
} from "@/actions/jobRequestActions";

export const handleApply = async (
  jobId: string,
  userId: string | null
): Promise<{ success: boolean; data?: string; error?: string }> => {
  if (!userId || !jobId) {
    return { success: false, error: "User ID or Job ID is missing." };
  }

  try {
    await createJobRequest({
      courierJobId: jobId,
      driverId: userId,
    });
    return { success: true, data: "Job request submitted successfully!" };
  } catch (error) {
    console.error("Error creating job request:", error);
    return { success: false, error: "Failed to submit job request." };
  }
};
interface JobRequest {
  CourierJob: {
    Id: string;
    Title: string | null;
    Description: string | null;
    Budget: string | null;
    // ... add other properties as needed
  };
  Driver: {
    // Add driver properties if needed
  };
  // Add other properties of JobRequest if needed
}

interface SuccessResponse {
  success: true;
  data: JobRequest[];
}

interface ErrorResponse {
  success: false;
  error: string;
}

type HandleAppliedResponse = SuccessResponse | ErrorResponse;

export const handleApplied = async (
  userId: string | null
): Promise<HandleAppliedResponse> => {
  if (!userId) {
    return { success: false, error: "User ID is missing." };
  }

  try {
    const jobRequests = await getJobRequestsByDriverId(userId);
    return { success: true, data: jobRequests };
  } catch (error) {
    console.error("Error fetching job requests:", error);
    return { success: false, error: "Failed to fetch job requests." };
  }
};
