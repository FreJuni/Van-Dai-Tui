"use client";

import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { ControllerRenderProps } from "react-hook-form";

type PhoneNumberInputProps = {
    field: ControllerRenderProps<{
        name: string;
        email: string;
        password: string;
        phone_number: string;
    }, "phone_number">;
    error?: string;
};

const PhoneNumberInput = ({ field }: PhoneNumberInputProps) => {
    return (
        <PhoneInput
            inputClassName="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            defaultCountry="US"
            placeholder="Enter phone number"
            value={field.value || ""}
            onChange={(value) => {
                field.onChange(value);
            }}
            international
            countryCallingCodeEditable={false}
        />
    );
};

export default PhoneNumberInput;
