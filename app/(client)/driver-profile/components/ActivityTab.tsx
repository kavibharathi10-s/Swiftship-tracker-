import { Driver } from '@/types/driver';

interface ActivityTabProps {
  driver: Driver;
}

export function ActivityTab({ driver }: ActivityTabProps) {
  return (
    <dl className="grid gap-4">
      <div className="flex justify-between">
        <dt className="font-medium">Date Joined</dt>
        <dd>{new Date(driver.dateCreated).toLocaleDateString()}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">Last Updated</dt>
        <dd>{new Date(driver.dateUpdated).toLocaleDateString()}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">Active Jobs</dt>
        <dd>{driver.activeJobs?.length || 0}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-medium">Scheduled Trips</dt>
        <dd>{driver.scheduledTrips?.length || 0}</dd>
      </div>
    </dl>
  );
}