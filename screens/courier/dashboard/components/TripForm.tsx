import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type TripFormData = {
  fromLocation: string;
  toLocation: string;
  routeDetails: string;
  tripDate: string;
};

interface TripFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TripFormData;
  onSubmit: (data: TripFormData) => Promise<void>;
  isLoading?: boolean;
}

const defaultFormData: TripFormData = {
  fromLocation: "",
  toLocation: "",
  routeDetails: "",
  tripDate: "",
};

export default function TripForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
}: TripFormProps) {
  const [formData, setFormData] = React.useState<TripFormData>(
    initialData || defaultFormData
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!initialData) {
      setFormData(defaultFormData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Trip" : "Schedule New Trip"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fromLocation">From Location</Label>
            <Input
              id="fromLocation"
              value={formData.fromLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fromLocation: e.target.value,
                }))
              }
              placeholder="Enter starting location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toLocation">To Location</Label>
            <Input
              id="toLocation"
              value={formData.toLocation}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, toLocation: e.target.value }))
              }
              placeholder="Enter destination"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripDate">Trip Date</Label>
            <Input
              id="tripDate"
              type="datetime-local"
              value={formData.tripDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tripDate: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routeDetails">Route Details</Label>
            <Textarea
              id="routeDetails"
              value={formData.routeDetails}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  routeDetails: e.target.value,
                }))
              }
              placeholder="Describe your route and any important details..."
              className="h-24"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : initialData ? (
              "Update Trip"
            ) : (
              "Create Trip"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
