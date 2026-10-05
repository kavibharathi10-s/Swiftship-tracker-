import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface JobsRequestsProps {
  profilePhoto: string;
  name: string;
  pickUpLocation: string;
  dropOffLocation: string;
  jobDate: string;
  amount: string;
  postDate: string;
  parcelSize: string;
  description: string;
  isSelected?: boolean;
}

const JobsRequests: React.FC<JobsRequestsProps> = ({
  profilePhoto,
  name,
  pickUpLocation,
  dropOffLocation,
  jobDate,
  amount,
  postDate,
  parcelSize,
  description,
  isSelected = false,
}) => {
  return (
    <Card
      className={`w-full rounded-none border-none shadow-none ${
        isSelected ? "bg-muted/80" : ""
      }`}
    >
      <CardContent className="p-6 border-b">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-6">
          {/* Left Section */}
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full lg:w-3/4">
            {/* Avatar and Name */}
            <div className="flex items-center w-full lg:w-1/3">
              <Avatar className="h-16 w-16 border-2 border-gray-200 rounded-full mr-4 flex-shrink-0">
                <AvatarImage
                  src={profilePhoto}
                  alt={name}
                  className="h-full w-full rounded-full object-cover"
                  width={48}
                  height={48}
                />
              </Avatar>
              <div className="font-bold text-lg truncate">{name}</div>
            </div>

            {/* Locations */}
            <div className="flex flex-col w-full lg:w-2/3 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold w-20 flex-shrink-0">
                  Pick Up:
                </span>
                <span className="truncate">{pickUpLocation}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold w-20 flex-shrink-0">
                  Drop Off:
                </span>
                <span className="truncate">{dropOffLocation}</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between h-full w-full lg:w-1/4">
            <div className="text-lg font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-full">
              {amount}
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                <span>{jobDate}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <span>Posted {postDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsRequests;
