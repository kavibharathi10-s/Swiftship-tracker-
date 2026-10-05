"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { E164Number } from "libphonenumber-js/core";
import { createJob } from "@/actions/courierJobsActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { PhoneInput, phoneNumberSchema } from "@/screens/global/phone-input";

const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().positive("Budget must be greater than 0"),
  pickUp: z.string().min(5, "Pick up address must be at least 5 characters"),
  dropOff: z.string().min(5, "Drop off address must be at least 5 characters"),
  districtPickup: z.string().min(2, "District pickup is required"),
  districtDropoff: z.string().min(2, "District dropoff is required"),
  parcelSize: z.string().min(2, "Parcel size is required"),
  pickupPhoneNumber: phoneNumberSchema,
  dropoffPhoneNumber: phoneNumberSchema,
  dropoffEmail: z.string().email("Invalid email address"),
  collectionDate: z.date({
    required_error: "Collection date is required",
  }),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function ModernJobForm() {
  const { user, isLoaded } = useUser();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      pickUp: "",
      dropOff: "",
      districtPickup: "",
      districtDropoff: "",
      parcelSize: "",
      pickupPhoneNumber: "",
      dropoffPhoneNumber: "",
      dropoffEmail: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: JobFormValues) => {
    if (!isLoaded || !user) {
      toast({
        description: "User is not authenticated.",
        variant: "destructive",
      });
      return;
    }
    console.log(data);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, format(value, "yyyy-MM-dd"));
      } else {
        formData.append(key, value.toString());
      }
    });
    formData.append("clientId", user.id);

    const response = await createJob(formData);

    if (response.success) {
      toast({
        description: "Job created successfully!",
      });
      form.reset();
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-screen mb-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a Job</CardTitle>
          <CardDescription>
            Fill out the form below to create a new courier job.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickUp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pick Up</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dropOff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Off</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="districtPickup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District Pickup</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="districtDropoff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District Drop Off</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="parcelSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel Size</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="small" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          value={field.value as E164Number}
                          onChange={(value) => field.onChange(value || "")}
                          onValueChange={({ validation }) => {
                            if (!validation.success) {
                              form.setError("pickupPhoneNumber", {
                                type: "manual",
                                message: validation.error,
                              });
                            } else {
                              form.clearErrors("pickupPhoneNumber");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dropoffPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dropoff Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          value={field.value as E164Number}
                          onChange={(value) => field.onChange(value || "")}
                          onValueChange={({ validation }) => {
                            if (!validation.success) {
                              form.setError("dropoffPhoneNumber", {
                                type: "manual",
                                message: validation.error,
                              });
                            } else {
                              form.clearErrors("dropoffPhoneNumber");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dropoffEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropoff Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="johndoe@gmail.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collectionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date.getTime() < new Date().setHours(0, 0, 0, 0)
                          } // converts date to timestamp
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating
                    Job...
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
