import { Driver } from '@/types/driver';

interface DocumentsTabProps {
  driver: Driver;
}

export function DocumentsTab({ driver }: DocumentsTabProps) {
  return (
    <dl className="grid gap-4">
      <div className="flex justify-between">
        <dt className="font-medium">License Number</dt>
        <dd>{driver.licenseNumber || 'Not specified'}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">License Expiry</dt>
        <dd>{driver.licenseExpiry || 'Not specified'}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">ID Number</dt>
        <dd>{driver.idNumber || 'Not specified'}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">DISC Expiry</dt>
        <dd>{driver.discExpiry || 'Not specified'}</dd>
      </div>
    </dl>
  );
}