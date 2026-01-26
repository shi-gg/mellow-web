import { cn } from "@/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

import { LoadingCircle } from "../loading-circle";

const buttonVariants = cva(
    "inline-flex justify-center items-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>svg]:size-5",
    {
        variants: {
            variant: {
                default: "bg-wamellow text-primary-foreground hover:bg-wamellow-200",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                success: "bg-green-400 text-neutral-800 hover:bg-green-400/90",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                flat: "bg-secondary/60 text-secondary-foreground hover:bg-secondary/50",
                ghost: "hover:bg-wamellow text-accent-foreground/85 hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                blurple: "bg-blurple text-secondary-foreground hover:bg-blurple/80"
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-4",
                lg: "h-12 px-8",
                icon: "size-10 p-1.5"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, disabled = false, loading = false, icon, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const content = (
            <>
                {loading
                    ? <LoadingCircle />
                    : icon
                }
                {children}
            </>
        );

        if (asChild) {
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    data-disabled={disabled || loading}
                    ref={ref}
                    {...props}
                >
                    {icon
                        ? React.cloneElement(children as React.ReactElement, {}, content)
                        : children
                    }
                </Comp>
            );
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={disabled || loading}
                ref={ref}
                {...props}
            >
                {content}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export interface LinkButtonProps extends Omit<ButtonProps, "asChild"> {
    href: string;
    target?: "_blank";
    prefetch?: false;
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
    ({ children, href, target, prefetch, ...props }, ref) => {
        return (
            <Button
                asChild
                ref={ref}
                {...props}
            >
                <Link
                    href={href}
                    target={target}
                    prefetch={prefetch || true}
                >
                    {children}
                </Link>
            </Button>
        );
    }
);

LinkButton.displayName = "LinkButton";

export { Button, buttonVariants, LinkButton };