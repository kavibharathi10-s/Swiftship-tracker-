"use client";
import React, { useEffect, useState } from "react";
import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { Loader, Loader2 } from "lucide-react";

type Props = React.PropsWithChildren<{}>;

const SideBarWrapper = ({ children }: Props) => {
  const [isClient, setIsClient] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRoleById();
      setIsClient(role.data?.client ?? false); // Set the client role or default to false
    };
    fetchUserRole();
  }, []);

  if (isClient === null) {
    // Optionally, you can show a loading state until the role is fetched
    return (
      <div className="w-full flex h-screen justify-center items-center">
        {" "}
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full p-4 flex flex-col md:flex-row gap-4">
      <MobileNav role={isClient} />
      <DesktopNav role={isClient} />
      <main className="h-[calc(100%-80px)] md:h-full w-full flex gap-4">
        {children}
      </main>
    </div>
  );
};

export default SideBarWrapper;
