"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Loader2, Package, ShoppingBag, Truck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getDriverByID } from "@/actions/driverActions";
import { getClientById } from "@/actions/clientActions";
import { checkDriverRole } from "@/actions/protectActions";
import { getUserRoleById } from "../utils/getUserRole";

const Page = () => {
  const router = useRouter();
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"client" | "courier" | null>(
    null
  );

  const handleCreateAccount = () => {
    setIsRedirecting(true);
    if (selectedRole === "client") {
      router.push("/onboarding/client");
    } else if (selectedRole === "courier") {
      router.push("/onboarding/driver/registration");
    }
    // If no role is selected, we don't redirect
  };

  useEffect(() => {
    // router.push("/client/dashboard/deliver");
    const checkUser = async () => {
      // Guard clause to wait for user data
      const [
        userRole,
        // responseFromDriverTable, responseFromClientTable
      ] = await Promise.all([
        getUserRoleById(),
        // checkDriverRole(user.userId || ""),
        // getClientById(user.userId || ""),
      ]);
      if (userRole.success) {
        if (userRole.data?.client) {
          router.push("/client");
        } else if (userRole.data?.driver) {
          router.push("/driver/dashboard/find-jobs");
        }
      }

      // if (responseFromDriverTable && !responseFromClientTable.success) {
      //   router.push("/driver/dashboard/find-jobs");
      // } else if (responseFromClientTable.success && !responseFromDriverTable) {
      //   console.log(
      //     "Client is not a courier:  redirecting to client dashboard " +
      //       responseFromClientTable.data?.Id
      //   );
      //   router.push("/client");
      // }
      else {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [user, router]); // Add `user` to the dependency array

  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          {/* Animated Delivery Truck */}
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      ) : (
        <>
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="fixed top-6 left-6">
              <Link
                href="/"
                className="text-xl font-bold flex items-center gap-2"
              >
                <Truck className="w-6 h-6" />
                Ship Swift
              </Link>
            </div>

            <div className="max-w-2xl w-full space-y-8">
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                Join Ship Swift as a client or courier
              </h1>

              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className={`relative cursor-pointer transition-colors ${
                    selectedRole === "client"
                      ? "border-primary"
                      : "hover:border-primary"
                  }`}
                >
                  <CardContent className="p-6">
                    <input
                      type="radio"
                      name="role"
                      id="client"
                      className="peer absolute right-4 top-4"
                      checked={selectedRole === "client"}
                      onChange={() => setSelectedRole("client")}
                    />
                    <label
                      htmlFor="client"
                      className="block space-y-4 cursor-pointer"
                    >
                      <Package className="w-8 h-8" />
                      <h2 className="text-xl font-semibold">
                        I need something shipped
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Post jobs for item collection or delivery and get
                        connected with reliable couriers
                      </p>
                    </label>
                  </CardContent>
                </Card>

                <Card
                  className={`relative cursor-pointer transition-colors ${
                    selectedRole === "courier"
                      ? "border-primary"
                      : "hover:border-primary"
                  }`}
                >
                  <CardContent className="p-6">
                    <input
                      type="radio"
                      name="role"
                      id="courier"
                      className="peer absolute right-4 top-4"
                      checked={selectedRole === "courier"}
                      onChange={() => setSelectedRole("courier")}
                    />
                    <label
                      htmlFor="courier"
                      className="block space-y-4 cursor-pointer"
                    >
                      <Truck className="w-8 h-8" />
                      <h2 className="text-xl font-semibold">
                        I want to be a courier
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Find and complete shipping jobs in your area and earn
                        money as a delivery partner
                      </p>
                    </label>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="w-full max-w-sm"
                  onClick={handleCreateAccount}
                  disabled={!selectedRole}
                >
                  {isRedirecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
