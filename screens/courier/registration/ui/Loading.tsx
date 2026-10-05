"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonInput: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-10 w-full" />
  </div> 
);

const SkeletonImage: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-40 w-full" />
  </div>
);

const Loading: React.FC = () => {
  return (
    <Card className="w-[80%] max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonInput />
            <SkeletonInput />
          </div>
        ))}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonImage />
            <SkeletonImage />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 border-t p-6">
        <Skeleton className="h-10 w-full md:w-1/2 mr-2" />
        <Skeleton className="h-10 w-full md:w-1/2 ml-2" />
      </CardFooter>
    </Card>
  );
};

export default Loading;
