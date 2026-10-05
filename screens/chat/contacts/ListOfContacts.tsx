import { getClientRequests } from "@/actions/clientRequest";
import { getDriverRequests } from "@/actions/driverRequest";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { currentUser } from "@clerk/nextjs/server";

const ListOfContacts = async () => {
  const userRole = await getUserRoleById();
  const user = await currentUser();

  let incomingRequests;
  let outgoingRequests;
  let requests;

  if (userRole.data?.client) {
    // console.log("client")
    const [driverRequests, clientRequests] = await Promise.all([
      getDriverRequests("", user?.id),
      getClientRequests(user?.id, ""),
    ]);
    incomingRequests = driverRequests?.data;
    outgoingRequests = clientRequests?.data;
  } else {
    // console.log("not client")
    const [driverRequests, clientRequests] = await Promise.all([
      getDriverRequests(user?.id, ""),
      getClientRequests("", user?.id),
    ]);
    outgoingRequests = driverRequests?.data;
    incomingRequests = clientRequests?.data;
  }

  return {
    incomingRequests: incomingRequests || "",
    outgoingRequests: outgoingRequests || "",
  };
};

export default ListOfContacts;
