/**
 * The `MyJobs` component is the main dashboard view for a client, displaying a list of their courier jobs and detailed information about a selected job.
 *
 * The component fetches the client's jobs from the server and displays them in a table. When a job is selected, the component fetches additional details about the job, such as the job requests and the driver assigned to the job, and displays them in a details panel.
 *
 * The component also includes functionality to handle new jobs received through a Supabase channel subscription, automatically adding them to the list of jobs and updating the details panel if the new job matches the currently selected job.
 *
 * @returns The `MyJobs` component, which renders the client's dashboard view.
 */
"use client";

import Details from "./JobDetails";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import JobsTable from "./JobTables";
import supabase from "@/app/utils/supabase";
import { getAllJobsFiltered } from "@/actions/courierJobsActions";
import { PlusCircle, Truck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  getJobRequestById,
  getJobRequestsByCourierJobId,
} from "@/actions/jobRequestActions";
import { getDriverByID } from "@/actions/driverActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDirectRequestsByCourierJobId } from "@/actions/directRequestActions";
import { toast } from "@/hooks/use-toast";

export default function MyJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[] | undefined>([]);
  const [requests, setRequests] = useState<any[] | undefined>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isGettingDrivers, setIsGettingDrivers] = useState<boolean>(false); // Loading state
  const { userId } = useAuth();
  const [driver, setDriver] = useState<any | null>({});
  const [open, setOpen] = useState(true);
  let jobsVar: any[] = [];
  let selectedJobVar: any = null;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Start loading
      const response = await getAllJobsFiltered(userId || "");
      if (response.success && response.data) {
        const data = response.data;
        if (data.length > 0 && window.innerWidth >= 1024) {
          selectedJobVar = data[0];
          handleRowClick(data[0]);
        }
        setJobs(data);
        jobsVar = data;
      } else {
        setError(response.error);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const getDriverDetails = async (job: any | undefined) => {
    const jobRequest = await getJobRequestById(job.approvedRequestId);

    return jobRequest?.Driver;
  };

  useEffect(() => {
    /**
     * Handles the processing of a new job received from a Supabase channel subscription.
     *
     * This function is called whenever a new job is inserted into the `CourierJobs` table in the
     * Supabase database. It checks if the new job's `clientId` matches the current user's `userId`,
     * and if so, adds the new job to the `jobs` state. If the new job matches the currently selected
     * job, it also calls the `handleRowClick` function to update the UI.
     *
     * @param payload - The payload object received from the Supabase channel subscription, containing the new job data.
     */
    const handleNewJob = (payload: any) => {
      try {
        const newJob = payload.new;
        if (newJob.courierJobId) {
          setJobs((prevJobs) =>
            prevJobs ? [...prevJobs, { ...newJob }] : [{ ...newJob }]
          );
          jobsVar?.forEach((job: any) => {
            if (job.Id === newJob.courierJobId) {
              toast({
                title: `New Job Application for ${job.Title}`,
                description: `A driver just applied for ${job.Title}. You have to refresh the page to see the new job application.`,
                action: (
                  // TODO: button to refresh the page
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.refresh();
                    }}
                  >
                    Refresh
                  </Button>
                ),
                variant: "default",
              });
            }
          });
        }
      } catch (error) {
        console.log(payload.errors);
      }
    };

    const channel = supabase
      .channel("on-Insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "JobRequest",
        },
        (payload) => {
          handleNewJob(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const handleRowClick = async (job: any | undefined) => {
    setRequests([]);
    setIsGettingDrivers(true);

    try {
      if (job.packageStatus === "unclaimed") {
        const requests = await getJobRequestsByCourierJobId(job.Id);
        if (job.isDirect) {
          const directRequest = await getDirectRequestsByCourierJobId(job.Id);
          if (directRequest && directRequest[0].driverId) {
            const driver = await getDriverByID(directRequest[0].driverId);
            setRequests([driver.data]);
          }
        } else {
          if (requests.length > 0) {
            setRequests(requests.map((request) => request.Driver));
          }
        }
      } else if (
        job.packageStatus === "claimed" ||
        job.packageStatus === "collected" ||
        job.packageStatus === "delivered"
      ) {
        if (job.Id) {
          const driver = await getDriverDetails(job);
          setDriver(driver);
        }
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
    } finally {
      setIsGettingDrivers(false);
      setSelectedJob(job);
      setOpen(true);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gray-50">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-lg">
          {/* Animated Delivery Truck */}
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      )}

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="flex p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <Link href={"/client/job-post"} prefetch={true}>
            <Button className="mb-4 flex items-center bg-black">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>New Job</span>
            </Button>
          </Link>
        </div>
        <main className="flex flex-row gap-4">
          <div className="w-full">
            {/* Render the table only when loading is false */}
            <JobsTable
              jobs={jobs}
              onRowClick={handleRowClick}
              Clicked={selectedJob}
            />
          </div>

          {/* Display details if a job is selected */}
          {isGettingDrivers ? (
            <div className="w-full flex z-10 absolute backdrop-blur-lg flex-col justify-center items-center h-full">
              <Truck className="animate-truck" width="100" height="100" />
              <p className="text-lg text-gray-700">____________________</p>
            </div>
          ) : (
            selectedJob && (
              <Details
                job={selectedJob}
                requests={requests}
                driver={driver}
                Open={open}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}
