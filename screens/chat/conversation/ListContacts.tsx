"use client";
import { getClientById } from "@/actions/clientActions";
import { getDriverByID } from "@/actions/driverActions";
import supabase from "@/app/utils/supabase";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  Contacts: any;
  role: boolean;
};

const ListContacts = ({ role, Contacts }: Props) => {
  const [contacts, setNewContact] = useState(
    Array.isArray(Contacts) ? Contacts : []
  );
  const user = useAuth();
  const userId = user.userId;

  useEffect(() => {
    const handleNewContact = async (payload: any) => {
      const newContact = payload.new;
      if (newContact.receiverId === userId) {
        let fullName: string;
        if (role) {
          const driverData = await getDriverByID(newContact.driverId); // Fetch driver by driverId
          fullName = driverData.data?.Id
            ? `${driverData.data?.firstName} ${driverData.data?.lastName}`
            : "Unknown Driver";
        } else {
          const clientData = await getClientById(newContact.clientId); // Fetch client by clientId
          fullName = clientData.success
            ? `${clientData.data?.firstName} ${clientData.data?.lastName}`
            : "Unknown Client";
        }

        setNewContact((prevcontacts) => [
          ...prevcontacts,
          { ...newContact, fullName },
        ]);
      }
    };

    const insertContactChannel = supabase
      .channel("on Insert Contact")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Contacts",
        },
        handleNewContact
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertContactChannel);
    };
  }, [supabase, userId, role]);
  return (
    <div className="w-full">
      <p className="text-base font-semibold text-underline">Contacts</p>
      {contacts.length > 0 ? (
        <div>
          {Array.isArray(contacts) &&
            contacts.map((contact: any) => (
              <Link
                key={contact.Id}
                className="w-full cursor-pointer"
                href={`/conversations/${contact.Id}`}
                prefetch={true}
              >
                <div className="border-b  py-2 flex gap-2">
                  <div>
                    <Avatar>
                      <AvatarImage src={contact.photoUrl} alt="user photo" />
                    </Avatar>
                  </div>
                  {/* <div className="flex flex-col"> */}
                  <p className="font-semibold">{`${contact.fullName}`}</p>
                  {/* <p className="text-foreground-muted">No new message</p>
                  </div> */}
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <p className="h-full w-full flex items-center">No contacts</p>
      )}
    </div>
  );
};

export default ListContacts;
