import { getAllClients, getClientById } from "@/actions/clientActions";
import { getAllDrivers, getDriverByID } from "@/actions/driverActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { ClientComboBox } from "@/screens/chat/contacts/clientComboBox";
import { DriverComboBox } from "@/screens/chat/contacts/driverComboBox";
import DriverAddClient from "@/screens/chat/contacts/DriverAddClientDialog";
import ListContacts from "@/screens/chat/contacts/ListContacts";
import ListOfContacts from "@/screens/chat/contacts/ListOfContacts";
import ConversationFallback from "@/screens/chat/conversation/ConversationFallback";
import ItemList from "@/screens/chat/item-list/ItemList";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const Page = async (props: Props) => {
  const [userRole, listOfContacts, drivers, clients] = await Promise.all([
    getUserRoleById(),
    ListOfContacts(),
    getAllDrivers(),
    getAllClients(),
  ]);
  const incomingRequests = listOfContacts.incomingRequests;
  const outgoingRequests = listOfContacts.outgoingRequests;
  let incomingRequestsWithNames;
  let outgoingRequestsWithNames;

  // Fetch the driver's full name for each incoming request
  if (userRole.data?.client) {
    if (Array.isArray(incomingRequests) && incomingRequests.length > 0) {
      incomingRequestsWithNames = await Promise.all(
        incomingRequests.map(async (request: any) => {
          const driverData = await getDriverByID(request.senderId); // Fetch driver by senderId
          const fullName = driverData.data?.Id
            ? `${driverData.data?.firstName} ${driverData.data?.lastName}`
            : "Unknown Driver";
          const photoUrl = driverData.data?.photoUrl;
          return {
            ...request,
            fullName, // Add fullName to the request
            photoUrl,
          };
        })
      );
    }
    if (Array.isArray(outgoingRequests) && outgoingRequests.length > 0) {
      outgoingRequestsWithNames = await Promise.all(
        outgoingRequests.map(async (request: any) => {
          const driverData = await getDriverByID(request.receiverId); // Fetch driver by receiverId
          const fullName = driverData.data?.Id
            ? `${driverData.data?.firstName} ${driverData.data?.lastName}`
            : "Unknown Driver";
          const photoUrl = driverData.data?.photoUrl;
          return {
            ...request,
            fullName, // Add fullName to the request
            photoUrl,
          };
        })
      );
    }
  } else {
    if (Array.isArray(incomingRequests) && incomingRequests.length > 0) {
      incomingRequestsWithNames = await Promise.all(
        incomingRequests.map(async (request: any) => {
          const clientData = await getClientById(request.senderId); // Fetch client by senderId
          const fullName = clientData.success
            ? `${clientData.data?.firstName} ${clientData.data?.lastName}`
            : "Unknown Client";
          const photoUrl = clientData.data?.photoUrl;
          return {
            ...request,
            fullName, // Add fullName to the request
            photoUrl,
          };
        })
      );
    }
    if (Array.isArray(outgoingRequests) && outgoingRequests.length > 0) {
      outgoingRequestsWithNames = await Promise.all(
        outgoingRequests.map(async (request: any) => {
          const clientData = await getClientById(request.receiverId); // Fetch client by receiverId
          const fullName = clientData.success
            ? `${clientData.data?.firstName} ${clientData.data?.lastName}`
            : "Unknown Client";
          const photoUrl = clientData.data?.photoUrl;
          return {
            ...request,
            fullName, // Add fullName to the request
            photoUrl,
          };
        })
      );
    }
  }

  return (
    <>
      <ItemList
        title="Contacts"
        action={
          userRole.data?.client ? (
            <ClientComboBox drivers={drivers.data} />
          ) : (
            <DriverComboBox clients={clients.data} />
          )
        }
      >
        <div className="h-full w-full">
          {listOfContacts !== null ? (
            <ListContacts
              incomingRequestsWithNames={incomingRequestsWithNames}
              outgoingRequestsWithNames={outgoingRequestsWithNames}
              role={userRole.data?.client ?? false}
            />
          ) : (
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          )}
        </div>
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default Page;
