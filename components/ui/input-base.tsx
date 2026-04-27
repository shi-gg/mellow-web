"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Primitive } from "@radix-ui/react-primitive";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { use } from "react";

export type InputBaseContextProps = Pick<
    InputBaseProps,
    "autoFocus" | "disabled"
> & {
    controlRef: React.RefObject<HTMLElement | null>;
    onFocusedChange: (focused: boolean) => void;
};

const InputBaseContext = React.createContext<InputBaseContextProps>({
    autoFocus: false,
    controlRef: { current: null },
    disabled: false,
    onFocusedChange: () => {}
});

function useInputBase() {
    const context = use(InputBaseContext);
    if (!context) {
        throw new Error("useInputBase must be used within a <InputBase />.");
    }

    return context;
}

export interface InputBaseProps
    extends React.ComponentProps<typeof Primitive.div> {
    autoFocus?: boolean;
    disabled?: boolean;
    error?: boolean;
}

function InputBase({
    autoFocus,
    disabled,
    className,
    onClick,
    error,
    ...props
}: InputBaseProps) {
    const [focused, setFocused] = React.useState(false);
    const controlRef = React.useRef<HTMLElement>(null);
    const handleClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (controlRef.current && event.currentTarget === event.target) {
            controlRef.current.focus();
        }
    }, [onClick]);

    return (
        <InputBaseContext
            value={{
                autoFocus,
                controlRef,
                disabled,
                onFocusedChange: setFocused
            }}
        >
            <Primitive.div
                data-slot="input-base"
                onClick={handleClick}
                className={cn(
                    "border-input dark:bg-input/30 flex min-h-9 cursor-text items-center gap-2 rounded-lg border bg-transparent px-3 py-1 text-base shadow-2xs transition-[color,box-shadow] outline-hidden md:text-sm",
                    disabled && "pointer-events-none cursor-not-allowed opacity-50",
                    focused && "border-ring ring-ring/50 ring-[3px]",
                    error &&
                    "ring-destructive/20 dark:ring-destructive/40 border-destructive",
                    className
                )}
                {...props}
            />
        </InputBaseContext>
    );
}

function InputBaseFlexWrapper({
    className,
    ...props
}: React.ComponentProps<typeof Primitive.div>) {
    return (
        <Primitive.div
            data-slot="input-base-flex-wrapper"
            className={cn("flex flex-1 flex-wrap", className)}
            {...props}
        />
    );
}

function InputBaseControl({
    ref,
    onFocus,
    onBlur,
    ...props
}: React.ComponentProps<typeof Slot>) {
    const { controlRef, autoFocus, disabled, onFocusedChange } = useInputBase();

    const composedRefs = useComposedRefs(controlRef, ref);

    return (
        <Slot
            data-slot="input-base-control"
            ref={composedRefs}
            autoFocus={autoFocus}
            onFocus={composeEventHandlers(onFocus, () => onFocusedChange(true))}
            onBlur={composeEventHandlers(onBlur, () => onFocusedChange(false))}
            {...{ disabled }}
            {...props}
        />
    );
}

export interface InputBaseAdornmentProps extends React.ComponentProps<"div"> {
    asChild?: boolean;
}

function InputBaseAdornment({
    className,
    asChild,
    children,
    ...props
}: InputBaseAdornmentProps) {
    const Comp = asChild ? Slot : typeof children === "string" ? "p" : "div";

    return (
        <Comp
            data-slot="input-base-adornment"
            className={cn(
                "text-muted-foreground flex items-center [&_svg:not([class*='size-'])]:size-4",
                "[&:not(:has(button))]:pointer-events-none",
                className
            )}
            {...props}
        >
            {children}
        </Comp>
    );
}

function InputBaseAdornmentButton({
    type = "button",
    variant = "ghost",
    size = "icon",
    disabled: disabledProp,
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { disabled } = useInputBase();

    return (
        <Button
            data-slot="input-base-adornment-button"
            type={type}
            variant={variant}
            size={size}
            disabled={disabled || disabledProp}
            className={cn("size-6", className)}
            {...props}
        />
    );
}

function InputBaseInput({
    className,
    ...props
}: React.ComponentProps<typeof Primitive.input>) {
    return (
        <Primitive.input
            data-slot="input-base-input"
            className={cn(
                "placeholder:text-muted-foreground file:text-foreground w-full flex-1 bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-hidden disabled:pointer-events-none",
                className
            )}
            {...props}
        />
    );
}

function InputBaseTextarea({
    className,
    ...props
}: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="input-base-textarea"
            className={cn(
                "placeholder:text-muted-foreground min-h-16 flex-1 bg-transparent focus:outline-hidden disabled:pointer-events-none",
                className
            )}
            {...props}
        />
    );
}

export {
    InputBase,
    InputBaseAdornment,
    InputBaseAdornmentButton,
    InputBaseControl,
    InputBaseFlexWrapper,
    InputBaseInput,
    InputBaseTextarea,
    useInputBase
};