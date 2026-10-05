"use client";

import * as React from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@clerk/nextjs";
import { onSubmitAsDriver } from "@/app/utils/submitRequest";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  clients: any;
};

export function DriverComboBox({ clients }: Props) {
  const user = useAuth();
  const [isSubmittingRequest, setIsSubmittingRequest] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <UserPlus />
          {/* <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search contact..." />
          <CommandList>
            {isSubmittingRequest ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                Request
              </div>
            ) : (
              <>
                <CommandEmpty>No contact found.</CommandEmpty>
                <CommandGroup>
                  {clients?.map((contact: any) => (
                    <CommandItem
                      key={contact.Id}
                      value={contact.fullName}
                      onSelect={async () => {
                        // setValue(currentValue === value ? "" : currentValue);
                        setIsSubmittingRequest(true);
                        const result = await onSubmitAsDriver(contact);

                        if (result === 1) {
                          toast.error(
                            `${
                              contact.firstName + "" + contact.lastName
                            } already sent you a request`
                          );
                        } else if (result === 2) {
                          toast.error(
                            `Request to add ${
                              contact.firstName + "" + contact.lastName
                            } as contact already sent!`
                          );
                        } else if (result === 3) {
                          toast.error("Client does not exist");
                        } else if (result) {
                          toast.success(
                            `Request to add ${contact.firstName} ${contact.lastName} sent!`
                          );
                        } else {
                          toast.error(
                            `Request to add ${contact.firstName} ${contact.lastName} unsuccessful`
                          );
                        }
                        setIsSubmittingRequest(false);
                        setOpen(false);
                      }}
                    >
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarImage
                            src={contact.photoUrl}
                            alt="user photo"
                          />
                        </Avatar>
                        {`${contact.firstName} ${contact.lastName}`}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
