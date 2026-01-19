"use client";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import Link from "next/link";
import { HiCheck, HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { Badge } from "../ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

export interface SelectItem<T extends string | number> {
    icon?: React.ReactNode;
    name: string;
    value: T | null;
    error?: string;
    color?: number;
}

interface Props<T extends string | number> {
    link?: string;
    badge?: string;
    items: SelectItem<T>[];
    showClear?: boolean;
}

export function InputSelect<T extends string | number>({
    className,

    label,
    name, // @deprecated - use label instead
    link,
    badge,
    description,
    disabled,
    items = [],
    showClear,

    endpoint,
    url, // @deprecated - use endpoint instead
    k,
    dataName, // @deprecated - use k instead

    defaultState,
    transform,

    onSave
}: Omit<InputProps<T | null>, "defaultState"> & Props<T> & { defaultState?: T | null; }) {
    const {
        value,
        state,
        error,
        update
    } = useInput({
        endpoint,
        url,
        k,
        dataName,

        defaultState: defaultState ?? null,
        transform,

        onSave
    });

    const selectedItem = items.find((i) => i.value === value);

    const handleSelect = (item: SelectItem<T>) => {
        if (item.error) return; // Don't select items with errors
        update(item.value);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        update(null as T | null);
    };

    const isDisabled = state === InputState.Loading || disabled;

    return (
        <div className={cn("select-none w-full max-w-full relative", description && "mb-2", className)}>
            <div className="flex items-center gap-2 mb-1">
                <span className="sm:text-lg font-medium text-neutral-100">
                    {label || name}
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

            <DropdownMenu>
                <DropdownMenuTrigger
                    className={cn(
                        "h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-lg flex items-center px-3 text-left",
                        "focus:outline-violet-400 focus:outline-2 focus:outline-offset-2",
                        selectedItem?.error && "outline-solid outline-red-500 outline-1",
                        state === InputState.Success && "outline-solid outline-green-500 outline-1",
                        isDisabled && "cursor-not-allowed opacity-50"
                    )}
                    disabled={isDisabled}
                >
                    <div
                        className={cn(
                            "flex items-center flex-wrap overflow-x-hidden gap-2",
                            selectedItem?.name ? "text-neutral-100" : "text-neutral-500"
                        )}
                        style={selectedItem?.color ? { color: `#${selectedItem.color.toString(16)}` } : {}}
                    >
                        {selectedItem?.icon && <span>{selectedItem.icon}</span>}
                        {selectedItem?.name || "Select.."}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {selectedItem?.error && (
                            <div className="text-sm flex items-center gap-1 text-red-500">
                                <HiExclamationCircle /> {selectedItem.error}
                            </div>
                        )}
                        {selectedItem?.name && showClear && (
                            <button
                                onClick={handleClear}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="hover:text-neutral-300"
                            >
                                <HiX />
                            </button>
                        )}
                        <HiChevronDown />
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-40">
                    {items.map((item) => (
                        <DropdownMenuItem
                            key={"select-" + item.value}
                            className={cn(
                                "cursor-pointer",
                                item.error && "dark:bg-red-500/10 dark:hover:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40"
                            )}
                            style={item.color ? { color: `#${item.color.toString(16)}` } : {}}
                            onClick={() => handleSelect(item)}
                            disabled={Boolean(item.error)}
                        >
                            {item.icon && <span className="mr-2">{item.icon}</span>}

                            <span className={cn("truncate", item.error && "max-w-[calc(100%-13rem)]")}>
                                {item.name}
                            </span>

                            {value === item.value && <HiCheck className="ml-auto" />}

                            {item.error && (
                                <div className="ml-auto text-sm flex items-center gap-1 text-red-500">
                                    <HiExclamationCircle /> {item.error}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

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