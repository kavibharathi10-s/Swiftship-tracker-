import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MapPin,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./JobsTable";
import MapComponent from "@/screens/global/PickUpDropOffLoc";
import { formatDateNoHrs } from "./utils/jobTable";

interface JobDetailsProps {
  job: {
    Id: string;
    jobStatus: string;
    startDate: string;
    CourierJob: {
      deliveryDate?: string;
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
      collectionDate: string;
      dimensions?: string;
      weight?: string;
      suitableVehicles?: string;
      recipientName: string;
      recipientGender: string;
      packageType: string;
      parcelHandling: string;
      PickUpLocation: string;
      DropOffLocation: string;
    };
    Client: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    Driver: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      vehicleType: string;
    };
  };
}

export default function Details({ job }: JobDetailsProps) {
  function removeCommas(value: string) {
    return String(value).replace(/,/g, "");
  }

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
    <div>
      <Card className="overflow-hidden lg:flex flex-col">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {job.CourierJob.Title}
              <StatusBadge status={job.jobStatus} />
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            {/* Card Description */}
            <CardDescription>
              Order ID: {job.Id}
              <br />
              Collection Date: {formatDate(job.CourierJob.collectionDate)}
              {job.CourierJob.deliveryDate && (
                <>
                  <br />
                  Delivery Date: {formatDateNoHrs(job.CourierJob.deliveryDate)}
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-semibold">Delivery Details</Button>
              </DialogTrigger>
              <DialogContent className="md:w-[80%] w-full rounded-md">
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                </DialogHeader>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span>M {job.CourierJob.Budget}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span>{job.CourierJob.Description}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="flex-wrap">{job.CourierJob.weight}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="flex-wrap">
                      {job.CourierJob.dimensions}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Parcel Size</span>
                    <span>{job.CourierJob.parcelSize}</span>
                  </li>
                  {job.CourierJob.parcelHandling && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Handling requirements
                      </span>
                      <span>{job.CourierJob.parcelHandling}</span>
                    </li>
                  )}
                  {job.CourierJob.packageType && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Packaging</span>
                      <span>{job.CourierJob.packageType}</span>
                    </li>
                  )}
                  {job.CourierJob.recipientName && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recipient</span>
                      <span>
                        {job.CourierJob.recipientName} -{" "}
                        {job.CourierJob.recipientGender}{" "}
                      </span>
                    </li>
                  )}
                </ul>
                <DialogFooter></DialogFooter>
                <DialogClose>
                  <Button className="font-bold text-lg">Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Separator className="my-2" />
            <div className="grid gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="font-semibold">Pickup Information</Button>
                </DialogTrigger>
                <DialogContent className="w-[80%] rounded-md">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <div className="font-semibold">Pickup Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>
                        {job.CourierJob.PickUp}
                        <MapPin size={16} color="#3500f5" />
                      </span>
                      <span>{job.CourierJob.districtPickUp}</span>
                      <span>Phone: {job.CourierJob.pickupPhoneNumber}</span>
                      <span>
                        Collection Date:{" "}
                        {new Date(job.CourierJob.collectionDate).toString()}
                      </span>
                    </address>
                    <div className="w-full">
                      <MapComponent
                        pickup={job.CourierJob.PickUp}
                        dropoff={job.CourierJob.DropOff}
                      />
                    </div>
                  </div>
                  <DialogFooter></DialogFooter>
                  <DialogClose>
                    <Button className="font-bold text-lg">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="font-semibold">Pickup Information</Button>
                </DialogTrigger>
                <DialogContent className="w-[80%] rounded-md">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <div className="font-semibold">Dropoff Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>
                        {job.CourierJob.DropOff}
                        <MapPin size={16} color="#bd0a0a" />
                      </span>
                      <span>{job.CourierJob.districtDropOff}</span>
                      <span>Phone: {job.CourierJob.dropoffPhoneNumber}</span>
                      <span>Email: {job.CourierJob.dropOffEmail}</span>
                    </address>
                    <div className="space-y-4 flex gap-1 justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <p className="underline text-sm text-blue-400 cursor-pointer">
                            View Images of the Pick Up and Drop Off Location
                          </p>
                        </DialogTrigger>
                        <DialogContent className="w-full md:w-[80%]">
                          <DialogHeader>
                            <DialogTitle>
                              Images of the Pick Up and Drop Off Location
                            </DialogTitle>
                            <DialogDescription>
                              These are the images of the Pick Up and Drop Off
                              Location
                            </DialogDescription>
                          </DialogHeader>
                          <DialogTitle>
                            Image of the Pick Up Location
                          </DialogTitle>
                          <img
                            src={job.CourierJob.PickUpLocation}
                            alt="Pick Up"
                          />
                          <DialogTitle>
                            Image of the Drop Off Location
                          </DialogTitle>
                          <img
                            src={job.CourierJob.DropOffLocation}
                            alt="Drop Off"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="w-full">
                      <MapComponent
                        pickup={job.CourierJob.PickUp}
                        dropoff={job.CourierJob.DropOff}
                      />
                    </div>
                  </div>
                  <DialogFooter></DialogFooter>
                  <DialogClose>
                    <Button className="font-bold text-lg">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              {/* <div className="w-full">
                <MapComponent
                  pickup={job.CourierJob.PickUp}
                  dropoff={job.CourierJob.DropOff}
                />
              </div> */}
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Client Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>
                    {job.Client.firstName} {job.Client.lastName}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${job.Client.email}`}>
                      {job.Client.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${job.Client.phoneNumber}`}>
                      {job.Client.phoneNumber}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Driver Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>
                    {job.Driver.firstName} {job.Driver.lastName}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${job.Driver.phoneNumber}`}>
                      {job.Driver.phoneNumber}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Vehicle Type</dt>
                  <dd>{removeCommas(job.Driver.vehicleType)}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Payment Status
                  </dt>
                  <dd>Pending</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
