import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { getAllVerifiedDrivers } from "@/actions/driverActions";

interface Driver {
  Id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
}

interface DirectRequestButtonProps {
  onDriverSelected: (driverId: string) => void;
}

const DirectRequestButton: React.FC<DirectRequestButtonProps> = ({
  onDriverSelected,
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data } = await getAllVerifiedDrivers();
      if (data) {
        setDrivers(data);
        setFilteredDrivers(data);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const filtered = drivers.filter(
      (driver) =>
        driver.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [searchQuery, drivers]);

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setDialogOpen(true);
  };

  const confirmRequest = () => {
    if (selectedDriver) {
      onDriverSelected(selectedDriver.Id);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-2 border-black bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md"
          >
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white border rounded-lg shadow-lg w-full max-w-sm md:max-w-lg">
          {/* Fixed height container */}
          <div className="h-96 flex flex-col">
            {/* Search input with sticky positioning */}
            <div className="p-4 sticky top-0 bg-white border-b">
              <Input
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Scrollable content area with flex-grow */}
            <div className="flex-grow overflow-y-auto">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <DropdownMenuItem
                    key={driver.Id}
                    className="flex items-center space-x-4 p-4 hover:bg-gray-100"
                    onClick={() => handleDriverSelect(driver)}
                  >
                    <img
                      src={driver.photoUrl}
                      alt={`${driver.firstName} ${driver.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium truncate">
                        {`${driver.firstName} ${driver.lastName}`}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {driver.email}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No drivers found.
                </div>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-normal">
              Are you sure you want to send a direct request to{" "}
              <span className="font-bold">
                {selectedDriver?.firstName} {selectedDriver?.lastName}
              </span>
              ?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRequest}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DirectRequestButton;
