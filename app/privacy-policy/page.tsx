"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Ship Swift Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-6">
          Effective Date: November 27, 2024
        </p>
        <p>
          At Ship Swift, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we
          collect, use, and share information about our users, including both
          clients and drivers. By using the Ship Swift platform ("Service"), you
          agree to the terms outlined in this policy.
        </p>
        <br />
        <h2 className="font-bold">1. Information We Collect</h2>
        <p>To provide our services, we collect the following information:</p>
        <ul className="list-disc list-inside pl-5">
          <li>
            <strong>For Drivers:</strong> Name, ID Number, Profile Photo,
            Driver's License Number, Driver's License Expiration Date, License
            Plate Number, Vehicle Identification Number, Vehicle Disc Expiration
            Date, and vehicle images.
          </li>
          <li>
            <strong>For Clients:</strong> Name, ID Number, and delivery
            information such as pickup and drop-off addresses.
          </li>
          <li>
            <strong>Automatically Collected Information:</strong> Device
            information, IP address, and usage data to improve platform
            performance and ensure security.
          </li>
        </ul>
        <br />
        <h2 className="font-bold">2. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul className="list-disc list-inside pl-5">
          <li>
            To verify identities and ensure the security of both clients and
            drivers.
          </li>
          <li>
            To enable tracking of drivers' locations for parcel delivery updates
            and route optimization.
          </li>
          <li>To facilitate communication between clients and drivers.</li>
          <li>
            To comply with legal requirements and maintain safety standards.
          </li>
        </ul>
        <br />
        <h2 className="font-bold">3. Information Sharing</h2>
        <p>
          We respect your privacy and will not share your personal information
          except as follows:
        </p>
        <ul className="list-disc list-inside pl-5">
          <li>
            <strong>Public Information:</strong> Drivers’ names and vehicle
            images will be visible to clients to help identify them during
            parcel deliveries.
          </li>
          <li>
            <strong>Sensitive Information:</strong> Sensitive data such as ID
            numbers and license details are stored securely and will not be
            shared with other users.
          </li>
          <li>
            <strong>Third Parties:</strong> We may share information with
            service providers or partners who assist with payment processing,
            background checks, or platform analytics.
          </li>
        </ul>
        <br />
        <h2 className="font-bold">4. Location Tracking</h2>
        <p>
          Drivers’ real-time locations are tracked while on active delivery jobs
          to provide clients with updates on parcel status and estimated arrival
          times. Location data is only collected during the job and is not
          retained afterward.
        </p>
        <br />
        <h2 className="font-bold">5. Data Security</h2>
        <p>
          We implement strict measures to protect your personal information.
          This includes encryption, access controls, and regular security
          audits. However, no system is entirely foolproof, and we encourage you
          to report any suspected security issues.
        </p>
        <br />
        <h2 className="font-bold">6. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights over your
          data, such as the right to access, correct, delete, or restrict the
          use of your personal information. To exercise your rights, please
          contact us at the email address below.
        </p>
        <br />
        <h2 className="font-bold">7. Retention of Data</h2>
        <p>
          We retain your personal information for as long as necessary to
          provide our services or comply with legal obligations. When your data
          is no longer required, we securely delete or anonymize it.
        </p>
        <br />
        <h2 className="font-bold">8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices
          or legal requirements. Any significant updates will be communicated to
          you via email or through the platform.
        </p>
        <br />
        <h2 className="font-bold">9. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle
          your data, please contact us at:
        </p>
        <p>Email: [Your Contact Email]</p>
        <p>Phone: [Your Contact Number]</p>
        <br />
        <div className="flex justify-between items-center mt-8">
          <Button
            className="flex items-center justify-center h-10 w-10 rounded-full"
            variant="outline"
            onClick={() => router.back()}
          >
            <ChevronLeft className="" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
