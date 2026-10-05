"use client";
import {
  CircleCheckBig,
  CreditCard,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Plus,
  Truck,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ship Swift</h1>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </header> */}

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Delivery Jobs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Required to post jobs</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Add a payment method</p>
                <p className="text-sm text-muted-foreground">
                  Start posting jobs 3X faster.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <p>Required to post jobs</p>
                <CircleCheckBig className="text-green-500 w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Mail className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Email verified</p>
                <p className="text-sm text-muted-foreground">
                  Your email address is confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <p>Required to post jobs</p>
                <CircleCheckBig className="text-green-500 w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Phone verified</p>
                <p className="text-sm text-muted-foreground">
                  Your phone number is confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Post a Delivery Job</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create a new delivery job and get proposals from drivers.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => {
                router.push("/client/dashboard/deliver");
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Post a Delivery Job
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Find Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse and message available drivers in your area.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                router.push("/browse");
              }}
            >
              <User className="mr-2 h-4 w-4" /> Browse Drivers
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Track Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor your ongoing deliveries in real-time.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                router.push("client/dashboard/shipments");
              }}
            >
              <Truck className="mr-2 h-4 w-4" /> View All Deliveries
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Get Started with Ship Swift
        </h2>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold">
                Connect with drivers to get deliveries done
              </h3>
              <p className="text-muted-foreground">
                Learn how to use Ship Swift effectively
              </p>
            </div>
            <Button>Go to Guide</Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Everything you need to know about payments on Ship Swift
            </p>
          </CardContent>
          <CardFooter>
            <Link href="#" className="text-primary hover:underline">
              Learn more
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Billing Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              How to set up your preferred billing method
            </p>
          </CardContent>
          <CardFooter>
            <Link href="#" className="text-primary hover:underline">
              Learn more
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trust & Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Keep yourself and others safe on Ship Swift
            </p>
          </CardContent>
          <CardFooter>
            <Link href="#" className="text-primary hover:underline">
              Learn more
            </Link>
          </CardFooter>
        </Card>
      </section>
      <footer className=" py-12 mt-12">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link href="#" className="">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Safety & Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="">
                    Trust, Safety & Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="">
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="">
                    Ship Swift Foundation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Terms & Policies</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center pt-8 border-t border-gray-700">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <p className="text-sm">Follow Us</p>
              <Link href="#" className="">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm">
            © 2024 Next Gen Lesotho.
          </div>
        </div>
      </footer>
    </div>
  );
}
