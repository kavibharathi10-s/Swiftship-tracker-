import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { useRouter } from "next/navigation";
import { getActiveJobByCourierJobId } from "@/actions/activeJobsActions";
import {
  confirmClientDelivery,
  getDeliveryByActiveJobId,
} from "@/actions/deliveredJobsActions";

export default function ReleasePayment({ job }: { job: { Id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeliveryConfirmation = async () => {
    if (!job?.Id) {
      toast({ description: "Job ID not found", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const ActiveJob = await getActiveJobByCourierJobId(job.Id);

      if (!ActiveJob) {
        toast({ description: "Active job not found", variant: "destructive" });
        return;
      }

      const Delivery = await getDeliveryByActiveJobId(ActiveJob.Id);
      if (!Delivery) {
        toast({ description: "Delivery not found", variant: "destructive" });
        return;
      }
      const updatedJob = await confirmClientDelivery(Delivery.Id);

      if (updatedJob?.Id) {
        toast({ description: "Delivery confirmed" });
        router.refresh();
      } else {
        toast({
          description: "An unexpected error occurred, please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast({
        description: "An error occurred, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HandCoins className="h-4 w-4" /> Release payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Release Payment</DialogTitle>
          <DialogDescription>
            Are you sure you want to release payment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDeliveryConfirmation}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Yes, Make Payment"}
          </Button>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Cancelled" })}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
