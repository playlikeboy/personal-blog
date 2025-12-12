"use client";

import * as React from "react";
import type { PlateLeafProps } from "platejs/react";
import { PlateLeaf } from "platejs/react";
import { cn } from "@/lib/utils";

export function HighlightLeaf({ className, ...props }: PlateLeafProps) {
    return (
        <PlateLeaf
            {...props}
            as="mark"
            className={cn("bg-yellow-200/50 text-inherit", className)}
        >
            {props.children}
        </PlateLeaf>
    );
}
