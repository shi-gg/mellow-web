"use client";

import "./gradient-button.css";
import { cn } from "@/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const gradientButtonVariants = cva(
    [
        "gradient-button",
        "inline-flex items-center justify-center",
        "rounded-[11px] px-9 py-4",
        "text-base leading-5 font-medium text-white",
        "font-sans font-bold",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50"
    ],
    {
        variants: {
            variant: {
                default: "",
                variant: "gradient-button-variant"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

export interface GradientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
    asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(gradientButtonVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };