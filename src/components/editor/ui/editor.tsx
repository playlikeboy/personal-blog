"use client";

import * as React from "react";
import { PlateContent, type PlateContentProps } from "platejs/react";
import { cn } from "@/lib/utils";

export function Editor({ className, ...props }: PlateContentProps) {
    return (
        <PlateContent
            className={cn(
                "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] p-4",
                className
            )}
            disableDefaultStyles
            {...props}
        />
    );
}
