import { getClientById } from "@/actions/clientActions";
import { getcontactById } from "@/actions/contactsActions";
import { getDriverByID } from "@/actions/driverActions";
import { getMessages } from "@/actions/messagesActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import ChatWrapper from "@/screens/chat/conversation/ChatWrapper";
import Conversation from "@/screens/chat/conversation/Conversation";
import ConversationContainer from "@/screens/chat/conversation/ConversationContainer";
import { Loader2 } from "lucide-react";
import React from "react";

const ConversationsPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const [contact, userRole] = await Promise.all([
    getcontactById(params.conversationId),
    getUserRoleById(),
  ]);

  const driver = await getDriverByID(contact.data?.driverId || "");
  const client = await getClientById(contact.data?.clientId || "");

  const driverDetails = {
    ...driver,
  };
  const clientDetails = {
    ...client?.data,
  };

  const contactDetails = {
    ...contact.data,
  };
  const messages = await getMessages(
    clientDetails.Id || "",
    driverDetails.data?.Id || ""
  );
  const Messages = messages?.data;
  return (
    <>
      {contact === null || userRole === null || messages === null ? (
        <div className="w-full flex h-screen justify-center items-center">
          {" "}
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ConversationContainer>
          <ChatWrapper conversationId={params.conversationId}>
            <Conversation
              clientDetails={clientDetails}
              driverDetails={driverDetails}
              contactDetails={contactDetails}
              role={userRole.data?.client}
              Messages={Messages}
            />
          </ChatWrapper>
        </ConversationContainer>
      )}
    </>
  );
};

export default ConversationsPage;
