import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: any;
};

const Case3 = ({ formData, handleInputChange, errors, setFormData }: Props) => {
  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            List the items for delivery
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide details of the items to be delivered.
          </p>
        </div>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="min-h-[200px]"
          placeholder="List the items for delivery, e.g., 2 Hisense TVs, 1 laptop"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            List any special handling requirements (optional)
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide any special handling requirements for the items.
          </p>
        </div>
        <Textarea
          name="handlingRequirements"
          value={formData.handlingRequirements}
          onChange={handleInputChange}
          className="min-h-[50px]"
          placeholder="e.g., Fragile, Keep upright"
        />
        {errors.handlingRequirements && (
          <p className="text-sm text-red-500">{errors.handlingRequirements}</p>
        )}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Is it packaged?
          </h1>
        </div>
        <Select
          onValueChange={(value) =>
            setFormData({
              ...formData,
              isPackaged: value === "Yes" ? true : false,
            })
          }
          defaultValue={formData.isPackaged ? "Yes" : "No"}
        >
          <SelectTrigger>
            <SelectValue defaultValue="Yes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.isPackaged && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">
              Specify the type of packaging used
            </h1>
          </div>
          <Textarea
            name="packageType"
            value={formData.packageType}
            onChange={handleInputChange}
            className="min-h-[50px]"
            placeholder="e.g., Cardboard box, Bubble wrap, Plastic container, Wooden crate"
          />
          {errors.packageType && (
            <p className="text-sm text-red-500">{errors.packageType}</p>
          )}
        </div>
      )}
    </>
  );
};

export default Case3;
