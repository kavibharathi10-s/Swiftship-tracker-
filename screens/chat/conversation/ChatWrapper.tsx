"use client";
import { getClientById } from "@/actions/clientActions";
import { getcontactById } from "@/actions/contactsActions";
import { getDriverByID } from "@/actions/driverActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import { Loader2, PhoneCall, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = React.PropsWithChildren<{
  conversationId: string;
}>;

const ChatWrapper = ({ children, conversationId }: Props) => {
  const { setFullName, setCallReceiverId } = useUser();
  const router = useRouter();

  // State to store contact, user role, driver, and client data
  const [contact, setContact] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Function to fetch the data asynchronously
    const fetchData = async () => {
      setIsLoading(true);
      const [contactResponse, userRoleResponse] = await Promise.all([
        getcontactById(conversationId),
        getUserRoleById(),
      ]);

      if (contactResponse.success) {
        setContact(contactResponse.data);
        setUserRole(userRoleResponse.data);

        if (userRoleResponse.data?.client) {
          const driverResponse = await getDriverByID(
            contactResponse.data?.driverId || ""
          );
          setDriver(driverResponse);
        } else {
          const clientResponse = await getClientById(
            contactResponse.data?.clientId || ""
          );
          setClient(clientResponse);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [conversationId]);

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col gap-4">
          <div className="w-full h-[8%] z-50">
            {userRole?.client ? (
              <div className="flex justify-center border-b h-full w-full items-center">
                <div className="w-[50%] flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src={driver.data?.photoUrl} alt="user photo" />
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-semibold">{`${driver.data?.firstName} ${driver.data?.lastName}`}</p>
                  </div>
                </div>
                <div className="w-[50%] flex justify-between items-center">
                  <div></div>
                  <div className="flex mr-5">
                    <PhoneCall
                      onClick={() => {
                        setFullName(
                          `${driver.data?.firstName} ${driver.data?.lastName}`
                        );
                        setCallReceiverId(driver.data?.Id);
                        window.open(`/room/${conversationId}`, "_blank");
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center border-b h-full w-full items-center z-50">
                <div className="w-[50%] flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={client?.data?.photoUrl}
                      alt="user photo"
                    />
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-semibold">{`${client?.data?.firstName} ${client?.data?.lastName}`}</p>
                  </div>
                </div>
                <div className="w-[50%] flex justify-between items-center">
                  <div></div>
                  <div className="flex mr-5">
                    <PhoneCall
                      onClick={() => {
                        setFullName(
                          `${client?.data?.firstName} ${client?.data?.lastName}`
                        );
                        setCallReceiverId(client?.Id);
                        window.open(`/room/${conversationId}`, "_blank");
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full h-[92%] overflow-y-auto no-scrollbar">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWrapper;
