import prisma from "../../lib/prisma"; // Assuming you have a configured Prisma instance
import { z } from "zod";

// Zod schema for validation
export const courierJobSchema = z.object({
  Title: z.string().optional(),
  Description: z.string().optional(),
  Budget: z.string().optional(),
  clientId: z.string(),
  DropOff: z.string().optional(),
  districtDropOff: z.string().optional(),
  districtDroppoff: z.string().optional(),
  PickUp: z.string().optional(),
  districtPickUp: z.string().optional(),
  parcelSize: z.string().optional(),
  pickupPhoneNumber: z.string().optional(),
  dropoffPhoneNumber: z.string().optional(),
  dropOffEmail: z.string().optional(),
  collectionDate: z.date()
});

// Create Courier Job action
export async function createCourierJob(data: any) {
  try {
    // Validate input data
    const validatedData = courierJobSchema.parse(data);

    // Create a new courier job in the database
    const newCourierJob = await prisma.courierJobs.create({
      data: {
        Title: validatedData.Title,
        Description: validatedData.Description,
        Budget: validatedData.Budget,
        clientId: validatedData.clientId,
        DropOff: validatedData.DropOff,
        districtDropOff: validatedData.districtDropOff,
        PickUp: validatedData.PickUp,
        districtPickUp: validatedData.districtPickUp,
        parcelSize: validatedData.parcelSize,
        pickupPhoneNumber: validatedData.pickupPhoneNumber,
        dropoffPhoneNumber: validatedData.dropoffPhoneNumber,
        dropOffEmail: validatedData.dropOffEmail,
        collectionDate: validatedData.collectionDate,
      },
    });

    return newCourierJob;
  } catch (error) {
    console.error("Error creating courier job:", error);
    throw new Error("Unable to create courier job");
  }
}
