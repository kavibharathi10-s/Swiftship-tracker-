import { HouseIcon, MessageCircle, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = (userRole: boolean) => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Dashboard",
        href: userRole ? "/client" : "/driver/dashboard/find-jobs",
        icon: <HouseIcon />,
      },
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageCircle />,
        active: pathname.startsWith("/conversations"),
      },
      {
        name: "Contacts",
        href: "/contacts",
        icon: <UsersIcon />,
        active: pathname == "/contacts",
      },
    ],
    [pathname]
  );

  return paths;
};
