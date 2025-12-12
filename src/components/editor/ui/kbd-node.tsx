"use client";

import * as React from "react";
import type { PlateLeafProps } from "platejs/react";
import { PlateLeaf } from "platejs/react";
import { cn } from "@/lib/utils";

export function KbdLeaf({ className, ...props }: PlateLeafProps) {
    return (
        <PlateLeaf
            {...props}
            as="kbd"
            className={cn(
                "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm shadow-sm",
                className
            )}
        >
            {props.children}
        </PlateLeaf>
    );
}
