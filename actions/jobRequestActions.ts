"use server";
import { PrismaClient } from "@prisma/client";
import { createcontact } from "./contactsActions";
import { createActiveJob } from "./activeJobsActions";
import notifyAboutJob from "./knock";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

/**
 * Creates a new job request and notifies the client about the new applicant
 * @param data Object containing courierJobId and driverId
 * @returns The created job request with Driver and CourierJob details
 */
export async function createJobRequest(data: {
  courierJobId: string;
  driverId: string;
}) {
  // send client a notification that there is a new applicant for their job
  const jobRequest = await prisma.jobRequest.create({
    data: {
      courierJobId: data.courierJobId,
      driverId: data.driverId,
    },
    include: {
      Driver: true,
      CourierJob: true,
    },
  });
  const Client = await prisma.clients.findUnique({
    where: {
      Id: jobRequest.CourierJob.clientId,
    },
  });
  if (jobRequest.Id && Client?.Id) {
    // send client a notification that there is a new applicant for their job
    await notifyAboutJob(
      Client,
      jobRequest.CourierJob,
      jobRequest.Driver.firstName || "" + jobRequest.Driver.lastName || ""
    );
  }
  return jobRequest;
}

/**
 * Retrieves all job requests excluding those that have direct requests
 * @returns Array of job requests with CourierJob and Driver details
 */
export async function getAllJobRequests() {
  const directRequests = await prisma.directRequest.findMany({
    select: {
      courierJobId: true,
    },
  });

  const excludedJobIds = directRequests.map((request) => request.courierJobId);

  const jobRequests = await prisma.jobRequest.findMany({
    where: {
      NOT: {
        courierJobId: {
          in: excludedJobIds,
        },
      },
    },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });

  return jobRequests;
}

/**
 * Retrieves job requests for a specific driver and courier job
 * @param driverId The ID of the driver
 * @param courierJobId The ID of the courier job
 * @returns Array of matching job requests with CourierJob and Driver details
 */
export async function getJobRequestByDriverIdAndByCourierJobId(
  driverId: string,
  courierJobId: string
) {
  const jobRequest = await prisma.jobRequest.findMany({
    where: { driverId: driverId, courierJobId: courierJobId },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequest;
}

/**
 * Helper function to fetch job request by ID with related data
 * @param id The ID of the job request
 * @returns The job request with CourierJob and Driver details
 */
const fetchJobRequestById = async (id: string) => {
  const jobRequest = await prisma.jobRequest.findUnique({
    where: { Id: id },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequest;
};

/**
 * Retrieves cached job request by ID with related details
 * @param id The ID of the job request
 * @returns Cached job request with CourierJob and Driver details
 */
export async function getJobRequestById(id: string) {
  const getCachedJobRequest = unstable_cache(
    async () => fetchJobRequestById(id),
    [`job-request-${id}`],
    { tags: ["jobRequest"], revalidate: 60 }
  );

  return getCachedJobRequest();
}

/**
 * Updates a job request with new data
 * @param id The ID of the job request to update
 * @param data Object containing offerAmount and/or isApproved
 * @returns The updated job request
 */
export async function updateJobRequest(
  id: string,
  data: Partial<{
    offerAmount: string;
    isApproved: boolean;
  }>
) {
  const updatedJobRequest = await prisma.jobRequest.update({
    where: { Id: id },
    data,
  });
  return updatedJobRequest;
}

/**
 * Deletes a job request
 * @param id The ID of the job request to delete
 * @returns The deleted job request
 */
export async function deleteJobRequest(id: string) {
  const deletedJobRequest = await prisma.jobRequest.delete({
    where: { Id: id },
  });
  return deletedJobRequest;
}

/**
 * Helper function to fetch job requests for a specific courier job
 * @param courierJobId The ID of the courier job
 * @returns Array of job requests with CourierJob and Driver details
 */
const fetchJobRequestsByCourierJobId = async (courierJobId: string) => {
  const jobRequests = await prisma.jobRequest.findMany({
    where: { courierJobId: courierJobId },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequests;
};

/**
 * Retrieves cached job requests for a specific courier job
 * @param courierJobId The ID of the courier job
 * @returns Cached array of job requests with CourierJob and Driver details
 */
export async function getJobRequestsByCourierJobId(courierJobId: string) {
  const getCachedJobRequests = unstable_cache(
    async () => fetchJobRequestsByCourierJobId(courierJobId),
    [`courier-job-requests-${courierJobId}`],
    { tags: ["jobRequests"], revalidate: 60 }
  );

  return getCachedJobRequests();
}

/**
 * Retrieves all job requests for a specific driver
 * @param driverId The ID of the driver
 * @returns Array of job requests with CourierJob and Driver details
 */
export async function getJobRequestsByDriverId(driverId: string) {
  const jobRequests = await prisma.jobRequest.findMany({
    where: { driverId: driverId },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequests;
}

/**
 * Helper function to fetch unapproved job requests for a specific driver
 * @param driverId The ID of the driver
 * @returns Array of unapproved job requests with CourierJob, client, and Driver details
 */
const fetchUnapprovedJobRequests = async (driverId: string) => {
  const jobRequests = await prisma.jobRequest.findMany({
    where: { driverId: driverId, isApproved: false },
    include: {
      CourierJob: {
        include: {
          client: true,
        },
      },
      Driver: true,
    },
  });
  return jobRequests;
};

/**
 * Retrieves cached unapproved job requests for a specific driver
 * @param driverId The ID of the driver
 * @returns Cached array of unapproved job requests with full relation details
 */
export async function getUnapprovedJobRequests(driverId: string) {
  const getCachedRequests = unstable_cache(
    async () => fetchUnapprovedJobRequests(driverId),
    [`driver-unapproved-requests-${driverId}`],
    { tags: ["jobRequests"], revalidate: 60 }
  );

  return getCachedRequests();
}

/**
 * Approves a job request and performs related operations
 * @param data Object containing driverId, clientId, and courierJobId
 * @returns 0 if successful, 1 if failed, 2 if contact already exists
 */
export async function approveJobRequest(data: {
  driverId: string;
  clientId: string;
  courierJobId: string;
}) {
  // First, we need to get the jobRequestId before we can proceed with parallel operations
  const request = await getJobRequestByDriverIdAndByCourierJobId(
    data.driverId,
    data.courierJobId
  );
  const jobRequestId = request[0].Id;

  // Get current date
  const date = new Date();
  const currentDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  // Group operations that can be executed concurrently
  const [jobRequest, courierJob, contact] = await Promise.all([
    // Update job request
    prisma.jobRequest.update({
      where: { Id: jobRequestId },
      data: {
        isApproved: true,
      },
    }),

    // Update courier job
    prisma.courierJobs.update({
      where: {
        Id: data.courierJobId,
      },
      data: {
        packageStatus: "claimed",
        approvedRequestId: jobRequestId,
      },
    }),

    // Create contact
    createcontact({
      clientId: data.clientId,
      driverId: data.driverId,
    }),
  ]);

  const setActiveJob = await createActiveJob({
    courierJobId: data.courierJobId,
    driverId: data.driverId,
    clientId: data.clientId,
    startDate: currentDate,
  });

  // Check if all operations were successful
  if (jobRequest.Id && courierJob.Id && contact.success && setActiveJob?.Id) {
    return 0;
  }
  if (contact.error === "contact already exists") {
    // check if reason for failure is because parties are already contacts
    return 2;
  }
  return 1;
}
