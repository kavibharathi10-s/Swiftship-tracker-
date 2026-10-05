// app/api/client-reviews/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rating, content, clientId, driverId } = body;

    // Validate the input
    if (!rating || !clientId || !driverId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify that the authenticated user is the driver
    const driver = await prisma.drivers.findUnique({
      where: {
        Id: driverId,
      },
    });

    if (!driver || driver.email !== user.emailAddresses[0].emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized: You can only create reviews as a driver" },
        { status: 403 }
      );
    }

    // Create the review
    const review = await prisma.clientReview.create({
      data: {
        id: nanoid(), // Generate unique ID
        rating,
        content,
        client: {
          connect: {
            Id: clientId,
          },
        },
        driver: {
          connect: {
            Id: driverId,
          },
        },
      },
      include: {
        driver: {
          select: {
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
    });

    // Optional: Calculate and update client's average rating
    const clientReviews = await prisma.clientReview.findMany({
      where: {
        clientId,
      },
      select: {
        rating: true,
      },
    });

    const averageRating =
      clientReviews.reduce((acc, review) => acc + review.rating, 0) /
      clientReviews.length;

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");
    const clientId = searchParams.get("clientId");

    const where = {
      ...(driverId && { driverId }),
      ...(clientId && { clientId }),
    };

    const reviews = await prisma.clientReview.findMany({
      where,
      include: {
        driver: {
          select: {
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
