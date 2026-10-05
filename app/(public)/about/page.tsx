"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-muted">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center ">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                About Ship Swift
              </h1>
              <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                Ship Swift is your community-driven delivery network, connecting
                local drivers and senders for swift and reliable parcel
                deliveries.
              </p>
            </div>
            <div className="grid gap-12 mt-12 lg:grid-cols-2">
              <div className="space-y-4 flex flex-col items-center ">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground text-center">
                  Our mission is to empower communities by providing a platform
                  that connects people who need parcels delivered with trusted
                  local drivers.
                </p>
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold">Why Choose Us?</h2>
                <p className="text-muted-foreground text-center">
                  With Ship Swift, you get fast, reliable deliveries while
                  supporting your local community. Our focus on real-time
                  tracking and user satisfaction ensures a seamless experience.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Join Our Community
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Whether you're looking to send a parcel or earn extra income
                    as a driver, Ship Swift welcomes you.
                  </p>
                  <Button className="inline-flex items-center justify-center text-base font-bold">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
{/* cleared the footer */}

    </div>
  );
}
