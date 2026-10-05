"use client";
import { useEffect, useState } from "react";
import { getAllDeliveries } from "@/actions/deliveredJobsActions";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  FileCheck,
  Info,
  Mail,
  MapPin,
  MapPinOff,
  Navigation,
  Package,
  Phone,
} from "lucide-react";

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveredJobs, setDeliveredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveredJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllDeliveries();
        setDeliveredJobs(data);
      } catch (error) {
        console.error("Error fetching delivered jobs:", error);
        toast({ description: "Failed to fetch delivered jobs" });
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredJobs();
  }, []);

  const filteredJobs = deliveredJobs.filter((job) => {
    const clientFirstName =
      job?.ActiveJob?.Client?.firstName?.toLowerCase() || "";
    const clientLastName =
      job?.ActiveJob?.Client?.lastName?.toLowerCase() || "";
    const driverFirstName =
      job?.ActiveJob?.Driver?.firstName?.toLowerCase() || "";
    const driverLastName =
      job?.ActiveJob?.Driver?.lastName?.toLowerCase() || "";

    const clientFullName = `${clientFirstName} ${clientLastName}`.trim();
    const driverFullName = `${driverFirstName} ${driverLastName}`.trim();

    return (
      clientFullName.includes(searchTerm.toLowerCase()) ||
      driverFullName.includes(searchTerm.toLowerCase())
    );
  });

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Deliveries</h1>
        <Input
          placeholder="Search deliveries by client name or driver name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card className="mt-4 bg-gray-100">
        <CardHeader>
          <CardTitle>Delivered Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Driver Confirmed</TableHead>
                  <TableHead>Client Confirmed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <>
                    <TableRow
                      key={job.Id}
                      onClick={() => toggleExpand(job.Id)}
                      className="cursor-pointer hover:bg-gray-200"
                    >
                      <TableCell>{job?.ActiveJob?.CourierJob?.Title}</TableCell>
                      <TableCell>
                        {job?.ActiveJob?.Driver?.firstName}{" "}
                        {job?.ActiveJob?.Driver?.lastName}
                      </TableCell>
                      <TableCell>
                        {job?.ActiveJob?.Client?.firstName}{" "}
                        {job?.ActiveJob?.Client?.lastName}
                      </TableCell>
                      <TableCell>{job?.ActiveJob?.startDate}</TableCell>
                      <TableCell>{job?.ActiveJob?.endDate || "N/A"}</TableCell>
                      <TableCell>
                        {job.isDriverConfirmed ? (
                          <Badge variant="outline">Confirmed</Badge>
                        ) : (
                          <Badge variant="destructive">Not Confirmed</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {job.isClientConfirmed ? (
                          <Badge variant="outline">Confirmed</Badge>
                        ) : (
                          <Badge variant="destructive">Not Confirmed</Badge>
                        )}
                      </TableCell>
                    </TableRow>

                    {expandedJobId === job.Id && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          <Card className="m-2 bg-gray-50">
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                              {/* Left Column */}
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Job Details
                                  </h3>
                                  <p className="text-gray-600">
                                    {job?.ActiveJob?.CourierJob?.Description}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Parcel Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white p-3 rounded-lg">
                                      <p className="text-sm text-gray-500">
                                        Size
                                      </p>
                                      <p className="font-medium">
                                        {job?.ActiveJob?.CourierJob
                                          ?.parcelSize || "N/A"}
                                      </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                      <p className="text-sm text-gray-500">
                                        Weight
                                      </p>
                                      <p className="font-medium">
                                        {job?.ActiveJob?.CourierJob?.weight ||
                                          "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <p className="font-medium">
                                      M {job?.ActiveJob?.CourierJob?.Budget}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <p>
                                      {new Date(
                                        job?.deliveryDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FileCheck className="w-5 h-5 text-purple-600" />
                                    <a
                                      href={job.proofOfDeliveryUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      View Proof of Delivery
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Navigation className="w-5 h-5 text-orange-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Coordinates
                                      </p>
                                      <p>
                                        Lat: {job?.Location?.latitude}, Long:{" "}
                                        {job?.Location?.longitude}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Pickup Location
                                  </h3>
                                  <div className="bg-white p-4 rounded-lg">
                                    <p className="font-medium">
                                      {job?.ActiveJob?.CourierJob?.PickUp ||
                                        "N/A"}
                                    </p>
                                    <p className="text-gray-500">
                                      {job?.ActiveJob?.CourierJob
                                        ?.districtPickUp || "N/A"}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <MapPinOff className="w-5 h-5" />
                                    Dropoff Location
                                  </h3>
                                  <div className="bg-white p-4 rounded-lg">
                                    <p className="font-medium">
                                      {job?.ActiveJob?.CourierJob?.DropOff ||
                                        "N/A"}
                                    </p>
                                    <p className="text-gray-500">
                                      {job?.ActiveJob?.CourierJob
                                        ?.districtDropOff || "N/A"}
                                    </p>
                                  </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                    <p>
                                      {job?.ActiveJob?.CourierJob
                                        ?.dropoffPhoneNumber || "N/A"}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-gray-600" />
                                    <p>
                                      {job?.ActiveJob?.CourierJob
                                        ?.dropOffEmail || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
