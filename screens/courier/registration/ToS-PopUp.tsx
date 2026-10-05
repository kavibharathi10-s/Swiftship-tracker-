import React, { useState } from "react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { createUserRole } from "@/actions/roleAction";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assuming shadcn button component
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
interface ToSProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  role: string;
}

const ToS: React.FC<ToSProps> = ({ show, setShow, role }) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (userId) {
      setIsProcessing(true);
      if (role === "driver") {
        try {
          const createRole = await createUserRole({ userId, driver: true });
          if (createRole.driver) {
            alert("Registration successful!, you will be verified soon");
            router.push("/driver/dashboard/find-jobs");
          }
        } catch (error) {
          console.error("Error creating/updating user role:", error);
        }
      }
      if (role === "client") {
        try {
          const createRole = await createUserRole({
            userId,
            driver: false,
            client: true,
          });
          if (createRole.client) {
            router.push("/client");
          }
        } catch (error) {
          console.error("Error creating/updating user role:", error);
        }
      }
    }
  };

  return (
    <div>
      {show && (
        <Dialog open={show} onOpenChange={setShow}>
          <DialogContent className="h-96">
            <DialogHeader>
              <DialogTitle>Ship Swift Terms of Service</DialogTitle>
              <DialogDescription className="h-60 overflow-auto">
                Effective Date: November 27, 2024
                <br />
                <br />
                Welcome to Ship Swift, a platform that connects individuals
                needing parcels delivered with drivers available to complete the
                delivery. By using the Ship Swift platform ("Service"), you
                agree to comply with and be bound by these Terms of Service and
                our Privacy Policy. If you do not agree with any part of these
                terms, you may not use our Service.
                <br />
                <br />
                <strong>1. Acceptance of Terms</strong>
                <br />
                By registering for or using the Ship Swift platform, you agree
                to these Terms of Service, our Privacy Policy, and any other
                applicable policies or guidelines. These terms may be updated
                from time to time, and we will notify you of any significant
                changes.
                <br />
                <br />
                <strong>2. Account Registration</strong>
                <br />
                To use Ship Swift, both clients and drivers must create an
                account. By creating an account, you agree to provide accurate,
                current, and complete information and maintain the accuracy of
                your account information. You are solely responsible...
                <Link
                  href={`/terms-of-service?role=${role}`}
                  className="text-blue-500"
                >
                  See more
                </Link>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setShow(false)}>
                Close
              </Button>
              {isProcessing ? (
                <div className="w-20 h-10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : (
                <Button onClick={handleAccept} className="w-20 h-10">
                  Accept
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ToS;
