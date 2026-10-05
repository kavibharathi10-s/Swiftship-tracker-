import { Truck } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
      <Truck className="animate-truck" width="100" height="100" />
      <p className="text-lg text-gray-700">____________________</p>
    </div>
  );
}
