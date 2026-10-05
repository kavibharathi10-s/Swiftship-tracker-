import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errors: any;
  exampleTitles: string[];
};

const Case2 = ({
  formData,
  setFormData,
  handleInputChange,
  errors,
  exampleTitles,
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">
          Let's start with a strong title.
        </h1>
        <p className="text-lg text-muted-foreground">
          This helps your job post stand out to the right couriers. It's the
          first thing they'll see, so make it count!
        </p>
      </div>
      <Input
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className="text-lg py-6"
        placeholder="Write a title for your job post"
      />
      {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      <div className="space-y-4">
        <h2 className="text-sm font-medium">Example titles</h2>
        <ul className="space-y-3">
          {exampleTitles.map((title, index) => (
            <li
              key={index}
              className="text-primary cursor-pointer hover:underline"
              onClick={() => setFormData({ ...formData, title: title })}
            >
              {title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Case2;
