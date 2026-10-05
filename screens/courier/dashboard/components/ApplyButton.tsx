import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2, AlertCircle } from "lucide-react";
import { ApplicationStatus, applyForJob } from "./utils/jobsInfo";
import useDriverDetails from "@/screens/courier/registration/utils/DriverDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApplyButtonProps {
  jobId: string;
  userId: string;
  applicationStatus: ApplicationStatus;
  setApplicationStatus: (status: ApplicationStatus) => void;
  setErrorMessage: (message: string | null) => void;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({
  jobId,
  userId,
  applicationStatus,
  setApplicationStatus,
  setErrorMessage,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const { driverData } = useDriverDetails();

  const jobApply = async () => {
    try {
      setApplicationStatus("applying");
      const result = await applyForJob(jobId, userId);
      setApplicationStatus(result.status);
      setErrorMessage(result.errorMessage || null);
      setOpenDialog(false); // Close dialog after attempting to apply
    } catch (error) {
      console.error("Error applying for job:", error);
      setApplicationStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleDialogCancel = () => {
    setOpenDialog(false); // Close dialog on cancel
  };

  if (driverData?.isVerified === false) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full"
              disabled
            >
              <span>Apply</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Not verified</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  switch (applicationStatus) {
    case "applying":
      return (
        <Button
          className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full"
          disabled
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Applying...</span>
        </Button>
      );
    case "applied":
      return (
        <div className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full">
          <CheckCheck className="w-4 h-4" />
          <span>Applied</span>
        </div>
      );
    case "error":
      return (
        <Button
          className="flex items-center justify-center space-x-2 border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded-md my-2 w-full"
          onClick={() => setApplicationStatus("not_applied")}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Error - Try Again</span>
        </Button>
      );
    case "not_applied":
      return (
        <>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
                variant="outline"
              >
                <CheckCheck className="w-4 h-4 text-black" />
                <span className="text-black">Apply</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <p>Are you sure you want to apply for this job?</p>
              </DialogHeader>
              <DialogFooter className="flex justify-between items-center gap-4">
                <Button variant="outline" onClick={handleDialogCancel}>
                  Cancel
                </Button>
                <Button variant="default" onClick={jobApply}>
                  Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
  }
};
export default ApplyButton;
