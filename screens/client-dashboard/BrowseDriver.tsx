import { Heart, Search, ThumbsUp, Zap } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserButton } from "@clerk/nextjs";

export default function BrowseDrivers() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input type="search" placeholder="Search drivers" className="pl-8" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select driver location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="los-angeles">Los Angeles</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                <div className="flex justify-start mb-4 sm:mb-0">
                  {/* <img
                    src="/api/placeholder/80/80"
                    alt="John D."
                    className="rounded-full w-20 h-20"
                  /> */}
                  <UserButton />
                </div>

                <div className="flex-grow space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-lg font-semibold">John D.</h3>
                    <Badge variant="secondary" className="w-fit">
                      Top Rated Plus
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Professional Driver | 5+ Years Experience
                    </p>
                    <p className="text-sm text-gray-500">New York City</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Available now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Request a quote
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">City Driving</Badge>
                    <Badge variant="secondary">Highway Driving</Badge>
                    <Badge variant="secondary">GPS Navigation</Badge>
                    <Badge variant="secondary">Customer Service</Badge>
                  </div>

                  <p className="text-sm">
                    Experienced driver with a perfect safety record.
                    Specializing in efficient city and highway deliveries. Known
                    for punctuality and excellent customer service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
