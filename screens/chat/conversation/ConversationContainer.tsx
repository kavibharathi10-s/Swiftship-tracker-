import { Card } from "@/components/ui/card";
import React from "react";

type props = React.PropsWithChildren<{}>;

const ConversationContainer = ({ children }: props) => {
  return (
    <Card className=" w-full h-[calc(100svh-20px)] lg:h-full p-2 flex flex-col gap-2">
      {children}
    </Card>
  );
};

export default ConversationContainer;
