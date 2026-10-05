"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientById, verifyClient } from "@/actions/clientActions";
import { Check, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Client = {
  Id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  dateCreated: string;
  dateUpdated: string;
  isVerified: boolean;
};

export default function ClientPage() {
  const { id } = useParams();
  const [client, setClient] = useState<Client>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getClient = async () => {
      const client = await getClientById(id as string);

      if (client.success && client.data) {
        setClient({
          ...client.data,
          dateCreated: client.data.dateCreated.toISOString(),
          dateUpdated: client.data.dateUpdated.toISOString()
        } as Client);
        setLoading(false);
      } else {
        console.log(client.error);
      }
    };
    getClient()
   });

const handleVerify = async (userId: string, user: any) => {
  // verify client
  if (client) {
    setClient({ ...client, isVerified: true } as Client)

    const response = await verifyClient(userId)

    if (response.success) {
      toast({
        description: 'Client verified successfully',
      })
    } else {
      toast({
        description: 'Error verifying client',
        variant: 'destructive',
      })
    }
  }
}

    const handleReject = async (userId: string, user: any) => {
      // reject client
      toast({
        description: 'not yet to be implemented',
      })
      }

  return (
    <>
    {
      loading &&  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
      {/* Animated Delivery Truck */}
      <Truck className="animate-truck" width="100" height="100" />
      <p className="text-lg text-gray-700">____________________</p>
    </div>
    }
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Client Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>
            {client?.firstName} {client?.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Email:</p>
              <p>{client?.email}</p>
            </div>
            <div>
              <p className="font-semibold">Phone:</p>
              <p>{client?.phoneNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Date Created:</p>
              <p>{client?.dateCreated}</p>
            </div>
            <div>
              <p className="font-semibold">Date Updated:</p>
              <p>{client?.dateUpdated}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={client?.photoUrl}
              alt="Profile Photo"
              className="w-full h-auto object-cover rounded-md"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ID Document</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={client?.idPhotoUrl}
              alt="ID Document"
              className="w-full h-auto object-cover rounded-md"
            />
          </CardContent>
        </Card>
      </div>
          {!client?.isVerified && (
          <div className="flex flex-col sm:flex-row justify-around gap-4">
            <Button variant="destructive" onClick={()=>{handleReject(client?.Id || "", client)}} className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button variant="default" onClick={()=>{handleVerify(client?.Id || "", client)}} className="w-full sm:w-auto">
              <Check className="mr-2 h-4 w-4" /> Verify
            </Button>
          </div>
        )}
    </div>
    </>
  );
}
