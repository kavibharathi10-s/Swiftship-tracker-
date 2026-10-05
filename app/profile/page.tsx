import { UserProfile } from "@clerk/nextjs";
import React from "react";
const Page = () => {
    return (
      <div className="flex items-center justify-center py-4">
      <UserProfile routing="hash"  />
      </div>
    );
  };
  
  export default Page;