// utils/Upload.ts
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/nextjs";

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
  let fileName: string;

  console.log("file", file);
  console.log("folder", folder);
  console.log("clerkId", clerkId);

  // Determine the fileName based on the folder
  if (folder === "proof-of-delivery") {
    fileName = `${file.name}`;
  } else {
    fileName = `${clerkId}.${fileExtension}`;
  }

  try {
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("driver-documents")
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: "60",
        upsert: true,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase.storage
      .from("driver-documents")
      .getPublicUrl(`${folder}/${fileName}`);

    if (publicData) {
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
