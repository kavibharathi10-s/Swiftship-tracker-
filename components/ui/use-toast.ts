// components/ui/use-toast.ts
import { Toaster, toast as hotToast } from "react-hot-toast";

export const useToast = () => {
  const toast = hotToast;

  return {
    toast,
    Toaster, // Return the Toaster component for usage in your component tree
  };
};
