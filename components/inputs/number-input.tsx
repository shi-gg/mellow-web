"use client";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
    link?: string;
    badge?: string;
    min?: number;
    max?: number;
}

export default function InputNumber({
    className,

    label,
    link,
    badge,
    description,
    disabled,

    min = 0,
    max = Infinity,

    endpoint,
    url, // @deprecated - use endpoint instead
    k,
    dataName, // @deprecated - use k instead

    defaultState,
    transform,

    onSave
}: InputProps<number> & Props) {
    const {
        value,
        state,
        error,
        isDirty,
        update,
        save
    } = useInput({
        endpoint,
        url,
        k,
        dataName,

        defaultState,
        transform,

        onSave,
        manual: true // Require explicit save
    });

    const [hold, setHold] = useState<"+" | "-">();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!hold) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const start = Date.now();
        intervalRef.current = setInterval(() => {
            if (Date.now() - start < 200) return;

            if (hold === "+") {
                update(Math.min((value ?? 0) + 1, max));
            } else {
                update(Math.max((value ?? 0) - 1, min));
            }
        }, 50);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [hold, value, min, max, update]);

    const increment = () => {
        if ((value ?? 0) + 1 > max) update(max);
        else update((value ?? 0) + 1);
    };

    const decrement = () => {
        if ((value ?? 0) - 1 < min) update(min);
        else update((value ?? 0) - 1);
    };

    const isDisabled = state === InputState.Loading || disabled;

    return (
        <div className={cn("relative", description && "mb-6", className)}>
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
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
                </div>

                <div className={cn(
                    "flex items-center",
                    isDisabled && "opacity-50"
                )}>
                    {isDirty && (
                        <Button
                            onClick={() => save()}
                            className="h-8 rounded-lg mr-2"
                            loading={state === InputState.Loading}
                            disabled={disabled}
                            size="sm"
                            color="secondary"
                            variant="flat"
                        >
                            Save
                        </Button>
                    )}

                    <button
                        onMouseDown={() => setHold("-")}
                        onMouseUp={() => setHold(undefined)}
                        onMouseLeave={() => setHold(undefined)}
                        onClick={decrement}
                        className={cn(
                            "dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-8 w-12 rounded-l-lg duration-100",
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                        disabled={isDisabled}
                    >
                        <HiMinus className="m-auto text-xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
                    </button>

                    <Input
                        className={cn(
                            "text-center w-14 h-8 dark:bg-wamellow bg-wamellow-100 font-semibold text-lg text-neutral-500 rounded-none border-none px-0",
                            isDisabled ? "cursor-not-allowed" : "cursor-text"
                        )}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                                update(val ? Number.parseInt(val, 10) : min);
                            }
                        }}
                        value={value ?? 0}
                        disabled={isDisabled}
                        inputMode="numeric"
                    />

                    <button
                        onMouseDown={() => setHold("+")}
                        onMouseUp={() => setHold(undefined)}
                        onMouseLeave={() => setHold(undefined)}
                        onClick={increment}
                        className={cn(
                            "dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-8 w-12 rounded-r-lg duration-100",
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                        disabled={isDisabled}
                    >
                        <HiPlus className="m-auto text-xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
                    </button>
                </div>
            </div>

            <div className="absolute top-6 mt-0.5">
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