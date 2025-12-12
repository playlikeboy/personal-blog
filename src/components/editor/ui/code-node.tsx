"use client";

import * as React from "react";
import type { PlateLeafProps } from "platejs/react";
import { PlateLeaf } from "platejs/react";
import { cn } from "@/lib/utils";

export function CodeLeaf({ className, ...props }: PlateLeafProps) {
    return (
        <PlateLeaf
            {...props}
            as="code"
            className={cn(
                "whitespace-pre-wrap rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm",
                className
            )}
        >
            {props.children}
        </PlateLeaf>
    );
}
