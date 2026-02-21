"use client";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { Badge } from "../ui/badge";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

export interface MultiSelectItem<T extends string | number> {
    icon?: React.ReactNode;
    name: string;
    value: T;
    error?: string;
    color?: number;
}

interface Props<T extends string | number> {
    link?: string;
    badge?: string;
    items: MultiSelectItem<T>[];
    max?: number;
}

export function InputMultiSelect<T extends string | number>({
    className,

    label,
    name,
    link,
    badge,
    description,
    disabled,
    items = [],
    max = Infinity,

    endpoint,
    k,

    defaultState,
    transform,

    onSave
}: InputProps<T[]> & Props<T>) {
    const {
        value,
        state,
        error,
        isDirty,
        update,
        save
    } = useInput({
        endpoint,
        k,

        defaultState,
        transform,

        onSave,
        manual: true,
        isEqual: (a, b) => {
            if (a === b) return true;
            if (a.length !== b.length) return false;
            const setA = new Set(a);
            return b.every((v) => setA.has(v));
        }
    });

    const [open, setOpen] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const valueRef = useRef(value);

    // Keep valueRef in sync
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    // Debounce save after 5 seconds of inactivity while menu is open
    const debouncedSave = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            save();
        }, 5_000);
    }, [save]);

    // Clear debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const selectedItems = items.filter((i) => value.includes(i.value));

    const handleToggle = (item: MultiSelectItem<T>) => {
        if (item.error) return;

        const isSelected = value.includes(item.value);

        if (isSelected) {
            update(value.filter((v) => v !== item.value));
        } else if (value.length < max) {
            update([...value, item.value]);
        }

        // Trigger debounced save
        debouncedSave();
    };

    const handleRemove = (e: React.PointerEvent, itemValue: T) => {
        // Prevent the dropdown from opening
        e.preventDefault();
        e.stopPropagation();
        const newValue = value.filter((v) => v !== itemValue);
        update(newValue);
        save(newValue);
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (!isOpen) {
            // Menu closed - save and clear any pending debounce
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }

            if (isDirty) {
                save();
            }
        }
    };

    const isDisabled = state === InputState.Loading || disabled;
    const hasErrors = selectedItems.some((v) => Boolean(v.error));

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

            <DropdownMenu open={open} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger
                    className={cn(
                        "min-h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-lg flex items-center px-3 text-left",
                        "focus:outline-violet-400 focus:outline-2 focus:outline-offset-2",
                        hasErrors && "outline-solid outline-red-500 outline-1",
                        state === InputState.Success && "outline-solid outline-green-500 outline-1",
                        isDisabled && "cursor-not-allowed opacity-50"
                    )}
                    disabled={isDisabled}
                >
                    <div
                        className={cn(
                            "flex flex-wrap overflow-x-hidden gap-1 py-2",
                            selectedItems.length ? "text-neutral-100" : "text-neutral-500"
                        )}
                    >
                        {!selectedItems.length && <span>Select..</span>}
                        {selectedItems.map((item) => (
                            <button
                                key={"multiselected-" + item.value}
                                className={cn(
                                    "relative px-2 py-0.5 bg-wamellow rounded-md flex items-center gap-1",
                                    "hover:bg-red-500/50 text-neutral-100 duration-200 group"
                                )}
                                onPointerDown={(e) => handleRemove(e, item.value)}
                            >
                                {item.icon && <span className="group-hover:hidden">{item.icon}</span>}
                                <HiX className="size-4 hidden group-hover:block" />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {hasErrors && (
                            <div className="text-sm flex items-center gap-1 text-red-500">
                                <HiExclamationCircle /> {selectedItems.find((v) => v.error)?.error}
                            </div>
                        )}
                        {max !== Infinity && (
                            <span className="text-neutral-500">
                                {value.length}/{max}
                            </span>
                        )}
                        <HiChevronDown />
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-40">
                    {items.map((item) => (
                        <DropdownMenuCheckboxItem
                            key={"multiselect-" + item.value}
                            className={cn(
                                "cursor-pointer",
                                item.error && "dark:bg-red-500/10 dark:hover:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40"
                            )}
                            style={item.color ? { color: `#${item.color.toString(16)}` } : {}}
                            checked={value.includes(item.value)}
                            onCheckedChange={() => handleToggle(item)}
                            onSelect={(e) => e.preventDefault()} // Prevent menu from closing
                            disabled={Boolean(item.error) || (!value.includes(item.value) && value.length >= max)}
                        >
                            {item.icon && <span className="mr-2">{item.icon}</span>}

                            <span className="max-w-[calc(100%-1rem)] truncate">
                                {item.name}
                            </span>

                            {item.error && (
                                <div className="ml-auto text-sm flex items-center gap-1 text-red-500">
                                    <HiExclamationCircle /> {item.error}
                                </div>
                            )}
                        </DropdownMenuCheckboxItem>
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