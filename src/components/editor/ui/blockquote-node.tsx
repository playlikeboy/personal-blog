"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

import { cn } from "@/lib/utils";

export function BlockquoteElement({ className, ...props }: PlateElementProps) {
    return (
        <PlateElement
            as="blockquote"
            className={cn("my-1 border-l-2 pl-6 italic", className)}
            {...props}
        />
    );
}
