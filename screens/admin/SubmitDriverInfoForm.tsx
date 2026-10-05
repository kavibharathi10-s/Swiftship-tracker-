"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  Submit: (userId: string, user: any, data: any) => void;
  user: any;
  driverId?: string;
};

const formSchema = z.object({
  vehicleRegistrationNo: z
    .string()
    .min(17)
    .max(17, { message: "Vehicle Registration Number must be exactly 17 characters" }),
  IdNumber: z.string().min(1, { message: "ID Number is required" }),
  LicenseNumber: z.string().min(1, { message: "License Number is required" }),
  LicenseExpirationDate: z.date({
    required_error: "License expiration date is required",
  }),
  PlateNumber: z.string().min(1, { message: "Plate Number is required" }),
  DiscExpiryDate: z.date({
    required_error: "Disc expiry date is required",
  }),
});

export default function GetDriverInfoForm({ user, Submit, driverId }: Props) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleRegistrationNo: "",
      IdNumber: "",
      LicenseNumber: "",
      PlateNumber: "",
      LicenseExpirationDate: undefined,
      DiscExpiryDate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormSubmitting(true);
    // Simulate API call
    const formData = {
      vehicleRegistrationNo: values.vehicleRegistrationNo,
      idNumber: values.IdNumber,
      licenseNumber: values.LicenseNumber,
      plateNumber: values.PlateNumber,
      licenseExpiry: values.LicenseExpirationDate?.toISOString(),
      discExpiry: values.DiscExpiryDate?.toISOString(),
    };
    if (driverId && driverId.length > 0) Submit(driverId, user, formData);
    else Submit(user.id, user, formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="vehicleRegistrationNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter 17-character Vehicle Registration Number" {...field} />
              </FormControl>
              <FormDescription>
                Vehicle Registration Number (17 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="IdNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter ID Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="LicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter License Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="LicenseExpirationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>License Expiration Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date < new Date() || date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="PlateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plate Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter Plate Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="DiscExpiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Disc Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date < new Date() || date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={formSubmitting}>
          {formSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
