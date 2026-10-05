// Base types for related entities
interface ActiveJob {
    id: string;
    // Add other active job properties as needed
  }
  
  interface Contact {
    id: string;
    // Add other contact properties as needed
  }
  
  interface DriverRequest {
    id: string;
    // Add other driver request properties as needed
  }
  
  interface JobRequest {
    id: string;
    // Add other job request properties as needed
  }
  
  interface Location {
    id: string;
    latitude: number;
    longitude: number;
    // Add other location properties as needed
  }
  
  interface Message {
    id: string;
    // Add other message properties as needed
  }
  
  interface ScheduledTrip {
    id: string;
    // Add other scheduled trip properties as needed
  }
  
  interface ClientRequest {
    id: string;
    // Add other client request properties as needed
  }
  
  // Main Driver interface
  export interface Driver {
    Id: string;
    email: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
    idPhotoUrl: string;
    vehicleType?: string;
    dateCreated: Date | string;
    dateUpdated: Date | string;
    VIN?: string;
    idNumber?: string;
    licenseExpiry?: string;
    licenseNumber?: string;
    plateNumber?: string;
    discExpiry?: string;
    discPhotoUrl?: string;
    licensePhotoUrl?: string;
    location?: string;
    isVerified: boolean;
    reviews?: DriverReview[];
    
    // Related entities
    activeJobs?: ActiveJob[];
    Contacts?: Contact[];
    driveRequests?: DriverRequest[];
    JobRequests?: JobRequest[];
    Location?: Location[];
    Messages?: Message[];
    scheduledTrips?: ScheduledTrip[];
    clientRequests?: ClientRequest[];
  }
  
  // Component Props interface
  export interface DriverProfileProps {
    driverId: string;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  export interface DriverResponse extends ApiResponse<Driver> {}
  
  // Error types
  export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
  }
  
  // State types
  export interface DriverProfileState {
    driver: Driver | null;
    loading: boolean;
    error?: ApiError;
  }
  
  // Tab configuration type
  export interface TabConfig {
    id: string;
    label: string;
    // icon: React.ComponentType;
  }
  
  export const TABS: TabConfig[] = [
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'documents', label: 'Documents' },
    { id: 'activity', label: 'Activity' },
    { id: 'reviews', label: 'Reviews' }
  ];
  
  // Utility types
  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  export type DriverUpdatePayload = Partial<Omit<Driver, 'Id' | 'dateCreated' | 'dateUpdated'>>;

  export interface DriverReview {
    id: string;
    content?: string | null;
    rating: number;
    createdAt: Date;
    driverId: string;
    clientId: string;
    driver?: {
      Id: string;
      firstName: string;
      lastName: string;
    };
    client?: {
      Id: string;
      firstName: string;
      lastName: string;
    };
  }