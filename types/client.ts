// types/client.ts
export interface Client {
    Id: string
    email: string
    phoneNumber: string
    firstName: string
    lastName: string
    photoUrl: string
    idPhotoUrl: string
    dateCreated: Date
    dateUpdated: Date
    isVerified: boolean
    selfieImage?: string
    activeJobs: ActiveJob[]
    courierJobs: CourierJob[]
    Review: Review[]
  }
  
  interface ActiveJob {
    id: string
    // Add other job properties
  }
  
  interface CourierJob {
    id: string;
    title: string | null;
    description: string | null;
    budget: string | null;
    clientId: string;
    dropOff: string | null;
    districtDropOff: string | null;
    pickUp: string | null;
    districtPickUp: string | null;
    parcelSize: string | null;
    pickupPhoneNumber: string | null;
    dropoffPhoneNumber: string | null;
    dropOffEmail: string | null;
    collectionDate: Date;
    dateCreated: Date;
    packageStatus: string | null;
    approvedRequestId: string | null;
    dimensions: string | null;
    suitableVehicles: string | null;
    weight: string | null;
    isDirect: boolean;
    
    // Relations
    // activeJobs?: ActiveJobs[];
    // approvedRequest?: JobRequest | null;
    // client: Client;
    // directRequest?: DirectRequest[];
    // jobRequests?: JobRequest[];
  }
  
  interface Review {
    id: string
    // Add other review properties
  }