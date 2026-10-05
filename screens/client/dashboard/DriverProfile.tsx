"use client";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  CircleX,
  Loader2,
  MessageSquare,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";
import { approveJobRequest } from "@/actions/jobRequestActions";
import { useRouter } from "next/navigation";
import MapComponent from "@/screens/track-delivery/ReverseGeocoding";
import { StarRating } from "@/app/(client)/driver-profile/components/ReviewSection/components/StarRating";
import { useDriverReviews } from "@/app/(client)/driver-profile/components/ReviewSection/hooks/useDriverReviews";
import Link from "next/link";

type Props = {
  driver: any;
  job: any;
};

const DriverProfile = ({ driver, job }: Props) => {
  const [isHired, setIsHired] = useState(false);
  const [isError, setIsError] = useState(false);
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isWindow, setIsWindow] = useState(false);
  const [isJobDirect, setIsJobDirect] = useState(false);
  const [overallReview, setOverAllReview] = useState(0);
  const { reviews } = useDriverReviews(driver.Id);

  useEffect(() => {
    setIsWindow(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (job.isDirect) {
      setIsJobDirect(true);
    }
  }, [job.isDirect]);

  useEffect(() => {
    if (reviews) {
      const overallRating = reviews.reduce((acc, review) => {
        return acc + review.rating;
      }, 0);
      setOverAllReview(overallRating / reviews.length);
    }
  }, [reviews]);

  const hire = async () => {
    setIsLoading(true);
    const response = await approveJobRequest({
      driverId: driver.Id,
      clientId: userId || "",
      courierJobId: job.Id,
    });
    if (response === 0 || response === 2) {
      router.refresh();
    } else if (response === 1) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
      <div className="flex justify-start mb-4 sm:mb-0">
        <Avatar>
          <AvatarImage src={driver.photoUrl} alt={driver.lastName} />
        </Avatar>
      </div>

      <div className="flex-grow space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className="text-lg font-semibold">{`${driver.firstName} ${driver.lastName}`}</h3>
          <Badge variant="secondary" className="w-fit">
            <StarRating rating={overallReview} />
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            current location:
            {isWindow ? (
              <MapComponent
                initialPosition={{ lat: 51.505, lng: -0.09 }}
                zoomLevel={13}
                driverId={driver.Id}
              />
            ) : null}
          </p>
        </div>

        <div className="">
          {isLoading ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
              disabled
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
                onClick={hire}
                disabled={isHired || isError || isJobDirect}
              >
                {isHired ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    <span>Hired</span>
                  </>
                ) : isError ? (
                  <>
                    <CircleX className="h-4 w-4 text-red-500" />
                    <span>Please refresh and try again</span>
                  </>
                ) : (
                  <>
                    {isJobDirect ? (
                      <div>Not Approved</div>
                    ) : (
                      <>
                        <Truck className="h-4 w-4" />
                        <span>Hire</span>
                      </>
                    )}
                  </>
                )}
              </Button>
              {isHired && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap">
          <dl className="grid gap-3  w-full">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Driver</dt>
              <dd className="flex flex-wrap">
                {driver?.firstName} {driver?.lastName}
              </dd>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${driver?.email}`} className="flex flex-wrap">
                  {driver?.email}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd className="flex flex-wrap">{driver.vehicleType}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:${driver.phoneNumber}`}>{driver.phoneNumber}</a>
              </dd>
            </div>
          </dl>
        </div>

        <Link href={`/driver-profile/${driver.Id}`} prefetch={true}>
          <Button className="w-full" variant="outline" size="sm">
            Courier Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DriverProfile;
