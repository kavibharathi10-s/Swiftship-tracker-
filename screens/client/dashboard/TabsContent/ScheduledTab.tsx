import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScheduledTabProps {
  jobs: any[];
  onRowClick: (job: any) => void;
}

const ScheduledTab: FC<ScheduledTabProps> = ({ jobs, onRowClick }) => {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Deliveries</CardTitle>
        <CardDescription>All scheduled deliveries.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">PickUp</TableHead>
              <TableHead className="hidden sm:table-cell">DropOff</TableHead>
              <TableHead className="hidden md:table-cell">Date Created</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job.Id}
                className="bg-accent cursor-pointer"
                onClick={() => onRowClick(job)}
              >
                <TableCell>
                  <div className="font-medium">{job.Title}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {job.Description}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{job.PickUp}</TableCell>
                <TableCell className="hidden sm:table-cell">{job.DropOff}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(job.dateCreated).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">M {job.Budget}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ScheduledTab;
