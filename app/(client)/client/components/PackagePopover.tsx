import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function PackagePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-0">
            <img
              src="/assets/client/images/deliver_no_bg.gif"
              alt="Packaging gif"
              className="w-full h-[200px] object-cover"
            />
          </CardContent>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Packaging Requirements</CardTitle>
            <CardDescription>
              Ensure you have what you need to package your parcel for your
              chosen service.
            </CardDescription>
          </CardHeader>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Packaging Requirements</h3>
          <ul className="space-y-2">
            {[
              "Use a sturdy, corrugated cardboard box",
              "Wrap items individually with bubble wrap",
              "Fill empty spaces with packing peanuts",
              "Seal all seams with packing tape",
              "Attach a clear, printed label",
            ].map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            Proper packaging ensures your items arrive safely and helps avoid
            additional handling fees.
          </p>
          <Button className="w-full">Learn More</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
