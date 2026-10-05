"use client";
import React from "react";
import DriverDetailsForm from "@/screens/courier/registration/components/DriverDetailsForm";

const Page: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-24">
      <DriverDetailsForm />
    </div>
  );
};

export default Page;
