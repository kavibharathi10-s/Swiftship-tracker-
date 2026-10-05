-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "clients" (
    "Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idPhotoUrl" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "selfieImage" TEXT DEFAULT '',

    CONSTRAINT "clients_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Drivers" (
    "Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idPhotoUrl" TEXT NOT NULL,
    "vehicleType" TEXT,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "idNumber" TEXT,
    "licenseExpiry" TEXT,
    "licenseNumber" TEXT,
    "plateNumber" TEXT,
    "discExpiry" TEXT,
    "discPhotoUrl" TEXT,
    "licensePhotoUrl" TEXT,
    "location" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION,
    "vehicleRegistrationNo" TEXT,

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "DriverReview" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "DriverReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientReview" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "ClientReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourierJobs" (
    "Id" TEXT NOT NULL,
    "Title" TEXT DEFAULT '',
    "Description" TEXT DEFAULT '',
    "Budget" TEXT DEFAULT '80',
    "clientId" TEXT NOT NULL,
    "DropOff" TEXT DEFAULT '',
    "districtDropOff" TEXT DEFAULT '',
    "PickUp" TEXT DEFAULT '',
    "districtPickUp" TEXT DEFAULT '',
    "parcelSize" TEXT DEFAULT '',
    "pickupPhoneNumber" TEXT DEFAULT '',
    "dropoffPhoneNumber" TEXT DEFAULT '',
    "dropOffEmail" TEXT DEFAULT '',
    "collectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packageStatus" TEXT DEFAULT '',
    "approvedRequestId" TEXT,
    "dimensions" TEXT DEFAULT '',
    "suitableVehicles" TEXT DEFAULT '',
    "weight" TEXT DEFAULT '',
    "isDirect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CourierJobs_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "DriverRequests" (
    "Id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isPending" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DriverRequests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "clientRequests" (
    "Id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isPending" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clientRequests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "driver" BOOLEAN NOT NULL DEFAULT false,
    "client" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "Id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "isConversating" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "Id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "JobRequest" (
    "Id" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "courierJobId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "JobRequest_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "DirectRequest" (
    "Id" TEXT NOT NULL,
    "courierJobId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectRequest_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ActiveJobs" (
    "Id" TEXT NOT NULL,
    "courierJobId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "jobStatus" TEXT NOT NULL DEFAULT 'ongoing',

    CONSTRAINT "ActiveJobs_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Location" (
    "Id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ScheduledTrips" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "fromLocation" TEXT NOT NULL,
    "toLocation" TEXT NOT NULL,
    "routeDetails" TEXT NOT NULL,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'SCHEDULED',

    CONSTRAINT "ScheduledTrips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FCMTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "FCMTokens_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_email_key" ON "Drivers"("email");

-- CreateIndex
CREATE INDEX "DriverReview_driverId_idx" ON "DriverReview"("driverId");

-- CreateIndex
CREATE INDEX "ClientReview_driverId_idx" ON "ClientReview"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "CourierJobs_approvedRequestId_key" ON "CourierJobs"("approvedRequestId");

-- AddForeignKey
ALTER TABLE "DriverReview" ADD CONSTRAINT "DriverReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverReview" ADD CONSTRAINT "DriverReview_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReview" ADD CONSTRAINT "ClientReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReview" ADD CONSTRAINT "ClientReview_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierJobs" ADD CONSTRAINT "CourierJobs_approvedRequestId_fkey" FOREIGN KEY ("approvedRequestId") REFERENCES "JobRequest"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierJobs" ADD CONSTRAINT "CourierJobs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequests" ADD CONSTRAINT "DriverRequests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequests" ADD CONSTRAINT "DriverRequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientRequests" ADD CONSTRAINT "clientRequests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientRequests" ADD CONSTRAINT "clientRequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_courierJobId_fkey" FOREIGN KEY ("courierJobId") REFERENCES "CourierJobs"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectRequest" ADD CONSTRAINT "DirectRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectRequest" ADD CONSTRAINT "DirectRequest_courierJobId_fkey" FOREIGN KEY ("courierJobId") REFERENCES "CourierJobs"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectRequest" ADD CONSTRAINT "DirectRequest_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveJobs" ADD CONSTRAINT "ActiveJobs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveJobs" ADD CONSTRAINT "ActiveJobs_courierJobId_fkey" FOREIGN KEY ("courierJobId") REFERENCES "CourierJobs"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveJobs" ADD CONSTRAINT "ActiveJobs_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTrips" ADD CONSTRAINT "ScheduledTrips_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
