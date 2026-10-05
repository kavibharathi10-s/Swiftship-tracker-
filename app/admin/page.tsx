"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Truck, X } from "lucide-react";
import { getUnverifiedClients, verifyClient } from "@/actions/clientActions";
import { getUnverifiedDrivers, VerifyDriver } from "@/actions/driverActions";
import { toast } from "@/hooks/use-toast";
import GetDriverInfoForm from "@/screens/admin/SubmitDriverInfoForm";
import Image from "next/image";

type User = {
  id: string;
  name: string;
  email: string;
  type: "client" | "courier";
  status: "pending" | "verified" | "rejected";
  idImage: string;
  idPhotoUrl?: string;
  selfieImage: string;
  driverLicenseImage?: string;
  discImage?: string;
  vehicleImagesUrl?: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitInfo, setSubmitInfo] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const [clients, drivers] = await Promise.all([
        getUnverifiedClients(),
        getUnverifiedDrivers(),
      ]);

      const users: User[] = [
        ...(clients.data?.map((client) => ({
          id: client.Id,
          name: `${client.firstName} ${client.lastName}`,
          email: client.email,
          type: "client" as const,
          status: "pending" as const,
          idImage: client.idPhotoUrl,
          selfieImage: client.selfieImage || "",
        })) || []),
        ...(drivers.map((driver) => ({
          id: driver.Id,
          name: `${driver.firstName} ${driver.lastName}`,
          email: driver.email,
          type: "courier" as const,
          status: "pending" as const,
          idImage: driver.idPhotoUrl,
          selfieImage: driver.photoUrl,
          driverLicenseImage: driver.licensePhotoUrl || undefined,
          discImage: driver.discPhotoUrl || undefined,
          role: "driver",
        })) || []),
      ];
      setUsers(users);
      setLoading(false);
    };

    fetchUsers();
  }, []);
  


  const handleVerify = async (userId: string, user: any) => {
    if (user.type === "client") {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "verified" } : user
        )
      );
      // verify client
      const response = await verifyClient(userId);

      if (response.success) {
        toast({
          description: "Client verified successfully",
        });
      } else {
        toast({
          description: "Error verifying client",
          variant: "destructive",
        });
      }
    } else {
      // enter required info
      setSubmitInfo(true);
      // verify driver
    }
  };

  const handleSubmitDriver = async (userId: string, user: any, data: any) => {
    const response = await VerifyDriver(userId, data);

    if (response.Id) {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "verified" } : user
        )
      );
      toast({
        description: "Driver verified successfully",
      });
      setSubmitInfo(false);
    } else {
      toast({
        description: "Error verifying driver",
        variant: "destructive",
      });
    }
  };

  const handleReject = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "rejected" } : user
      )
    );
  };

  const pendingClients = users.filter(
    (user) => user.type === "client" && user.status === "pending"
  );
  const pendingCouriers = users.filter(
    (user) => user.type === "courier" && user.status === "pending"
  );

  const UserCard = ({ user }: { user: User }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{user.name}</span>
          <Badge variant={user.type === "client" ? "default" : "secondary"}>
            {user.type}
          </Badge>
        </CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 ">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium mb-2">ID Document</p>
            <Image
              src={user.idImage || ""}
              alt="ID Document"
              className="w-full md:w-[50%] h-[250px] object-cover rounded-md"
              width={300}
              height={300}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium mb-2">Selfie</p>
            <Image
              src={user.selfieImage || ""}
              alt="Selfie"
              className="w-full md:w-[50%] h-[300px] object-cover rounded-md"
              width={300}
              height={300}
            />
          </div>
          {user.type === "courier" && (
            <div className="grid grid-cols-2 gap-4 ">
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-medium mb-2">Driver's License</p>
                <Image
                  src={user.driverLicenseImage || ""}
                  alt="Driver's License"
                  className="w-full md:w-[50%] h-[300px] object-cover rounded-md"
                  width={300}
                  height={300}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-medium mb-2">Vehicle Disc</p>
                <Image
                  src={user.discImage || ""}
                  alt="Vehicle Disc"
                  className="w-full md:w-[50%] h-[300px] object-cover rounded-md"
                  width={300}
                  height={300}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {submitInfo ? (
          <div className="w-full flex justify-center">
            <GetDriverInfoForm user={user} Submit={handleSubmitDriver} />
          </div>
        ) : (
          <>
            <Button variant="destructive" onClick={() => handleReject(user.id)}>
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerify(user.id, user)}
            >
              <Check className="mr-2 h-4 w-4" /> Verify
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          {/* Animated Delivery Truck */}
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      )}
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="clients">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="couriers">Couriers</TabsTrigger>
          </TabsList>
          <TabsContent value="clients">
            <h2 className="text-2xl font-semibold mb-4">Pending Clients</h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid gap-6">
                {pendingClients.map((client) => (
                  <UserCard key={client.id} user={client} />
                ))}
                {pendingClients.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No pending clients to verify.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="couriers">
            <h2 className="text-2xl font-semibold mb-4">Pending Couriers</h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid gap-6">
                {pendingCouriers.map((courier) => (
                  <UserCard key={courier.id} user={courier} />
                ))}
                {pendingCouriers.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No pending couriers to verify.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
