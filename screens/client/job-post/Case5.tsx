import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput, ValidationResult } from "@/screens/global/phone-input";
import React from "react";
import type { E164Number } from "libphonenumber-js/core";

type Props = {
  formData: any;
  handlePhoneChange: (
    type: "pickup" | "dropoff"
  ) => (value: E164Number, validation: ValidationResult) => void;
  errors: any;
  setFormData: (data: any) => void;
};

const Case5 = ({ formData, handlePhoneChange, errors, setFormData }: Props) => {
  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Contact information
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide contact details for pickup and delivery.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pickup Contact</h2>
          <PhoneInput
            value={formData.pickupPhoneNumber}
            onChange={(value) =>
              handlePhoneChange("pickup")(value as E164Number, {
                success: true,
              })
            }
            onValueChange={({ phoneNumber, validation }) =>
              handlePhoneChange("pickup")(phoneNumber as E164Number, validation)
            }
          />
          {errors.pickupPhoneNumber && (
            <p className="text-sm text-red-500">{errors.pickupPhoneNumber}</p>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dropoff Contact</h2>
          <PhoneInput
            value={formData.dropoffPhoneNumber}
            onChange={(value) =>
              handlePhoneChange("dropoff")(value as E164Number, {
                success: true,
              })
            }
            onValueChange={({ phoneNumber, validation }) =>
              handlePhoneChange("dropoff")(
                phoneNumber as E164Number,
                validation
              )
            }
          />
          {errors.dropoffPhoneNumber && (
            <p className="text-sm text-red-500">{errors.dropoffPhoneNumber}</p>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Recipient information
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide recipient details.
          </p>
          <p className="text-lg"> Name</p>
          <Input
            placeholder="Thabo Mokhosi"
            value={formData.recipientName}
            onChange={(e) =>
              setFormData({ ...formData, recipientName: e.target.value })
            }
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="space-y-4">
            <div>
              <p className="text-lg"> Gender</p>
              <Select
                value={formData.recipientGender}
                onValueChange={(value: "male" | "female" | "other") =>
                  setFormData({ ...formData, recipientGender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Case5;
