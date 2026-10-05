import React, { FC } from "react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getJobById } from "@/actions/courierJobsActions";
import { User } from "lucide-react";

export interface JobRequest {
  Id: string;
  isApproved: boolean;
  CourierJob: {
    Id: string;
    Title: string;
    Description: string;
    Budget: string;
    PickUp: string;
    DropOff: string;
    districtPickUp: string;
    districtDropOff: string;
    pickupPhoneNumber: string;
    dropoffPhoneNumber: string;
    dropOffEmail: string;
    parcelSize: string;
    dimensions?: string;
    weight?: string;
    suitableVehicles?: string;
    isDirect?: boolean;
    client: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
    };
    deliveryDate: string;
    recipientName: string;
    recipientGender: string;
    packageType: string;
    parcelHandling: string;
    dateCreated: string;
    collectionDate: string;
  };
}

interface MyRequestsProps {
  jobRequests: JobRequest[];
  directRequests: any[];
  onRequestClick: (jobRequest: any) => void;
}

const MyRequests: FC<MyRequestsProps> = ({
  jobRequests,
  directRequests,
  onRequestClick,
}) => {
  return (
    <Tabs defaultValue="my-requests" className="w-full">
      <TabsContent value="my-requests">
        <Card className="mb-8">
          <CardHeader className="px-4 md:px-7">
            <CardTitle>Direct Client Requests</CardTitle>
            <CardDescription className="text-sm">
              View and manage direct
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="hidden min-w-[140px] sm:table-cell">
                      Pickup Location
                    </TableHead>
                    <TableHead className="hidden min-w-[140px] sm:table-cell">
                      Dropoff Location
                    </TableHead>
                    <TableHead className="hidden lg:flex items-center justify-center">
                      <p>
                        <User className="h-4 w-4" />
                      </p>
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directRequests && directRequests.length > 0 ? (
                    directRequests.map((directRequest) => (
                      <TableRow
                        key={directRequest.Id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRequestClick(directRequest)}
                      >
                        <TableCell>
                          <div className="font-medium line-clamp-1">
                            {directRequest.CourierJob?.Title || ""}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:block line-clamp-2">
                            {directRequest.CourierJob?.Description || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="line-clamp-1">
                            {directRequest.CourierJob?.PickUp || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="line-clamp-1">
                            {directRequest.CourierJob?.DropOff || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="line-clamp-1">
                            {directRequest.CourierJob?.client?.firstName || ""}{" "}
                            {directRequest.CourierJob?.client?.lastName || ""}
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          M {directRequest.CourierJob?.Budget || ""}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No job requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 md:px-7">
            <CardTitle>My Job Requests</CardTitle>
            <CardDescription className="text-sm">
              View and track the status of your job applications
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="hidden min-w-[140px] sm:table-cell">
                      Pickup Location
                    </TableHead>
                    <TableHead className="hidden min-w-[140px] sm:table-cell">
                      Dropoff Location
                    </TableHead>
                    <TableHead className="hidden lg:flex items-center justify-center">
                      <p>
                        <User className="h-4 w-4" />
                      </p>
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobRequests && jobRequests.length > 0 ? (
                    jobRequests.map((request) => (
                      <TableRow
                        key={request.Id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRequestClick(request)}
                      >
                        <TableCell>
                          <div className="font-medium line-clamp-1">
                            {request.CourierJob?.Title || ""}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:block line-clamp-2">
                            {request.CourierJob?.Description || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="line-clamp-1">
                            {request.CourierJob?.PickUp || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="line-clamp-1">
                            {request.CourierJob?.DropOff || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="line-clamp-1">
                            {request.CourierJob?.client?.firstName || ""}{" "}
                            {request.CourierJob?.client?.lastName || ""}
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          M {request.CourierJob?.Budget || ""}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No job requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MyRequests;
