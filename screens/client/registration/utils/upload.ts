// utils/Upload.ts
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/nextjs";
import { updateClient } from "@/actions/clientActions";
import { updateJob } from "@/actions/courierJobsActions";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to upload an image to Supabase
export async function uploadImage(
  file: File,
  folder: string,
  clerkId: string
): Promise<{ url: string | null; error: string | null }> {
  const fileExtension = file.type === "image/png" ? "png" : "jpg";
  const fileName = `${clerkId}.${fileExtension}`;

  try {
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("client-documents")
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: "60",
        upsert: true,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase.storage
      .from("client-documents")
      .getPublicUrl(`${folder}/${fileName}`);

    // Update the client's photoUrl in the database
    if (publicData) {
      if (folder === "client-photo-rt") {
        await updateClient(clerkId, {
          selfieImage: publicData.publicUrl,
        });
      }
      return { url: publicData.publicUrl, error: null };
    }

    return { url: null, error: "Could not generate public URL" };
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function uploadPickUpAndDropOffImage(
  file: File,
  folder: string,
  courierJobId: string
): Promise<{ url: string | null; error: string | null }> {
  const fileExtension = file.type === "image/png" ? "png" : "jpg";
  const fileName = `${courierJobId}.${fileExtension}`;

  try {
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("client-documents")
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: "60",
        upsert: true,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase.storage
      .from("client-documents")
      .getPublicUrl(`${folder}/${fileName}`);

    // Update the client's photoUrl in the database
    if (publicData) {
      if (folder === "client-photo-rt") {
        await updateJob(courierJobId, {
          selfieImage: publicData.publicUrl,
        });
      } else if (folder === "PickUp") {
        await updateJob(courierJobId, {
          PickUpImage: publicData.publicUrl,
        });
      } else if (folder === "DropOff") {
        await updateJob(courierJobId, {
          DropOffImage: publicData.publicUrl,
        });
      }
      return { url: publicData.publicUrl, error: null };
    }

    return { url: null, error: "Could not generate public URL" };
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
