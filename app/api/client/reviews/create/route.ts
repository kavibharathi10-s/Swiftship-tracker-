// app/api/reviews/client/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { clientId, driverId, rating, content } = await req.json();

    // Validate input
    if (!clientId || !driverId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.clientReview.create({
      data: {
        id: crypto.randomUUID(), // Generate a unique ID
        clientId,
        driverId,
        rating,
        content: content || '',
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}