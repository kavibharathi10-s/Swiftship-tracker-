"use client";

import { createFCMToken } from "@/actions/FCMTokenActions";
import { saveDeviceToken } from "@/lib/knock";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { messaging } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { getToken } from "firebase/messaging";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationButton() {
  const { user } = useUser();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [showNotificationButton, setShowNotificationButton] = useState(false);

  useEffect(() => {
    const checkTokenStatus = async () => {
      if (!user) return;

      try {
        // Check if notification permission is already granted
        const permission = Notification.permission;

        // Check if we have a valid token in Firebase
        const currentToken = await getToken(messaging, {
          vapidKey: String(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY),
        });
        await getRegistrationToken();
        // Show button if:
        // 1. Permission not granted OR
        // 2. No current token exists
        setShowNotificationButton(!currentToken || permission !== "granted");
      } catch (error) {
        console.error("Error checking token status:", error);
        setShowNotificationButton(true);
      }
    };

    checkTokenStatus();
  }, [user]);

  function requestPermission() {
    setIsRequestingPermission(true);
    console.log("Requesting notification permission...");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        toast({
          title: "Notification permission granted",
          description: "You will now receive notifications.",
        });
        getRegistrationToken();
      } else {
        toast({
          title: "Notification permission denied",
          description: "You will not receive notifications.",
          variant: "destructive",
        });
      }
      setIsRequestingPermission(false);
    });
  }

  async function getRegistrationToken() {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!vapidKey) {
      console.error("VAPID key is missing");
      return;
    }

    if (!user) return;

    try {
      const currentToken = await getToken(messaging, {
        vapidKey: vapidKey,
      });

      if (currentToken) {
        const response = await createFCMToken({
          userId: user.id,
          token: currentToken,
        });

        await saveDeviceToken(user.id, currentToken);

        if (!response.success) {
          toast({
            title: "Error",
            description: "Error creating FCMToken",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  }

  return showNotificationButton ? (
    <>
      {isRequestingPermission ? (
        <Button onClick={requestPermission}>
          <>Enable Notifications</>
        </Button>
      ) : null}
    </>
  ) : null;
}
