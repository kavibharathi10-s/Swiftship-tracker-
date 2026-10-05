import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { ReviewCreateSchema } from '@/types/review';
import { auth, currentUser } from '@clerk/nextjs/server'
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get auth context
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await currentUser()

    const driverId = params.id;
    console.log('Creating review for driver:', driverId);
    console.log("Route parameters:", params);

    
    const driverExists = await prisma.drivers.findUnique({
      where: { Id: driverId },
    });

    if (!driverExists) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body using the create schema
    const body = await request.json();
    const validatedData = ReviewCreateSchema.parse(body);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Create the review
    const review = await prisma.driverReview.create({
      data: {
        id: crypto.randomUUID(),
        driverId,
        clientId: user.id,
        rating: validatedData.rating,
        content: validatedData.content,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Review created successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid review data provided',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}