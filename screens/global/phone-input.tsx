import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import type { E164Number } from "libphonenumber-js/core";
import {
  isPossiblePhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// Zod schema for phone number validation
const phoneNumberSchema = z.string().refine((value) => {
  // Check if the value is empty or undefined
  if (!value) return false;

  // Verify it starts with + and contains only digits after
  if (!/^\+\d+$/.test(value)) return false;

  // Use isPossiblePhoneNumber for additional validation
  return isPossiblePhoneNumber(value);
}, "Invalid phone number");

// Type for validation result
type ValidationResult = {
  success: boolean;
  error?: string;
  formatted?: string;
};

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    onValueChange?: (value: {
      phoneNumber: RPNInput.Value;
      isValid: boolean;
      formattedValue: string;
      validation: ValidationResult;
    }) => void;
  };

const validatePhoneNumber = (value: RPNInput.Value): ValidationResult => {
  if (!value) {
    return {
      success: false,
      error: "Phone number is required",
    };
  }

  const result = phoneNumberSchema.safeParse(value);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Invalid phone number",
    };
  }

  return {
    success: true,
    formatted: formatPhoneNumberIntl(value),
  };
};

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, onValueChange, ...props }, ref) => {
  const handleChange = (value: RPNInput.Value) => {
    if (onChange) {
      onChange(value);
    }

    // Enhanced value information with Zod validation
    if (onValueChange) {
      const validation = validatePhoneNumber(value);
      onValueChange({
        phoneNumber: value,
        isValid: validation.success,
        formattedValue: value ? formatPhoneNumberIntl(value) : "",
        validation,
      });
    }
  };

  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      defaultCountry="LS"
      international={true}
      onChange={handleChange}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-e-lg rounded-s-none", className)}
      {...props}
      ref={ref}
    />
  )
);

InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-e-none rounded-s-lg px-3")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

FlagComponent.displayName = "FlagComponent";

export { PhoneInput, phoneNumberSchema, validatePhoneNumber };
export type { PhoneInputProps, ValidationResult };
