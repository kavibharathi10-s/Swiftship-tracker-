import { ReactNode } from "react";

// types.ts
export interface CourierJob {
  Id: string;
  Title: string;
  Description: string;
  PickUp: string;
  DropOff: string;
  Budget: number;
  collectionDate: string;
  dateCreated: string;
}

export interface Driver {
  Id: string;
  name: string;
}

export interface Client {
  lastName: ReactNode;
  firstName: ReactNode;
  Id: string;
  name: string;
}

export interface ActiveJob {
  Id: string;
  courierJobId: string;
  driverId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  jobStatus: string;
  CourierJob: CourierJob;
  Driver: Driver;
  Client: Client;
}

export interface JobRequest {
  Id: string;
  isApproved: boolean;
  courierJobId: string;
  driverId: string;
  CourierJob: CourierJob;
  Driver: Driver;
}

// constants.ts
export const JOB_STATUS = {
  UNCLAIMED: "unclaimed",
  Ongoing: "ongoing",
  COLLECTED: "collected",
  DELIVERED: "delivered",
} as const;

export const STATUS_DESCRIPTIONS = {
  [JOB_STATUS.Ongoing]: "All scheduled deliveries awaiting pickup.",
  [JOB_STATUS.COLLECTED]:
    "Packages that have been picked up and are in transit.",
  [JOB_STATUS.DELIVERED]: "Successfully completed deliveries.",
} as const;

export const STATUS_ACTIONS = {
  [JOB_STATUS.Ongoing]: [
    {
      label: "Mark as Collected",
      status: JOB_STATUS.COLLECTED,
      icon: "Package",
    },
  ],
  [JOB_STATUS.COLLECTED]: [
    { label: "Mark as Delivered", status: JOB_STATUS.DELIVERED, icon: "Check" },
  ],
} as const;

export const STATUS_STYLES = {
  [JOB_STATUS.UNCLAIMED]: "bg-red-100 text-red-800",
  [JOB_STATUS.Ongoing]: "bg-yellow-100 text-yellow-800",
  [JOB_STATUS.COLLECTED]: "bg-blue-100 text-blue-800",
  [JOB_STATUS.DELIVERED]: "bg-green-100 text-green-800",
} as const;

// utils.ts
export const formatDate = (dateString: string | Date | null | undefined) => {
  if (
    !dateString ||
    (typeof dateString !== "string" && !(dateString instanceof Date))
  ) {
    console.error("Invalid date input:", dateString);
    return "Invalid date";
  }

  let date: Date;

  if (typeof dateString === "string") {
    const [day, month, year] = dateString.split("/").map(Number);
    date = new Date(year, month - 1, day); // Create date object (month is zero-indexed)
  } else {
    date = dateString; // Assume it's a Date object
  }

  const formattedDay = date.getDate().toString().padStart(2, "0");
  const formattedMonth = date.toLocaleString(undefined, { month: "short" });
  const formattedYear = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${formattedDay} ${formattedMonth} ${formattedYear} ${hours}:${minutes}`;
};

export const formatDateNoHrs = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");
};

export const filterJobsByStatus = (
  jobs: ActiveJob[] | undefined,
  status: string
) => {
  return jobs?.filter((job) => job.jobStatus === status) || [];
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
