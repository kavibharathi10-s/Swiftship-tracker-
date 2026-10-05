import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Package, Truck, User, CheckCircle, MapPin, Clock, Smartphone, CreditCard, HelpCircle } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-center mb-8">
              How ShipSwift Works
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center mb-12">
              ShipSwift connects verified drivers with users who need packages delivered. Here's how our platform works for both drivers and users.
            </p>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">For Drivers</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:gap-16">
              <div className="flex flex-col items-center space-y-4 text-center">
                <User className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">1. Sign Up</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your account on the ShipSwift platform. Provide your personal information and details about your vehicle.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="text-xl font-bold">2. Get Verified</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Submit required documents such as your driver's license, vehicle registration, and insurance. Our team will review and verify your information.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Smartphone className="h-12 w-12 text-purple-500" />
                <h3 className="text-xl font-bold">3. Accept Requests</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Once verified, log into the app and start accepting delivery requests that fit your schedule and location.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Truck className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-bold">4. Complete Deliveries</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Pick up packages from the sender and deliver them to the specified destination. Follow the in-app instructions for each delivery.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">For Users</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:gap-16">
              <div className="flex flex-col items-center space-y-4 text-center">
                <User className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">1. Create an Account</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Sign up on the ShipSwift platform. Provide your contact information and verify your email address.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Package className="h-12 w-12 text-orange-500" />
                <h3 className="text-xl font-bold">2. Request a Delivery</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter the pickup and drop-off locations, package details, and any special instructions for your delivery.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Clock className="h-12 w-12 text-green-500" />
                <h3 className="text-xl font-bold">3. Get Matched</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our system will match you with an available, verified driver in your area. You'll receive details about the driver and estimated delivery time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <MapPin className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-bold">4. Track Your Package</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Follow your package's journey in real-time through the app. Receive notifications about pickup, transit, and delivery.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I become a driver for ShipSwift?</AccordionTrigger>
                <AccordionContent>
                  To become a driver, sign up on our platform, provide the required information and documents, and complete our verification process. Once approved, you can start accepting delivery requests.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What types of packages can be delivered through ShipSwift?</AccordionTrigger>
                <AccordionContent>
                  ShipSwift can handle a wide range of package sizes and types, from small envelopes to medium-sized boxes. However, we do not deliver hazardous materials, illegal items, or extremely large or heavy packages.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How is the delivery fee calculated?</AccordionTrigger>
                <AccordionContent>
                  Delivery fees are calculated based on factors such as distance, package size and weight, and delivery urgency. You'll see the exact fee before confirming your delivery request.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is my package insured during transit?</AccordionTrigger>
                <AccordionContent>
                  Yes, all packages delivered through ShipSwift are insured up to a certain value. Additional insurance can be purchased for high-value items.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join ShipSwift today and experience the future of courier services.
              </p>
              <div className="space-x-4">
                <Button className="bg-white text-black hover:bg-gray-200">Sign Up as a Driver</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Request a Delivery
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* cleared the foooter*/}
    </div>
  )
}