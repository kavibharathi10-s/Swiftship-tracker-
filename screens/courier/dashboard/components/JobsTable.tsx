import React, { FC, useState } from "react";
import {
  MoreVertical,
  Check,
  Package,
  Clock,
  UserCircle,
  PackageCheck,
  Truck,
  Home,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ActiveJob,
  JOB_STATUS,
  STATUS_DESCRIPTIONS,
  STATUS_ACTIONS,
  STATUS_STYLES,
  filterJobsByStatus,
  capitalizeFirstLetter,
} from "@/screens/courier/dashboard/components/utils/jobTable";
import MyRequests from "@/screens/courier/dashboard/components/MyRequests";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TableProps {
  jobs: ActiveJob[] | undefined;
  jobRequests: any[] | undefined;
  directRequests: any[] | undefined;
  onRowClick: (job: ActiveJob) => void;
  onRequestClick: (job: any) => void;
  onStatusChange: (jobId: string, newStatus: string) => Promise<void>;
  isLoading?: boolean;
}

type JobStatusType = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const StatusBadge: FC<{ status: string }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
      STATUS_STYLES[status as keyof typeof STATUS_STYLES]
    }`}
  >
    {capitalizeFirstLetter(status)}
  </span>
);

const StatusActions: FC<{
  job: ActiveJob;
  onStatusChange: (jobId: string, newStatus: string) => Promise<void>;
}> = ({ job, onStatusChange }) => {
  const currentActions =
    STATUS_ACTIONS[job.jobStatus as keyof typeof STATUS_ACTIONS] || [];

  if (!currentActions.length) {
    return null;
  }
  // Function to check if a date is within 2 days from now

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentActions.map((action) => (
          <DropdownMenuItem
            key={action.status}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(job.Id, action.status);
            }}
            className="flex items-center gap-2"
          >
            {action.icon === "Package" ? (
              <Package className="h-4 w-4" />
            ) : action.icon === "Check" ? (
              <Check className="h-4 w-4" />
            ) : null}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const LoadingState: FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin  rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </CardContent>
  </Card>
);

const JobsTable: FC<TableProps> = ({
  jobs,
  jobRequests,
  directRequests,
  onRowClick,
  onRequestClick,
  onStatusChange,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>(JOB_STATUS.Ongoing);
  if (isLoading) return <LoadingState />;
  const isWithinTwoDays = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    return date <= twoDaysFromNow && date >= now;
  };

  const getStatusIcon = (status: JobStatusType) => {
    switch (status) {
      case JOB_STATUS.Ongoing:
        return <Clock className="h-4 w-4 text-red-600" />;
      case JOB_STATUS.COLLECTED:
        return <PackageCheck className="h-4 w-4 text-blue-500" />;
      case JOB_STATUS.DELIVERED:
        return <Home className="h-4 w-4 text-green-500" />; // Replacing Truck with Home
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  function formatDate(isoDate: any) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoDate));
  }

  return (
    <Tabs
      defaultValue={JOB_STATUS.Ongoing}
      onValueChange={(value: string) => setActiveTab(value)}
    >
      <TabsList className="flex w-full items-center gap-1 p-1">
        {Object.values(JOB_STATUS)
          .filter((status) => status !== "unclaimed") // Exclude "unclaimed"
          .map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="flex items-center gap-1 flex-1 min-w-0"
              data-state={activeTab === status ? "active" : "inactive"}
            >
              <span>{getStatusIcon(status)}</span> {/* Only display icons */}
              {filterJobsByStatus(jobs, status).length > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs">
                  {filterJobsByStatus(jobs, status).length}
                </span>
              )}
            </TabsTrigger>
          ))}

        <TabsTrigger
          value="my-requests"
          className="flex items-center gap-1"
          data-state={activeTab === "my-requests" ? "active" : "inactive"}
        >
          <span>
            <UserCircle className="h-4 w-4" />
          </span>
        </TabsTrigger>
      </TabsList>

      {Object.values(JOB_STATUS)
        .filter((status) => status !== "unclaimed")
        .map((status) => (
          <TabsContent key={status} value={status}>
            {activeTab === status && (
              <Card>
                <CardHeader className="px-4 md:px-7">
                  <CardTitle>Deliveries</CardTitle>
                  <CardDescription className="text-sm">
                    {
                      STATUS_DESCRIPTIONS[
                        status as keyof typeof STATUS_DESCRIPTIONS
                      ]
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead className="hidden lg:flex items-center justify-center">
                            <p>
                              <User className="h-4 w-4" />
                            </p>
                          </TableHead>
                          {status === JOB_STATUS.Ongoing ? (
                            <TableHead>Pickup</TableHead>
                          ) : (
                            <TableHead>Dropoff</TableHead>
                          )}

                          <TableHead className="hidden min-w-[130px] lg:table-cell">
                            Collection Date
                          </TableHead>
                          <TableHead className="hidden lg:flex items-center justify-center">
                            <p className="text-green-500">M</p>
                          </TableHead>

                          <TableHead className="hidden lg:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterJobsByStatus(jobs, status).map((job) => (
                          <TableRow
                            key={job.Id}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => onRowClick(job)}
                          >
                            <TableCell>
                              <div className="font-medium line-clamp-1 flex gap-2">
                                {isWithinTwoDays(
                                  job.CourierJob.collectionDate
                                ) && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Truck className="h-4 w-4 text-blue-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delivery due within 2 days</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {job.CourierJob.Title}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="line-clamp-1">
                                {job.Client.firstName} {job.Client.lastName}
                              </div>
                            </TableCell>
                            {status === JOB_STATUS.Ongoing ? (
                              <TableCell>
                                <div className="line-clamp-1">
                                  {job.CourierJob.PickUp}
                                </div>
                              </TableCell>
                            ) : (
                              <TableCell>
                                <div className="line-clamp-1">
                                  {job.CourierJob.DropOff}
                                </div>
                              </TableCell>
                            )}
                            <TableCell className="hidden lg:table-cell">
                              {formatDate(job.CourierJob.collectionDate)}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              M {job.CourierJob.Budget}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <StatusBadge status={job.jobStatus} />
                            </TableCell>
                            <TableCell>
                              <StatusActions
                                job={job}
                                onStatusChange={onStatusChange}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {filterJobsByStatus(jobs, status).length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="h-24 text-center text-muted-foreground"
                            >
                              No {status.toLowerCase()} deliveries found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}

      {activeTab === "my-requests" && (
        <MyRequests
          jobRequests={jobRequests || []}
          directRequests={directRequests || []}
          onRequestClick={onRequestClick}
        />
      )}
    </Tabs>
  );
};

export default JobsTable;
