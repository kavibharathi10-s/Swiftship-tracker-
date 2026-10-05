import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JobRequest } from "./JobsRequestsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ApplyButton from "./ApplyButton";
import RequestButton from "./RequestButton";
import { MapPin, Calendar, Package, DollarSign, Clock } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  ApplicationStatus,
  checkJobApplication,
  formatClientName,
  formatBudget,
  checkRequest,
} from "./utils/jobsInfo";
import CardJobsLoad from "./CardJobsLoad";
import { formatDate, formatDateNoHrs } from "./utils/jobTable";
interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

interface RequestStatus {
  isPending: boolean;
  isAccepted: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  const { userId } = useAuth();
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>("not_applied");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({
    isPending: false,
    isAccepted: false,
  });
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const initializeData = async () => {
      if (userId && job) {
        setLoading(true);
        setIsRequestLoading(true);

        try {
          const [applicationResult, requestStatus] = await Promise.all([
            // Only check job application if there's an approvedRequestId
            job.approvedRequestId?.length > 0
              ? checkJobApplication(userId, job)
              : Promise.resolve(null),
            // Check request status if client.Id exists
            job.client.Id
              ? checkRequest(userId, job.client.Id)
              : Promise.resolve(null),
          ]);

          if (isSubscribed) {
            if (applicationResult) {
              setApplicationStatus(applicationResult.status);
              setErrorMessage(applicationResult.errorMessage);
            }

            if (requestStatus) {
              setRequestStatus(requestStatus);
            }

            setIsInitialCheckDone(true);
          }
        } catch (error) {
          console.error("Error initializing data:", error);
          if (isSubscribed) {
            setIsInitialCheckDone(true);
          }
        } finally {
          if (isSubscribed) {
            setLoading(false);
            setIsRequestLoading(false);
          }
        }
      }
    };

    initializeData();

    return () => {
      isSubscribed = false;
    };
  }, [userId, job]);

  // Render logic
  if (!job) return null;

  if (loading || isRequestLoading) {
    return <CardJobsLoad />;
  }

  const { fullName, initials } = formatClientName(
    job.client.firstName,
    job.client.lastName
  );

  function formatDate(isoDate: any) {
    console.log("ISO Date:", isoDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoDate));
  }

  return (
    <div className="sm:p-0 md:p-1 lg:p-3 flex items-center lg: justify-center w-full h-full z-50">
      <Card className="w-full max-w-lg bg-white shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarImage
                  src={job.client.photoUrl || "/default-photo.jpg"}
                  alt={fullName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {fullName}
                </h3>
                <p className="text-sm text-gray-500">Sender</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {job.Title}
            </h2>
            <p className="text-gray-600 text-sm">
              {job.Description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Pick Up</div>
                {job.PickUp || "No pickup location"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Drop Off</div>
                {job.DropOff || "No dropoff location"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Collection Date</div>
                {formatDate(job.collectionDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Delivery Date</div>
                {formatDateNoHrs(job.deliveryDate.toString())}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Parcel Size</div>
                {job.parcelSize || "Not specified"}
              </span>
            </div>
            {job.parcelHandling && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span className="text-sm">
                  <div className="font-medium">{job.parcelHandling}</div>
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">
                  {job.isPackaged ? "Packaged" : "Not packaged"}
                </div>
              </span>
            </div>
            {job.packageType && job.isPackaged && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span className="text-sm">
                  <div className="font-medium">{job.packageType}</div>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Posted {formatDateNoHrs(job.dateCreated.toString())}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-gray-800">
                {formatBudget(job.Budget)}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <RequestButton
              clientId={job.client.Id}
              userId={userId || ""}
              requestStatus={requestStatus}
              isInitialCheckDone={isInitialCheckDone}
              isRequestLoading={isRequestLoading}
              setIsRequestLoading={setIsRequestLoading}
              setRequestStatus={setRequestStatus}
            />
            <ApplyButton
              jobId={job.Id}
              userId={userId || ""}
              applicationStatus={applicationStatus}
              setApplicationStatus={setApplicationStatus}
              setErrorMessage={setErrorMessage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default CardJobsInfo;
