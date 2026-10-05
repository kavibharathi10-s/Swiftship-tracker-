"use client";
import supabase from "@/app/utils/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getDriverByID } from "@/actions/driverActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  deleteDriverRequest,
  updateDriverRequest,
} from "@/actions/driverRequest";
import {
  deleteClientRequest,
  updateClientRequest,
} from "@/actions/clientRequest";
import { createcontact, getcontact } from "@/actions/contactsActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { useRouter } from "next/navigation";
import { getClientById } from "@/actions/clientActions";

type Props = {
  incomingRequestsWithNames: any;
  outgoingRequestsWithNames: any;
  role: boolean;
};

const ListContacts = ({
  incomingRequestsWithNames,
  outgoingRequestsWithNames,
  role,
}: Props) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState(
    Array.isArray(incomingRequestsWithNames) ? incomingRequestsWithNames : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [IsDeleting, setIsDeleting] = useState(false);
  const [isAllIncomingRequestsContacts, setIsAllIncomingRequestsContacts] =
    useState(false);
  const [isAllOutgoingRequestsContacts, setIsAllOutgoingRequestsContacts] =
    useState(false);

  // Handler functions moved outside of useEffect
  const handleAccept = async (requestId: string, requestData: any) => {
    setIsSubmitting(true);
    try {
      if (role) {
        await updateDriverRequest(requestId, {
          senderId: requestData.senderId,
          receiverId: requestData.receiverId,
          isAccepted: true,
          isPending: false,
        });
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: true, isPending: false }
              : request
          )
        );
      } else {
        await updateClientRequest(requestId, {
          senderId: requestData.senderId,
          receiverId: requestData.receiverId,
          isAccepted: true,
          isPending: false,
        });
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: true, isPending: false }
              : request
          )
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
    setIsSubmitting(false);
  };

  const handleReject = async (requestId: string) => {
    setIsSubmitting(true);
    try {
      if (role) {
        await supabase
          .from("DriverRequests")
          .update({ isAccepted: false, isPending: false })
          .eq("Id", requestId);
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: false, isPending: false }
              : request
          )
        );
      } else {
        await supabase
          .from("clientRequests")
          .update({ isAccepted: false, isPending: false })
          .eq("Id", requestId);
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: false, isPending: false }
              : request
          )
        );
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to accept request");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (requestId: string) => {
    setIsDeleting(true);
    if (role) {
      const response = await deleteClientRequest(requestId);

      if (response.success) {
        toast.success("Request deleted successfully");
      } else {
        toast.error(response.error);
      }
    } else {
      const response = await deleteDriverRequest(requestId);

      if (response.success) {
        toast.success("Request deleted successfully");
      } else {
        toast.error(response.error);
      }
    }
    setIsDeleting(false);
  };

  const createConversation = async (clientId: string, driverId: string) => {
    const getConversationsResponse = await getcontact(clientId, driverId);

    if (
      getConversationsResponse.success &&
      getConversationsResponse.data &&
      getConversationsResponse.data.length > 0
    ) {
      // Ensure data is defined and non-empty before accessing it
      router.push(`/conversations/${getConversationsResponse.data[0].Id}`);
    } else if (getConversationsResponse.error === "contact not found") {
      console.log("creating contact");
      const createContactResponse = await createcontact({
        clientId,
        driverId,
      });
      if (
        !createContactResponse.success &&
        createContactResponse.error !== "contact already exists"
      ) {
        toast.error("An unexpected error occurred");
        return;
      } else {
        router.push(`/conversations/${createContactResponse.data?.Id}`);
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    let numberOfContactsThoughtAsIncoming: number = 0;
    let numberOfContactsThoughtAsOutgoing: number = 0;
    const handleNewRequest = async (payload: any) => {
      const newRequest = payload.new;
      if (newRequest.receiverId === userId) {
        let fullName: string;
        if (role) {
          const driverData = await getDriverByID(newRequest.senderId); // Fetch driver by senderId
          fullName = driverData.data?.Id
            ? `${driverData.data?.firstName} ${driverData.data?.lastName}`
            : "Unknown Driver";
        } else {
          const clientData = await getClientById(newRequest.senderId); // Fetch client by senderId
          fullName = clientData.success
            ? `${clientData.data?.firstName} ${clientData.data?.lastName}`
            : "Unknown Client";
        }

        setIncomingRequests((prevRequests) => [
          ...prevRequests,
          { ...newRequest, fullName },
        ]);
      }
    };

    incomingRequests.map((request: any) => {
      if (request.isAccepted) numberOfContactsThoughtAsIncoming++;
    });
    // if (outgoingRequestsWithNames.length > 0) {
    outgoingRequestsWithNames?.map((request: any) => {
      if (request.isAccepted) numberOfContactsThoughtAsOutgoing++;
    });
    // }

    if (numberOfContactsThoughtAsIncoming === incomingRequests.length)
      setIsAllIncomingRequestsContacts(true);
    if (numberOfContactsThoughtAsOutgoing === outgoingRequestsWithNames?.length)
      setIsAllOutgoingRequestsContacts(true);

    const channelName = role ? "Driver requests - insert" : "driver requests";
    const tableName = role ? "DriverRequests" : "clientRequests";

    const insertChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
        },
        handleNewRequest
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertChannel);
    };
  }, [supabase, userId, role]);

  const contacts: any = [];

  incomingRequests.map((request) => {
    request.isAccepted && contacts.push(request);
  });
  outgoingRequestsWithNames?.map((request: any) => {
    request.isAccepted && contacts.push(request);
  });

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto w-full no-scrollbar">
      <div>
        <p className="text-base font-semibold text-underline">Contacts</p>
        {contacts.length > 0 ? (
          <div>
            {Array.isArray(contacts) &&
              contacts.map((request: any) => (
                <div
                  key={request.Id}
                  className="border-b py-2  w-full cursor-pointer"
                  onClick={async () => {
                    const user = await getUserRoleById();
                    if (user.success) {
                      if (user.data?.client) {
                        if (user.data?.userId === request.senderId) {
                          createConversation(
                            user.data?.userId,
                            request.receiverId
                          );
                        } else {
                          createConversation(
                            user.data?.userId,
                            request.senderId
                          );
                        }
                      } else {
                        if (user.data?.userId === request.senderId) {
                          createConversation(
                            request.receiverId,
                            user.data?.userId || ""
                          );
                        } else {
                          createConversation(
                            request.senderId,
                            user.data?.userId || ""
                          );
                        }
                      }
                    }
                  }}
                >
                  <div className="flex gap-2">
                    <div>
                      <Avatar>
                        <AvatarImage src={request.photoUrl} alt="user photo" />
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold">{`${request.fullName}`}</p>
                      <p className="text-foreground-muted">
                        Click to start a conversation
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="h-full w-full flex items-center">No contacts</p>
        )}
      </div>
      <div>
        <p className="text-base font-semibold">Incoming requests</p>
        {incomingRequests.length > 0 || !isAllIncomingRequestsContacts ? (
          <div>
            {Array.isArray(incomingRequests) &&
              incomingRequests.map((request: any) =>
                request.isAccepted ? null : (
                  <div key={request.Id} className="border-b py-2">
                    <div className="flex gap-2">
                      <div>
                        <Avatar>
                          <AvatarImage
                            src={request.photoUrl}
                            alt="user photo"
                          />
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {`Request from: ${request.fullName}`}
                        </p>
                      </div>
                      <p>{request.message}</p>
                      <div>
                        Status:{" "}
                        {request.isPending ? (
                          "Pending"
                        ) : (
                          <div className="flex gap-2">
                            <p>Rejected</p>
                            <Button size="sm">Delete</Button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {isSubmitting ? (
                          <Button>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            please wait
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAccept(request.Id, request)}
                          >
                            Accept
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleReject(request.Id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <p className="h-full w-full flex items-center justify-center">
            No incoming requests
          </p>
        )}
      </div>
      <div>
        <p className="text-base font-semibold">Outgoing requests</p>
        {outgoingRequestsWithNames?.length > 0 ||
        !isAllOutgoingRequestsContacts ? (
          <div>
            {Array.isArray(outgoingRequestsWithNames) &&
              outgoingRequestsWithNames.map((request: any) =>
                request.isAccepted ? null : (
                  <div key={request.Id} className="border-b py-2">
                    <div className="flex gap-2">
                      <div>
                        <Avatar>
                          <AvatarImage
                            src={request.photoUrl}
                            alt="user photo"
                          />
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {`Request to: ${request.fullName}`}
                        </p>
                        <p>{request.message}</p>
                        Status:{request.isPending ? " Pending" : ""}
                        <div>
                          {request.isPending ? (
                            <>
                              <div className="flex gap-2">
                                {IsDeleting ? (
                                  <Button>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Please wait
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      handleDelete(request.Id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-row gap-2">
                              <p>Rejected</p>
                              {IsDeleting ? (
                                <Button>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                  Please wait
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleDelete(request.Id);
                                  }}
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <p className="h-full w-full flex items-center justify-center">
            No outgoing requests
          </p>
        )}
      </div>
    </div>
  );
};

export default ListContacts;
{
  /* <Loader2 className="mr-2 h-8 w-8 animate-spin" /> */
}
