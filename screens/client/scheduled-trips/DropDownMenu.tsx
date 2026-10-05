import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createcontact, getcontact } from "@/actions/contactsActions";
import { useAuth } from "@clerk/nextjs";

interface DropdownMenuComponentProps {
  driverId: string;
}

const DropdownMenuComponent: React.FC<DropdownMenuComponentProps> = ({
  driverId,
}) => {
  const router = useRouter();
  const { userId } = useAuth();

  const handleContactClick = async () => {
    if (!userId) return;
    const contact = await getcontact(userId, driverId);
    if (contact.success && contact.data && contact.data.length > 0) {
      router.push(`/conversations/${contact.data[0].Id}`);
    } else {
      const newContact = await createcontact({
        clientId: userId,
        driverId: driverId,
      });
      if (newContact.success && newContact.data) {
        router.push(`/conversations/=${newContact.data.Id}`);
      }
    }
  };

  const handleDirectRequestClick = () => {
    router.push(`/client/job-post?driverId=${driverId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white border rounded-lg shadow-lg">
        <DropdownMenuItem onClick={handleDirectRequestClick}>
          Direct request
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleContactClick}>
          Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DropdownMenuComponent;
