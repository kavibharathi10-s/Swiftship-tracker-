import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch the courier job from the database
    const courierJob = await prisma.courierJobs.findUnique({
      where: { Id: id },
    });

    // If no job is found, return a 404 response
    if (!courierJob) {
      return NextResponse.json({ error: 'Courier job not found' }, { status: 404 });
    }

    // Return the courier job
    return NextResponse.json(courierJob);
  } catch (error) {
    console.error('Error fetching courier job:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the courier job' },
      { status: 500 }
    );
  }
}
