"use client";

import { cn } from "@/utils/cn";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
    loading?: boolean;
}

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    SeparatorProps
>(
    (
        { className, orientation = "horizontal", decorative = true, loading = false, ...props },
        ref
    ) => (
        <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "shrink-0 bg-separator/15 relative overflow-hidden",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className
            )}
            {...props}
        >
            {loading && (
                <div className="animate-progress w-full h-full bg-violet-500 origin-left-right" />
            )}
        </SeparatorPrimitive.Root>
    )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };