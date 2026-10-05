"use client";
import useUser from "@/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuid } from "uuid";
import React from "react";

const Page = ({ params }: { params: { roomId: string } }) => {
  const { fullName } = useUser();
  const roomId = params.roomId;
  const myCall: any = async (element: any) => {
    // generate Kit Token
    const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRECT!;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      uuid(),
      fullName || "user" + Date.now(),
      720
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomId=" +
            roomId,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };
  return <div ref={myCall} className="h-screen w-full"></div>;
};

export default Page;
