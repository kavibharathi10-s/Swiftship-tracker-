import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  packageSizes: {
    id: number;
    name: string;
    description: string;
    price: number;
    dimensions: string;
    vehicles: string;
    weight: string;
    examples: string;
    icon: any;
  }[];
  formData: any;
  setFormData: (data: any) => void;
};

const Case1 = ({ packageSizes, formData, setFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">
          Select your package size
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the size that best fits your delivery needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packageSizes.map((size) => (
          <Card
            key={size.id}
            className={cn(
              "cursor-pointer hover:border-primary transition-colors",
              formData.packageSize === size.id && "border-primary"
            )}
            onClick={() =>
              setFormData({
                ...formData,
                packageSize: size.id,
                budget: size.price.toString(),
                parcelSize: size.name
                  .toLowerCase()
                  .replace(/\s/g, "")
                  .replace("-", ""),
                weight: size.weight,
                dimensions: size.dimensions,
                suitableVehicles: size.vehicles,
              })
            }
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <size.icon className="w-8 h-8" />
                <span className="text-2xl font-bold">M{size.price}.00</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{size.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {size.description}
              </p>
              <p className="text-sm">
                <strong>Dimensions:</strong> {size.dimensions}
              </p>
              <p className="text-sm">
                <strong>Weight:</strong> {size.weight}
              </p>
              <p className="text-sm">
                <strong>Examples:</strong> {size.examples}
              </p>
              <p className="text-sm">
                <strong>Suitable Vehicles:</strong> {size.vehicles}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Case1;
