import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: { driverId: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await request.json();
    const { driverId } = params;

    // Get the client record associated with the Clerk user
    const client = await prisma.clients.findUnique({
      where: {
        Id: userId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Verify the review exists and belongs to the specified driver and client
    const review = await prisma.driverReview.findFirst({
      where: {
        id: reviewId,
        driverId: driverId,
        clientId: client.Id, // Use the client's ID from your database
      },
    });

    if (!review) {
      return NextResponse.json(
        {
          error: "Review not found or you do not have permission to delete it",
        },
        { status: 404 }
      );
    }

    // Delete the review
    await prisma.driverReview.delete({
      where: {
        id: reviewId,
      },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
