"use client";

import { cn } from "@/utils/cn";
import { useMemo } from "react";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Props {
    className?: string;
    label?: string;
    placeholder?: string;

    value: string | null;
    setValue: (value: string) => void;

    disabled?: boolean;
    description?: string;
    max?: number;
    multiline?: boolean;
    type?: string;
    thin?: boolean;

    /** For use with JSON state - specifies which key to update */
    dataName?: string;
}

/**
 * A controlled input component without API integration.
 * Use this for local state management in forms/modals.
 */
export function ControlledInput({
    className,
    label,
    placeholder,
    value,
    setValue,
    disabled,
    description,
    max = 256,
    multiline,
    type,
    thin,
    dataName
}: Props) {
    // Get actual value from JSON if dataName is provided
    const actualValue = useMemo(() => {
        if (dataName && typeof value === "string") {
            try {
                return JSON.parse(value)[dataName] ?? "";
            } catch {
                return "";
            }
        }
        return value ?? "";
    }, [dataName, value]);

    const handleChange = (newValue: string) => {
        if (dataName && typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                setValue(JSON.stringify({ ...parsed, [dataName]: newValue || null }));
            } catch {
                setValue(JSON.stringify({ [dataName]: newValue || null }));
            }
        } else {
            setValue(newValue);
        }
    };

    const length = actualValue?.length || 0;
    const showCharCount = type !== "color" && max - 64 < length;
    const nearLimit = max - 8 < length;

    return (
        <div className={cn("relative select-none w-full max-w-full mb-3", className)}>
            {label && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{label}</span>
                </div>
            )}

            {showCharCount && (
                <div className={cn(
                    "ml-auto text-xs absolute top-1 right-2",
                    nearLimit ? "text-red-500" : "text-neutral-500"
                )}>
                    {length}/{max}
                </div>
            )}

            {multiline || max > 300 ? (
                <Textarea
                    className="dark:bg-wamellow bg-wamellow-100 border-none resize-y min-h-28"
                    placeholder={placeholder}
                    value={actualValue}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={disabled}
                    maxLength={max}
                    rows={3}
                />
            ) : (
                <Input
                    className={cn("dark:bg-wamellow bg-wamellow-100 border-none", thin && "h-10")}
                    placeholder={placeholder}
                    value={actualValue}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={disabled}
                    maxLength={max}
                    type={type}
                />
            )}

            {description && (
                <div className="dark:text-neutral-500 text-neutral-400 text-sm mt-1">
                    {description}
                </div>
            )}
        </div>
    );
}