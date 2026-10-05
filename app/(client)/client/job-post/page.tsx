"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import type { E164Number } from "libphonenumber-js/core";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, Box, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  PhoneInput,
  phoneNumberSchema,
  ValidationResult,
} from "@/screens/global/phone-input";
import { z } from "zod";
import { createJob, updateJob } from "@/actions/courierJobsActions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getClientById } from "@/actions/clientActions";
import { createJobAndDirectRequest } from "@/screens/client/utils/directRequests";
import DirectRequestButton from "@/screens/client/components/DirectRequestButton";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Case1 from "@/screens/client/job-post/Case1";
import Case2 from "@/screens/client/job-post/Case2";
import Case3 from "@/screens/client/job-post/Case3";
import Case4 from "@/screens/client/job-post/Case4";
import Case5 from "@/screens/client/job-post/Case5";
import Case6 from "@/screens/client/job-post/Case6";
import { uploadPickUpAndDropOffImage } from "@/screens/client/registration/utils/upload";

const packageSizes = [
  {
    id: 1,
    name: "Small Packages",
    description:
      "Lightweight and compact, generally small enough to be held in one hand or easily carried by one person.",
    dimensions: "Up to 30 x 30 x 30 cm",
    weight: "Up to 4.5 kg",
    examples: "Envelopes, small electronics, compact boxes",
    vehicles: "Bicycles, Motorbikes or Scooters, Compact Cars",
    icon: Package,
    price: 80, // Example fixed price
  },
  {
    id: 2,
    name: "Medium Packages",
    description:
      "Bulkier and heavier than small packages but still manageable by one person with ease.",
    dimensions: "30 to 60 cm on any side",
    weight: "4.5 - 18 kg",
    examples: "Shoe boxes, small appliance boxes, parcels",
    vehicles:
      "Motorbikes or Scooters (for lighter medium items), Compact to Mid-sized Cars, Small Vans",
    icon: Box,
    price: 150, // Example fixed price
  },
  {
    id: 3,
    name: "Large Packages",
    description:
      "Substantially large, requiring two people to carry or a vehicle for transport. These packages might not fit into standard car trunks.",
    dimensions: "60 to 120 cm on any side",
    weight: "18 - 45 kg",
    examples: "Furniture pieces, large appliances, bulkier electronics",
    vehicles:
      "Mid-sized Cars or Large Sedans (only if they fit), Large Vans, Pickup Trucks",
    icon: Truck,
    price: 250, // Example fixed price
  },
  {
    id: 4,
    name: "Extra-Large Packages",
    description:
      "Oversized packages that are heavy and require specialized handling, often more than two people to load.",
    dimensions: "Over 120 cm on any side",
    weight: "Over 45 kg",
    examples: "Mattresses, large appliances, large furniture",
    vehicles: "Pickup Trucks, Cargo Vans, Box Trucks",
    icon: Truck,
    price: 450, // Example fixed price
  },
];

export default function PostJobWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDriver, setIsSubmittingDriver] = useState(false);
  const router = useRouter();
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const driverId = searchParams.get("driverId");
  const formSchema = z.object({
    packageSize: z.number().min(1).max(5),
    title: z
      .string()
      .min(10, "Title must be at least 10 characters long")
      .max(100, "Title must not exceed 100 characters"),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters long")
      .max(1000, "Description must not exceed 1000 characters"),
    budget: z.string(),
    pickUp: z
      .string()
      .min(5, "Pickup address must be at least 5 characters long"),
    dropOff: z
      .string()
      .min(5, "Dropoff address must be at least 5 characters long"),
    districtPickup: z
      .string()
      .min(2, "District pickup must be at least 2 characters long"),
    districtDropoff: z
      .string()
      .min(2, "District dropoff must be at least 2 characters long"),
    weight: z.string(),
    dimensions: z.string(),
    suitableVehicles: z.string(),
    parcelSize: z.string(),
    pickupPhoneNumber: phoneNumberSchema,
    dropoffPhoneNumber: phoneNumberSchema,
    dropoffEmail: z.string().email("Invalid email address"),
    collectionDate: z
      .date()
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Collection date must be today or in the future"
      ),
    deliveryDate: z
      .date()
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Collection date must be today or in the future"
      ),
    handlingRequirements: z.string().optional(),
    recipientName: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    recipientGender: z.enum(["male", "female", "other"]),
    paymentMode: z.enum(["Ecocash", "M-Pesa", "Bank"]),
    packageType: z.string().optional(),
    isPackaged: z.boolean(),
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    PickUpLocation: null,
    DropOffLocation: null,
  });

  const [existingImages, setExistingImages] = useState<{
    [key: string]: string | null;
  }>({
    PickUp: null,
    DropOff: null,
  });

  const handleFileChange = (folder: string) => (file: File | null) => {
    // console.log("folder and file", folder, file);
    setFiles((prev) => ({ ...prev, [folder]: file }));
    if (file) {
      setExistingImages((prev) => ({ ...prev, [folder]: null }));
    }
  };

  const handleUpload = async (jobId: string) => {
    const allFilesSelectedOrExisting = Object.entries(files).every(
      ([key, file]) => file !== null || existingImages[key] !== null
    );

    for (const [folder, file] of Object.entries(files)) {
      if (file) {
        const { url, error } = await uploadPickUpAndDropOffImage(
          file,
          folder,
          jobId
        );

        if (error) {
          alert(`Error uploading ${folder}: ${error}`);
          return 1;
        }

        if (url) {
          const updatedCourierJob = await updateJob(jobId, {
            [folder]: url,
          });
          if (
            updatedCourierJob &&
            updatedCourierJob.error &&
            updatedCourierJob.error.length > 0
          ) {
            toast({
              title: "Error updating job",
              description: updatedCourierJob.error,
            });
            return 1;
          }
        }
      }
    }
    return 0;
  };
  type FormData = z.infer<typeof formSchema>;
  const [formData, setFormData] = useState<FormData>({
    packageSize: 1,
    title: "",
    description: "",
    budget: "80",
    pickUp: "",
    dropOff: "",
    districtPickup: "",
    districtDropoff: "",
    parcelSize: "",
    pickupPhoneNumber: "" as E164Number,
    dropoffPhoneNumber: "" as E164Number,
    dropoffEmail: "",
    collectionDate: null as unknown as Date,
    deliveryDate: null as unknown as Date,
    weight: "",
    dimensions: "",
    suitableVehicles: "",
    recipientGender: "male",
    recipientName: "",
    paymentMode: "Ecocash",
    handlingRequirements: "",
    packageType: "",
    isPackaged: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const totalSteps = 6;
  const exampleTitles = [
    "Need courier for same day delivery in Maseru",
    "Looking for reliable driver to transport fragile items",
    "Package delivery needed from Moshoeshoe 2 to Maputsoe",
  ];

  const validateStep = (stepNumber: number) => {
    let stepSchema: z.ZodType<any>;
    switch (stepNumber) {
      case 1:
        stepSchema = formSchema.pick({ packageSize: true });
        break;
      case 2:
        stepSchema = formSchema.pick({ title: true });
        break;
      case 3:
        stepSchema = formSchema.pick({ description: true });
        break;
      case 4:
        stepSchema = formSchema.pick({
          pickUp: true,
          dropOff: true,
          districtPickup: true,
          districtDropoff: true,
        });
        break;
      case 5:
        stepSchema = formSchema.pick({
          pickupPhoneNumber: true,
          dropoffPhoneNumber: true,
          recipientGender: true,
          recipientName: true,
        });
        break;
      case 6:
        stepSchema = formSchema.pick({
          collectionDate: true,
          deliveryDate: true,
        });
        break;
      default:
        return true;
    }

    try {
      stepSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange =
    (type: "pickup" | "dropoff") =>
    (value: E164Number, validation: ValidationResult) => {
      setFormData((prevData) => ({
        ...prevData,
        [`${type}PhoneNumber`]: value,
      }));
      if (!validation.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`${type}PhoneNumber`]: validation.error,
        }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[`${type}PhoneNumber` as keyof FormData];
          return newErrors;
        });
      }
    };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        setIsSubmitting(true);
        // check if user is verified
        const client = await getClientById(userId || "");
        if (!client.data?.isVerified) {
          setIsSubmitting(false);
          toast({
            title: "You must be verified to post a job",
            description:
              "Please wait until your account is verified to post a job",
            variant: "destructive", // Use the 'destructive' variant for error messages
          });
          return;
        }
        // submit form data
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (typeof value === "string" || value instanceof Blob) {
            formDataToSubmit.append(key, value);
          } else if (typeof value === "number" || value instanceof Date) {
            formDataToSubmit.append(key, value.toString());
          }
        });
        formDataToSubmit.append("clientId", userId || "");

        const response = await createJob(formDataToSubmit);

        if (response.success) {
          const upload = await handleUpload(response.data?.Id || "");
          toast({
            description: "Job created successfully!",
          });
          router.push("/client");
        } else {
          toast({
            description: response.error,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDirectRequest = async () => {
    if (!driverId) return;

    // Check if user is verified (similar to handleNext)
    setIsSubmitting(true);
    try {
      const client = await getClientById(userId || "");
      if (!client.data?.isVerified) {
        setIsSubmitting(false);
        toast({
          title: "You must be verified to post a job",
          description:
            "Please wait until your account is verified to post a job",
          variant: "destructive",
        });
        return;
      }

      const formDataToSubmit = new FormData();

      // Add form data entries to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string" || value instanceof Blob) {
          formDataToSubmit.append(key, value);
        } else if (typeof value === "number" || value instanceof Date) {
          formDataToSubmit.append(key, value.toString());
        }
      });

      formDataToSubmit.append("clientId", userId || "");

      const response = await createJobAndDirectRequest(
        formDataToSubmit,
        userId || "",
        driverId
      );

      if (response.success) {
        toast({
          description: "Job created successfully!",
        });
        router.push("/client");
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the job",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectedDriver = async (driverId: string) => {
    setIsSubmittingDriver(true);
    try {
      const client = await getClientById(userId || "");
      if (!client.data?.isVerified) {
        setIsSubmittingDriver(false);
        toast({
          title: "You must be verified to post a job",
          description:
            "Please wait until your account is verified to post a job",
          variant: "destructive",
        });
        return;
      }

      const formDataToSubmit = new FormData();

      // Add form data entries to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string" || value instanceof Blob) {
          formDataToSubmit.append(key, value);
        } else if (typeof value === "number" || value instanceof Date) {
          formDataToSubmit.append(key, value.toString());
        }
      });

      formDataToSubmit.append("clientId", userId || "");

      const response = await createJobAndDirectRequest(
        formDataToSubmit,
        userId || "",
        driverId
      );

      if (response.success) {
        toast({
          description: "Job created successfully!",
        });
        router.push("/client");
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the job",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingDriver(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Case1
            packageSizes={packageSizes}
            setFormData={setFormData}
            formData={formData}
          />
        );
      case 2:
        return (
          <Case2
            setFormData={setFormData}
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            exampleTitles={exampleTitles}
          />
        );
      case 3:
        return (
          <Case3
            setFormData={setFormData}
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <Case4
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            handleFileChange={handleFileChange}
          />
        );
      case 5:
        return (
          <Case5
            formData={formData}
            handlePhoneChange={handlePhoneChange}
            errors={errors}
            setFormData={setFormData}
          />
        );
      case 6:
        return (
          <Case6
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            {step}/{totalSteps}
          </span>
          <span className="ml-2">Job post</span>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between pt-8 ">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex flex-row space-x-2">
            {!driverId && step === totalSteps ? (
              isSubmittingDriver ? (
                <div className="ml-2 flex items-center justify-center h-12 w-12 border border-black bg-white text-black rounded-md hover:bg-gray-100">
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              ) : (
                <DirectRequestButton onDriverSelected={handleSelectedDriver} />
              )
            ) : null}

            <Button
              onClick={
                step === totalSteps && driverId
                  ? handleDirectRequest
                  : handleNext
              }
              disabled={
                (step === 1 && !formData.packageSize) ||
                (step === 2 && !formData.title) ||
                isSubmitting
              }
            >
              {step === totalSteps ? (
                isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Send className={driverId ? "w-8 h-8" : "w-12 h-12"} />
                )
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
