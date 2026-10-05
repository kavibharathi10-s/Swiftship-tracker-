"use client";
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "@/components/ui/menubar";
import { getDriverByID } from "@/actions/driverActions";
import { getClientById } from "@/actions/clientActions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { updateUserRole, getUserRole } from "@/actions/roleAction";
import Loading from "@/app/loading";

const SwitchUser = () => {
  const [role, setRole] = useState<"driver" | "client" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      if (userId) {
        const userRole = await getUserRole(userId);

        if (userRole?.driver) {
          setRole("driver");
        } else if (userRole?.client) {
          setRole("client");
        } else {
          setRole(null);
        }
      }
    };

    checkRole();
  }, [userId]);

  const checkDriver = async () => {
    setIsLoading(true);
    if (userId) {
      try {
        const driverResponse = await getDriverByID(userId);

        if (driverResponse.success) {
          await updateUserRole({
            userId,
            driver: true,
            client: false,
          });
          router.push("/driver/dashboard/find-jobs");
        } else {
          router.push("/onboarding/driver/registration");
        }
      } catch (error) {
        console.error("Error during driver check/update:", error);
      }
    }
  };

  const checkClient = async () => {
    setIsLoading(true);
    if (userId) {
      try {
        const clientResponse = await getClientById(userId);

        if (clientResponse.success) {
          await updateUserRole({
            userId,
            driver: false,
            client: true,
          });

          router.push("/client");
        } else {
          router.push(`/onboarding/client`);
        }
      } catch (error) {
        console.error("Error during client check/update:", error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="w-full">Switch User</MenubarTrigger>
            <MenubarContent>
              {role === "client" ? (
                <MenubarItem onClick={checkDriver}>Driver</MenubarItem>
              ) : (
                <MenubarItem onClick={checkClient}>Client</MenubarItem>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </>
  );
};

export default SwitchUser;
