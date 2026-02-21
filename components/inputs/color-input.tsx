"use client";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { TailSpin } from "react-loading-icons";

import { Badge } from "../ui/badge";

interface Props {
    link?: string;
    badge?: string;
    resetState?: number;
    placeholder?: string;
}

export function InputColor({
    className,

    label,
    link,
    badge,
    description,
    disabled,
    resetState,
    placeholder,

    endpoint,
    k,

    defaultState,
    transform,

    onSave
}: InputProps<number> & Props) {
    const {
        value,
        state,
        error,
        update,
        reset
    } = useInput({
        endpoint,
        k,

        defaultState,
        transform: transform ?? ((v) => v || 0x00_00_00),

        onSave,
        debounceMs: 1_000
    });

    const inputId = useId();
    const [isHovered, setIsHovered] = useState(false);

    const colorHex = value ? `#${value.toString(16).padStart(6, "0")}` : "#ffffff";

    const isDisabled = state === InputState.Loading || disabled;

    return (
        <div className={cn("relative w-full", description && "mb-2", className)}>
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
            </div>

            {/* Hidden color input */}
            <input
                className="absolute -bottom-2 left-0 w-0 h-0 opacity-0 pointer-events-none"
                id={inputId}
                placeholder={placeholder}
                onChange={(e) => {
                    const color = Number.parseInt(e.target.value.slice(1), 16);
                    update(color || 0);
                }}
                value={colorHex}
                disabled={isDisabled}
                type="color"
            />

            {/* Color display label */}
            <label
                htmlFor={inputId}
                className={cn(
                    "block w-full h-12 rounded-lg cursor-pointer relative overflow-hidden",
                    "focus-within:outline-violet-400 focus-within:outline-2 focus-within:outline-offset-2",
                    isDisabled && "cursor-not-allowed opacity-50"
                )}
                style={{ backgroundColor: colorHex }}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <AnimatePresence initial={false} mode="wait">
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        >
                            <AiOutlineEdit className="w-6 h-6 text-white/80" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </label>

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