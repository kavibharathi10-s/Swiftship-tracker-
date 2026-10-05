import { Driver } from '@/types/driver';

interface VehicleTabProps {
  driver: Driver;
}

export function VehicleTab({ driver }: VehicleTabProps) {
  return (
    <dl className="grid gap-4">
      <div className="flex justify-between">
        <dt className="font-medium">Vehicle Type</dt>
        <dd>{driver.vehicleType || 'Not specified'}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">VIN</dt>
        <dd>{driver.VIN || 'Not specified'}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">Plate Number</dt>
        <dd>{driver.plateNumber || 'Not specified'}</dd>
      </div>
    </dl>
  );
}