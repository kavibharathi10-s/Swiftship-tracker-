import "@/app/globals.css";
import ClientNavBar from "./client/components/ClientNavBar";
// import { useEffect, useState } from "react";
// import { Truck } from "lucide-react";
import { getUserRoleById } from "../utils/getUserRole";
import NotificationButton from "@/screens/notifications/PushNotifications/NotificationButton";
import { redirect } from "next/navigation";
import SiteFooter from "@/screens/global/Site-Footer";

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRoleById();
  if (!userRole.data?.client) {
    redirect("/driver/dashboard/find-jobs");
  }
  return (
    <div>
      <>
        <ClientNavBar />
        {children}
        {/* <div className="fixed bottom-4 right-4">
          <NotificationButton />
        </div> */}
        <SiteFooter />
      </>
    </div>
  );
}
