import React, { useState } from "react";
import { Copy, CreditCard, MoreVertical, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./JobsTable";
import { JobRequest } from "./MyRequests";
import MapComponent from "@/screens/global/PickUpDropOffLoc"; // Map component
import { approveDirectRequest } from "@/actions/directRequestActions";
import { formatDate, formatDateNoHrs } from "./utils/jobTable";

interface RequestDetailsProps {
  request: JobRequest;
  onRequestApproved?: (requestId: string) => void;
}

export default function RequestDetails({
  request,
  onRequestApproved,
}: RequestDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approveRequest = async () => {
    setIsSubmitting(true);
    try {
      const requestObj = await approveDirectRequest(request.Id);
      if (requestObj) {
        toast({
          title: "Request approved",
          description: "Your job approval was successful.",
        });
        if (onRequestApproved) {
          onRequestApproved(request.Id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to approve request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Error",
        description: "An error occurred while approving the request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {request.CourierJob.Title}
              <StatusBadge
                status={request.isApproved ? "Approved" : "Pending"}
              />
              <StatusBadge
                status={request.isApproved ? "Approved" : "Pending"}
              />
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Request ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Request ID: {request.Id}
              <br />
              Date Created:{" "}
              {new Date(request.CourierJob.dateCreated).toLocaleString()}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Job Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span>M {request.CourierJob.Budget}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{request.CourierJob.Description}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Weight</span>
                <span>{request.CourierJob.weight}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Dimensions</span>
                <span>{request.CourierJob.dimensions}</span>
              </li>
              {request.CourierJob.parcelHandling && (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Handling requirements
                  </span>
                  <span>{request.CourierJob.parcelHandling}</span>
                </li>
              )}
              {request.CourierJob.packageType && (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Packaging</span>
                  <span>{request.CourierJob.packageType}</span>
                </li>
              )}
              {request.CourierJob.recipientName && (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span>
                    {request.CourierJob.recipientName} -{" "}
                    {request.CourierJob.recipientGender}{" "}
                  </span>
                </li>
              )}
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Collection Date</span>
                <span>{formatDate(request.CourierJob.collectionDate)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery Date</span>
                <span>{formatDateNoHrs(request.CourierJob.deliveryDate)}</span>
              </li>
            </ul>
            <div className="grid gap-4 mt-4">
              <div className="grid gap-3">
                <div className="font-semibold">Pickup Information</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  <span>
                    {request.CourierJob.PickUp}{" "}
                    <MapPin size={16} color="#3500f5" />
                  </span>
                  <span>{request.CourierJob.districtPickUp}</span>
                  <span>Phone: {request.CourierJob.pickupPhoneNumber}</span>
                  <span>
                    Collection Date:{" "}
                    {new Date(
                      request.CourierJob.collectionDate
                    ).toLocaleString()}
                  </span>
                </address>
              </div>
              <div className="grid gap-3">
                <div className="font-semibold">Dropoff Information</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  <span>
                    {request.CourierJob.DropOff}{" "}
                    <MapPin size={16} color="#bd0a0a" />
                  </span>
                  <span>{request.CourierJob.districtDropOff}</span>
                  <span>Phone: {request.CourierJob.dropoffPhoneNumber}</span>
                  <span>Email: {request.CourierJob.dropOffEmail}</span>
                </address>
              </div>
              <MapComponent
                pickup={request.CourierJob.PickUp}
                dropoff={request.CourierJob.DropOff}
              />
            </div>
            <div className="grid gap-3 mt-4">
              <div className="font-semibold">Client Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>
                    {request.CourierJob.client.firstName}{" "}
                    {request.CourierJob.client.lastName}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${request.CourierJob.client.email}`}>
                      {request.CourierJob.client.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${request.CourierJob.client.phoneNumber}`}>
                      {request.CourierJob.client.phoneNumber}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="grid gap-3 mt-4">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Payment Status
                  </dt>
                  <dd>Pending</dd>{" "}
                  {/* Adjust this based on actual payment status */}
                </div>
              </dl>
            </div>
            {request.CourierJob.isDirect && (
              <Button
                onClick={approveRequest}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </div>
                ) : (
                  "Accept"
                )}
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <Button size="icon" variant="outline">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More Actions</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
