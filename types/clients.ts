export interface ClientData {
    Id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    photoUrl: string;
    isVerified: boolean;
    dateCreated: Date;
    courierJobs: Array<{
      Id: string;
      Title: string;
      Budget: string;
      PickUp: string;
      DropOff: string;
      packageStatus: string;
    }>;
    ClientReview: Array<{
      id: string;
      content: string;
      rating: number;
      createdAt: Date;
      driver: {
        firstName: string;
        lastName: string;
      };
    }>;
  }
  
  export interface ClientProfileProps {
    client: ClientData;
  }