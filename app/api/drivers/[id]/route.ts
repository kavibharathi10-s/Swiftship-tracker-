// app/api/drivers/[driverId]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Input validation schema
const ParamsSchema = z.object({
  driverId: z.string().min(1, "Driver ID is required")
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;
    console.log("Received driverId:", driverId); // Debug log

    const driver = await prisma.drivers.findUnique({
      where: {
        Id: driverId,
      },
      select: {
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        idPhotoUrl: true,
        vehicleType: true,
        dateCreated: true,
        dateUpdated: true,
        vehicleRegistrationNo: true,
        idNumber: true,
        licenseExpiry: true,
        licenseNumber: true,
        plateNumber: true,
        discExpiry: true,
        discPhotoUrl: true,
        licensePhotoUrl: true,
        location: true,
        isVerified: true,
                Review: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            clientId: true,
            client: {
              select: {
                Id: true,
                firstName: true,
                lastName: true,
                photoUrl: true
              }
            }
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch driver" }, 
      { status: 500 }
    );
  }
}



// Handler for updating driver information
export async function PATCH(
  request: Request,
  { params }: { params: { driverId: string } }
) {
  try {
    const { driverId } = ParamsSchema.parse(params);
    const body = await request.json();

    // Validate update payload
    const UpdateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
      vehicleType: z.string().optional(),
      location: z.string().optional(),
      plateNumber: z.string().optional(),
      VIN: z.string().optional(),
      licenseNumber: z.string().optional(),
      licenseExpiry: z.string().optional(),
      idNumber: z.string().optional(),
      discExpiry: z.string().optional(),
    });

    const validatedData = UpdateSchema.parse(body);

    const updatedDriver = await prisma.drivers.update({
      where: {
        Id: driverId,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedDriver);
  } catch (error) {
    console.error('Error updating driver:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handler for deleting a driver
export async function DELETE(
  request: Request,
  { params }: { params: { driverId: string } }
) {
  try {
    const { driverId } = ParamsSchema.parse(params);

    // Check if driver exists
    const driver = await prisma.drivers.findUnique({
      where: {
        Id: driverId,
      },
      include: {
        activeJobs: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Check if driver has active jobs
    if (driver.activeJobs.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete driver with active jobs' },
        { status: 400 }
      );
    }

    // Delete the driver
    await prisma.drivers.delete({
      where: {
        Id: driverId,
      },
    });

    return NextResponse.json(
      { message: 'Driver deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting driver:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid driver ID', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Types for API responses
export type DriverResponse = {
  data: {
    Id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    photoUrl: string;
    vehicleType: string | null;
    dateCreated: string;
    dateUpdated: string;
    VIN: string | null;
    plateNumber: string | null;
    location: string | null;
    isVerified: boolean;
    activeJobsCount: number;
    pendingTripsCount: number;
    lastKnownLocation: {
      latitude: number;
      longitude: number;
      timestamp: string;
    } | null;
  };
  error?: never;
} | {
  data?: never;
  error: string;
  details?: z.ZodError['errors'];
};