import { Driver } from '@/types/driver';
import { 
    Mail,
    Phone,
    MapPin
  } from 'lucide-react';

interface VehicleTabProps {
    driver: Driver;
  }

function DriverInfo({ driver }: VehicleTabProps) {
  return (
    <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={driver.photoUrl}
                  alt={`${driver.firstName} ${driver.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">
                {driver.firstName} {driver.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${driver.email}`} className="text-sm">
                  {driver.email}
                </a>
              </div>
              {driver.phoneNumber && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${driver.phoneNumber}`} className="text-sm">
                    {driver.phoneNumber}
                  </a>
                </div>
              )}
              {driver.location && (
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{driver.location}</span>
                </div>
              )}
            </div>
  )
}

export default DriverInfo
