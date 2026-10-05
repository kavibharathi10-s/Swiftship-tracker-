'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ClientProfileProps {
    client: {
      Id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      photoUrl: string;
      isVerified: boolean;
      dateCreated: Date;
      courierJobs: Array<{
        Id: string;
        Title: string | null;
        Budget: string | null;
        PickUp: string | null;
        DropOff: string | null;
        packageStatus: string | null;
      }>;
      ClientReview: Array<{
        id: string;
        content: string;
        rating: number;
        createdAt: Date;
        driver: {
          firstName: string;
          lastName: string;
        };
      }>;
    };
  }
  

export const ClientProfileContent = ({ client }: ClientProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={client.photoUrl} alt={client.firstName} />
              <AvatarFallback>{client.firstName[0]}{client.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">
                  {client.firstName} {client.lastName}
                </h2>
                {client.isVerified && (
                  <Badge variant="secondary">Verified</Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <p>Member since {new Date(client.dateCreated).toLocaleDateString()}</p>
                <p>{client.email}</p>
                <p>{client.phoneNumber}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Courier Jobs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Courier Jobs History</CardTitle>
              <CardDescription>All courier jobs you've been involved with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {client.courierJobs.map((job) => (
                  <Card key={job.Id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{job.Title || 'Untitled Job'}</h3>
                          <p className="text-sm text-gray-500">Budget: M{job.Budget}</p>
                          <div className="mt-2 text-sm">
                            <p>From: {job.PickUp}</p>
                            <p>To: {job.DropOff}</p>
                          </div>
                        </div>
                        <Badge>{job.packageStatus || 'Status Unknown'}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {client.courierJobs.length === 0 && (
                  <p className="text-center text-gray-500">No courier jobs found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Client Reviews</CardTitle>
              <CardDescription>What drivers say about you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {client.ClientReview.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {review.driver.firstName[0]}{review.driver.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {review.driver.firstName} {review.driver.lastName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.content}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {client.ClientReview.length === 0 && (
                  <p className="text-center text-gray-500">No reviews yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};