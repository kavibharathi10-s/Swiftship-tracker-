"use client";

import Details from "./JobDetails";
import RequestDetails from "./RequestDetails";
import PhotoCapture from "./ProofOfDelivery";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Truck, Loader2, X } from "lucide-react";
import JobsTable from "./JobsTable";
import {
  getAllActiveJobsByDriverId,
  updateActiveJobStatus,
} from "@/actions/activeJobsActions";
import { getUnapprovedJobRequests } from "@/actions/jobRequestActions";
import { getDirectRequestsByDriverId } from "@/actions/directRequestActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[] | undefined>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobRequests, setJobRequests] = useState<any[] | undefined>([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [directRequests, setDirectRequests] = useState<any[] | undefined>([]);
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusLoading, setIsStatusLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [jobToUpdate, setJobToUpdate] = useState<{
    jobId: string;
    newStatus: string;
  } | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const { userId } = useAuth();

  // Refactored to use concurrent data fetching
  const fetchInitialData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Concurrent data fetching using Promise.all
      const [jobsResponse, unapprovedRequests, directRequest] =
        await Promise.all([
          getAllActiveJobsByDriverId(userId),
          getUnapprovedJobRequests(userId),
          getDirectRequestsByDriverId(userId),
        ]);

      // Process jobs
      if (jobsResponse && jobsResponse.length > 0) {
        setJobs(jobsResponse);
        setSelectedJob(jobsResponse[0]);
        console.log("Jobs:", jobsResponse);
      } else {
        setError("No active jobs found");
      }

      // Set other data
      setJobRequests(unapprovedRequests || []);
      setDirectRequests(directRequest || []);
    } catch (fetchError) {
      console.error("Error fetching initial data:", fetchError);
      setError("Failed to fetch job data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, [userId]);
  const handleRequestApproved = async (requestId: string) => {
    setDirectRequests((prevRequests) =>
      prevRequests?.filter((request) => request.Id !== requestId)
    );
    await fetchInitialData(); // Reuse the concurrent data fetch
  };

  useEffect(() => {
    const fetchJobRequests = async () => {
      if (userId) {
        const requests = await getUnapprovedJobRequests(userId);
        setJobRequests(requests);
      }
    };

    fetchJobRequests();
  }, [userId]);

  useEffect(() => {
    const fetchDirectJobRequests = async () => {
      if (userId) {
        const directRequest = await getDirectRequestsByDriverId(userId);
        setDirectRequests(directRequest);
      }
    };

    fetchDirectJobRequests();
  }, [userId]);

  const handleRowClick = (job: any | undefined) => {
    setSelectedJob(job);
    setSelectedRequest(null);

    if (window.innerWidth < 1024) {
      setIsSheetOpen(true);
    }
  };

  const handleRequestClick = (request: any | undefined) => {
    setSelectedRequest(request);
    setSelectedJob(null);
    if (window.innerWidth < 1024) {
      setIsSheetOpen(true);
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };
  const handleStatusChange = async (jobId: string, newStatus: string) => {
    if (newStatus === "delivered") {
      setJobToUpdate({ jobId, newStatus });
      setCurrentJobId(jobId); // Open proof modal for "delivered" status
      setIsDialogOpen(true);
      // setIsProofModalOpen(true);
    } else {
      setJobToUpdate({ jobId, newStatus });
      setIsDialogOpen(true);
    }
  };

  const handleProofModalOpen = () => {
    setIsDialogOpen(false);
    setIsProofModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!jobToUpdate) return;
    setIsStatusLoading(true);
    try {
      await updateActiveJobStatus(jobToUpdate.jobId, jobToUpdate.newStatus);
      setJobs((prevJobs) =>
        prevJobs?.map((job) =>
          job.Id === jobToUpdate.jobId
            ? { ...job, jobStatus: jobToUpdate.newStatus }
            : job
        )
      );
      setIsDialogOpen(false);
      setJobToUpdate(null);
    } catch (error) {
      console.error("Error updating job status:", error);
    } finally {
      setIsStatusLoading(false);
    }
  };

  const closeProofModal = () => {
    setIsProofModalOpen(false);
    setCurrentJobId(null);
  };


  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      {loading && <Loading />}

      {/* Confirmation Dialog */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-md mx-auto p-6">
          <DialogHeader>
            <DialogTitle>Confirm Job Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this job as{" "}
              <strong>{jobToUpdate?.newStatus}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {statusLoading ? (
              <Loader2 className="animate-spin text-gray-500" size={24} />
            ) : jobToUpdate && jobToUpdate.newStatus === "delivered" ? (
              <Button onClick={handleProofModalOpen}>Confirm</Button>
            ) : (
              <Button onClick={confirmStatusChange}>Confirm</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Capture Modal */}
      <Dialog open={isProofModalOpen} onOpenChange={closeProofModal}>
        <DialogContent className="w-full h-full max-w-none mx-0 my-0 p-6">
          <DialogHeader>
            <DialogTitle>Capture Proof</DialogTitle>
            <DialogDescription>
              Upload proof for job ID: <strong>{currentJobId}</strong>
            </DialogDescription>
          </DialogHeader>
          <PhotoCapture
            jobId={currentJobId}
            onClose={closeProofModal}
            confirm={confirmStatusChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={closeProofModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 p-4 md:py-4 md:px-6 lg:px-8">
        <main className="grid gap-4 md:gap-6 lg:gap-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <JobsTable
                jobs={jobs}
                jobRequests={jobRequests}
                directRequests={directRequests}
                onStatusChange={handleStatusChange}
                onRowClick={handleRowClick}
                onRequestClick={handleRequestClick}
              />
            </div>

            {/* Desktop view for details */}
            <div className="hidden lg:block lg:col-span-1">
              {selectedJob ? (
                <Details job={selectedJob} />
              ) : selectedRequest ? (
                <RequestDetails
                  request={selectedRequest}
                  onRequestApproved={handleRequestApproved}
                />
              ) : null}
            </div>

            {/* Mobile/Tablet view with Sheet */}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <SheetHeader className="flex flex-row justify-between items-center">
                  <SheetTitle>
                    {selectedJob ? "Job Details" : "Request Details"}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex mt-6 overflow-auto h-full">
                  {selectedJob ? (
                    <Details job={selectedJob} />
                  ) : selectedRequest ? (
                    <RequestDetails
                      request={selectedRequest}
                      onRequestApproved={handleRequestApproved}
                    />
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </main>
      </div>
    </div>
  );
}
