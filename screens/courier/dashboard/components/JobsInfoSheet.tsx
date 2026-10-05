import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CardJobsInfo from "@/screens/courier/dashboard/components/CardJobsInfo";
import { JobRequest } from "@/screens/courier/dashboard/components/JobsRequestsTable";

interface JobsInfoSheetProps {
  job: JobRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobsInfoSheet: React.FC<JobsInfoSheetProps> = ({
  job,
  isOpen,
  onOpenChange,
}) => {
  return (
    <div className="hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="bg-white bg-opacity-5 backdrop-blur-sm md:bg-white w-full  sm:max-w-full"
        >
          <SheetHeader>
            <SheetTitle className="text-white font">Job Details</SheetTitle>
          </SheetHeader>
          <CardJobsInfo job={job} isOpen={isOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default JobsInfoSheet;
