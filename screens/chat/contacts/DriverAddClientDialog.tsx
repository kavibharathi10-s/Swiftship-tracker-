"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AddContactSchema } from "@/app/utils/zodSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAllClients } from "@/actions/clientActions";
import { useAuth } from "@clerk/nextjs";
import { createDriverRequest, getDriverRequest } from "@/actions/driverRequest";
import { toast } from "sonner";
import { getClientRequest } from "@/actions/clientRequest";

type Props = {};

const DriverAddClient = (props: Props) => {
  const sender = useAuth();
  const form = useForm<z.infer<typeof AddContactSchema>>({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AddContactSchema>) => {
    const email = values.email;

    try {
      console.log(email);
      const receiverResponse = await getAllClients();
      console.log(receiverResponse);

      // Check if the API call to get all clients succeeded
      if (!receiverResponse.success || !receiverResponse.data) {
        console.error("Failed to retrieve clients", receiverResponse.error);
        toast.error(
          "An error occured, please check your internet and try again"
        );
        return;
      }

      // Filter the receiver based on the provided email
      const receiver = receiverResponse.data.filter(
        (client) => client.email === email
      );

      // Ensure that the sender is valid (assuming `sender` is defined elsewhere in your code)
      if (!sender || !receiver || receiver.length === 0) {
        console.error("Sender or receiver not found");
        console.log(`sender: ${sender}, receiver: ${receiver}`);
        toast.error(`Client does not exist!`);
        return;
      }

      const senderId = String(sender.userId); // Ensure senderId is a string
      const receiverId = String(receiver[0].Id); // Ensure receiverId is a string

      // Check if a request between sender and receiver already exists
      const [checkRequestInClient, checkRequestInDriver] = await Promise.all([
        getClientRequest(senderId, receiverId),
        getDriverRequest(receiverId, senderId),
      ]);
      if (checkRequestInDriver?.success) {
        console.log(
          "Request already sent, request: " + checkRequestInDriver?.data
        );
        toast.error(
          `Request to add ${
            receiver[0].firstName + "" + receiver[0].lastName
          } as contact already sent`
        );
      } else if (checkRequestInClient?.success) {
        console.log(
          "Request already sent, request: " + checkRequestInClient?.data
        );
        toast.error(
          `${
            receiver[0].firstName + "" + receiver[0].lastName
          } already sent you a request!`
        );
      } else {
        const requestData = {
          receiverId: receiverId, // Ensure this is a plain string
          senderId: senderId, // Ensure this is also a plain string
          message: "Just sent a friend request",
        };

        console.log("Request Data:", requestData);

        // Pass requestData as an argument to ensure it's a plain object
        const response = await createDriverRequest(requestData);
        console.log("response for trying to make request: " + response.success);
        if (response.success) {
          toast.success(
            `Request to add ${
              receiver[0].firstName + "" + receiver[0].lastName
            } as contact sent!`
          );
        } else {
          toast.error(
            `Request to add ${
              receiver[0].firstName + "" + receiver[0].lastName
            } as contact unsuccesful`
          );
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Unexpected error occured");
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" asChild>
            <DialogTrigger>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Contact</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogDescription>Send a request to connect!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Send Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DriverAddClient;
