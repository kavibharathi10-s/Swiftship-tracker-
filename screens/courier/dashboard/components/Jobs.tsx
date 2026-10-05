import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import JobsMenu from "./JobsMenu";
import CardJobsInfo from "@/screens/courier/dashboard/components/CardJobsInfo";
import CardStatus from "@/screens/courier/dashboard/components/CardStatus";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import JobsRequestsTable, {
  JobRequest,
} from "@/screens/courier/dashboard/components/JobsRequestsTable";
import JobsInfoSheet from "@/screens/courier/dashboard/components/JobsInfoSheet";
import Profile from "@/screens/courier/profile/components/Profile";
import { getDriverByID } from "@/actions/driverActions";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduledTrips from "./TripCard";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
  AccordionHeader,
} from "@radix-ui/react-accordion";
import { ChevronDown, ChevronUp } from "lucide-react";

const Jobs = () => {
  const { user } = useUser();
  const [sortType, setSortType] = useState("mostRecent");
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChevronUp, setIsChevronUp] = useState(false);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!user) return;

      try {
        const data = await getDriverByID(user.id);

        setDriverData(data.data);
      } catch (err) {
        setError("Failed to fetch driver data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [user]);

  const handleSortChange = (newSortType: string) => {
    setSortType(newSortType);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleJobSelect = (job: JobRequest | null) => {
    setSelectedJob(job);

    setIsModalOpen(!!job);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSheetOpen(window.innerWidth < 1441);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 border">
          <Skeleton className="h-24 md:h-72 w-full mb-24" />
          <Skeleton className="h-8 w-1/6" />
          <Skeleton className="h-8 w-[40%]" />
          <Skeleton className="h-96 w-full" />
        </div>
      );
    }

    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <Profile driverData={driverData} />

        <div className="flex flex-col md:hidden justify-start w-full">
          <CardStatus />
          <div className="flex justify-center items-center border text-center pt-4 p-3 bg-muted">
            <Accordion type="single" collapsible>
              <AccordionItem value="Schedualed-trips">
                <AccordionTrigger>
                  <div className="flex flex-col">
                    <p>My Scheduled Trips</p>
                    <p className="flex justify-center">
                      {isChevronUp ? (
                        <ChevronUp
                          className="h-4 w-4"
                          onClick={() => setIsChevronUp(false)}
                        />
                      ) : (
                        <ChevronDown
                          className="h-4 w-4"
                          onClick={() => setIsChevronUp(true)}
                        />
                      )}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ScheduledTrips />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="hidden md:block mylg:block">
          <ScheduledTrips />
        </div>

        <h1 className="lg:text-left text-center font-semibold text-lg py-8">
          Job Requests
        </h1>
        <JobsMenu onSortChange={handleSortChange} onSearch={handleSearch} />
        <JobsRequestsTable
          sortType={sortType}
          onJobSelect={handleJobSelect}
          searchTerm={searchTerm}
        />
      </div>
    );
  };
  return (
    <div className="flex flex-row justify-center lg:justify-start">
      <div className="hidden mylg:w-[2.5%] 2xl:w-[10%] lg:block"></div>

      <div className="flex flex-row w-full mylg:w-[95%] 2xl:w-[80%] justify-center">
        <div className="w-[98%] md:w-[80%] mylg:w-[72%]">{renderContent()}</div>

        <div className="relative hidden mylg:block h-full w-[28%] bg-muted/80">
          <div className="fixed top-[160px] w-[26.5%] sideScreen:w-[22.5%]">
            <CardStatus />
            <CardJobsInfo job={selectedJob} isOpen={isModalOpen} />
          </div>
        </div>
      </div>
      <div className="hidden">
        {isSheetOpen && (
          <div className="shadcn-sheet">
            <JobsInfoSheet
              job={selectedJob}
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
