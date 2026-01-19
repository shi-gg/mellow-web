"use client";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import Link from "next/link";
import { TailSpin } from "react-loading-icons";

import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Props {
    link?: string;
    badge?: string;
    max?: number;
    placeholder?: string;
    multiline?: boolean;
    resetState?: string;
}

export default function InputText({
    className,

    label,
    link,
    badge,
    description,
    disabled,
    max = 256,
    placeholder,
    multiline,
    resetState,

    endpoint,
    url, // @deprecated - use endpoint instead
    k,
    dataName, // @deprecated - use k instead

    defaultState,
    transform,

    onSave
}: InputProps<string> & Props) {
    const {
        value,
        state,
        error,
        update,
        reset
    } = useInput({
        endpoint,
        url,
        k,
        dataName,

        defaultState,
        transform,

        onSave,
        debounceMs: 1_000
    });

    const showCharCount = max - 64 < (value?.length || 0);
    const nearLimit = max - 8 < (value?.length || 0);

    return (
        <div className={cn("relative w-full", className)}>
            <div className="flex items-center gap-2 mb-1">
                <span className="sm:text-lg font-medium text-neutral-100">
                    {label}
                </span>

                {badge && (
                    <Badge variant="flat" size="sm">
                        {badge}
                    </Badge>
                )}

                {state === InputState.Loading && (
                    <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />
                )}

                {resetState !== undefined && resetState !== value && (
                    <button
                        className="text-sm ml-auto text-violet-400/60 hover:text-violet-400/90 duration-200"
                        onClick={reset}
                        disabled={disabled}
                    >
                        reset
                    </button>
                )}

                {showCharCount && (
                    <span className={cn(
                        "ml-auto text-xs",
                        nearLimit ? "text-red-500" : "text-neutral-500"
                    )}>
                        {value?.length || 0}/{max}
                    </span>
                )}
            </div>

            {multiline || max > 300 ? (
                <Textarea
                    className="dark:bg-wamellow bg-wamellow-100 border-none resize-y min-h-28"
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length > max) return;
                        update(newValue);
                    }}
                    disabled={disabled}
                    maxLength={max}
                    rows={3}
                />
            ) : (
                <Input
                    className="dark:bg-wamellow bg-wamellow-100 border-none"
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length > max) return;
                        update(newValue);
                    }}
                    disabled={disabled}
                    maxLength={max}
                />
            )}

            <div className="mt-1">
                {description && (
                    <div className="text-neutral-500 text-sm">
                        {description} {link && <Link href={link} target="_blank" className="text-violet-400 hover:underline">Learn more</Link>}
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}