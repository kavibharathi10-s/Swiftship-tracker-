import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

type Props = {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
};

const Case6 = ({ errors, setFormData, formData }: Props) => {
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Set collection date and time
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the date and time of when the item should be collected.
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.collectionDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.collectionDate ? (
                format(formData.collectionDate, "PPP HH:mm")
              ) : (
                <span>Pick a date and time</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.collectionDate || undefined}
              onSelect={(date) =>
                setFormData({
                  ...formData,
                  collectionDate: date
                    ? new Date(date.setHours(0, 0, 0, 0))
                    : new Date(new Date().setHours(0, 0, 0, 0)),
                })
              }
              initialFocus
            />
            <div className="p-3 border-t">
              <Input
                type="time"
                onChange={(e) => {
                  const date = formData.collectionDate || new Date();
                  const [hours, minutes] = e.target.value.split(":");
                  date.setHours(parseInt(hours), parseInt(minutes));
                  setFormData({
                    ...formData,
                    collectionDate: date,
                  });
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        {errors.collectionDate && (
          <p className="text-sm text-red-500">{errors.collectionDate}</p>
        )}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Set the expected delivery date
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the date when the item should be delivered.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.deliveryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.deliveryDate ? (
                format(formData.deliveryDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.deliveryDate || undefined}
              onSelect={(date) =>
                setFormData({
                  ...formData,
                  deliveryDate: date
                    ? new Date(date.setHours(0, 0, 0, 0))
                    : new Date(new Date().setHours(0, 0, 0, 0)),
                })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.deliveryDate && (
          <p className="text-sm text-red-500">{errors.deliveryDate}</p>
        )}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Payment Method
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the payment method.
          </p>
        </div>
        <Select
          value={formData.paymentMode}
          onValueChange={(value: "Ecocash" | "M-Pesa" | "Bank") =>
            setFormData({ ...formData, paymentMode: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ecocash">Ecocash</SelectItem>
            <SelectItem value="M-Pesa">M-Pesa</SelectItem>
            <SelectItem value="Bank">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
        {errors.paymentMode && (
          <p className="text-sm text-red-500">{errors.paymentMode}</p>
        )}
      </div>
    </>
  );
};

export default Case6;
