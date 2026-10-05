import React from "react";
import {
  User,
  Truck,
  CreditCard,
  Calendar,
  Star,
  MapPin,
  Shield,
  Award,
  Clock,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import CardStatus from "@/screens/courier/dashboard/components/CardStatus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScheduledTrips from "@/screens/courier/dashboard/components/TripCard";


type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

interface ProfileProps {
  driverData: any; // Replace 'any' with a more specific type if you have one
}

const Profile: React.FC<ProfileProps> = ({ driverData }) => {
  function removeCommas(value: string) {
    return String(value).replace(/,/g, "");
  }

  const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-2">
      {icon}
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );

  interface InfoSectionProps {
    title: string;
    items: React.ReactNode;
  }

  const InfoSection: React.FC<InfoSectionProps> = ({ title, items }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2 sm:mb-3">{title}</h3>
      <div className="space-y-2">{items}</div>
    </div>
  );

  // const PerformanceMetric: React.FC<{
  //   icon: React.ReactNode;
  //   value: number;
  //   label: string;
  // }> = ({ icon, value, label }) => (
  //   <div className="flex flex-col items-center">
  //     <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary mb-2">
  //       {icon}
  //     </div>
  //     <Progress value={value} className="w-12 sm:w-16 h-2 mb-1" />
  //     <div className="text-lg sm:text-xl font-bold">{value}%</div>
  //     <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
  //   </div>
  // );

  const driverInfoItems = (
    <>
      <InfoItem
        icon={<User className="w-4 h-4 text-primary" />}
        label="ID No."
        value={driverData?.idNumber || ""}
      />
      <InfoItem
        icon={<User className="w-4 h-4 text-primary" />}
        label="Phone No."
        value={driverData?.phoneNumber || ""}
      />
      <InfoItem
        icon={<CreditCard className="w-4 h-4 text-primary" />}
        label="License No."
        value={driverData?.licenseNumber || ""}
      />
      <InfoItem
        icon={<Calendar className="w-4 h-4 text-primary" />}
        label="License Expires"
        value={driverData?.licenseExpiry || ""}
      />
    </>
  );

  const vehicleInfoItems = (
    <>
      <InfoItem
        icon={<Truck className="w-4 h-4 text-primary" />}
        label="Vehicle Type"
        value={removeCommas(driverData?.vehicleType || "")}
      />
      <InfoItem
        icon={<Truck className="w-4 h-4 text-primary" />}
        label="Plate No."
        value={driverData?.plateNumber || ""}
      />
      <InfoItem
        icon={<Shield className="w-4 h-4 text-primary" />}
        label="Vehicle Registration No."
        value={driverData?.vehicleRegistrationNo || ""}
      />
      <InfoItem
        icon={<Calendar className="w-4 h-4 text-primary" />}
        label="Disc Expires"
        value={driverData?.discExpiry || ""}
      />
    </>
  );

  return (
    <Card className="flex flex-col p-2 sm:p-4 border border-gray-200 rounded-lg mb-6 sm:mb-12">
      <CardHeader className="relative pb-0">
        <div className="absolute top-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-b from-primary/50 to-white opacity-20 rounded-t-lg" />
        <div className="relative z-10 flex flex-col items-center sm:flex-row sm:items-center justify-between">
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4">
            <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-background mb-4 sm:mb-0">
              <AvatarImage
                src={driverData?.photoUrl || ""}
                alt={`${driverData?.firstName} ${driverData?.lastName}`}
              />
              <AvatarFallback>
                {`${driverData?.firstName?.[0]}${driverData?.lastName?.[0]}`}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {`${driverData?.firstName} ${driverData?.lastName}`}
              </h2>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {driverData?.location || "Location not available"}
              </div>
              {driverData?.isVerified ? (
                <Badge
                  variant="outline"
                  className="bg-blue-500 text-xs text-white border my-2"
                >
                  <ShieldCheck className="w-4 mr-1" /> <p>Verified</p>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-blue-500 text-xs text-white border my-2"
                >
                  <ShieldX className="w-4 mr-1" /> <p>Not Verified</p>
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="hidden md:block mylg:hidden justify-start md:justify-end mylg:justify-start mr-2 sm:mr-0 sm:mb-2">
              <CardStatus />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6 pb-2 sm:pb-4">
        {/* Desktop view */}

        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <InfoSection title="Driver Information" items={driverInfoItems} />
          <InfoSection title="Vehicle Information" items={vehicleInfoItems} />
        </div>

      <div className="hidden mylg:w-[2.5%] 2xl:w-[10%] lg:block"></div>


        {/* Mobile view with accordion */}
        <div className="sm:hidden">
          <Accordion type="single" collapsible className="w-full bg-white">
            <AccordionItem value="driver-info" className="border-none">
              <AccordionTrigger className="text-lg font-semibold no-underline">
                <img src="/assets/public/id-card.png" alt="card-info" width="35" height="35" />
                Driver Information
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {driverInfoItems}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vehicle-info" className="border-none">
              <AccordionTrigger className="text-lg font-semibold">
                <img src="/assets/public/car-info.png" alt="car-info" width="35" height="35" />
                Vehicle Information
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {vehicleInfoItems}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </CardContent>

      {/* <Separator className="my-4 sm:my-6" /> */}

      {/* <div>
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">
            Performance Metrics
          </h3>
          <div className="flex justify-around">
            <PerformanceMetric
              icon={<Award className="w-5 h-5 sm:w-6 sm:h-6" />}
              value={100} // Placeholder value
              label="Completion"
            />
            <PerformanceMetric
              icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
              value={98} // Placeholder value
              label="On-Time"
            />
            <PerformanceMetric
              icon={<Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
              value={100} // Placeholder value
              label="Safety Score"
            />
          </div>
        </div> */}
    </Card>
  );
};
export default Profile;
