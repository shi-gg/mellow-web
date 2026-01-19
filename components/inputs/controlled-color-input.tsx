"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface Props {
    className?: string;
    label?: string;
    placeholder?: string;

    value: string | number;
    setValue: (value: string) => void;

    disabled?: boolean;
    description?: string;

    dataName?: string;
}

export function ControlledColorInput({
    className,
    label,
    value,
    setValue,
    disabled,
    description,
    dataName
}: Props) {
    const inputId = useId();
    const [isHovered, setIsHovered] = useState(false);

    const actualValue = useMemo(() => {
        if (dataName) {
            if (typeof value !== "string") {
                console.warn("ControlledColorInput: dataName is set but value is not a string");
                return 0;
            }
            try {
                return JSON.parse(value)[dataName] ?? 0;
            } catch {
                return 0;
            }
        }
        return typeof value === "number" ? value : 0;
    }, [dataName, value]);

    const colorHex = actualValue ? `#${actualValue.toString(16).padStart(6, "0")}` : "#ffffff";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = Number.parseInt(e.target.value.slice(1), 16);

        if (dataName && typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                setValue(JSON.stringify({ ...parsed, [dataName]: color }));
            } catch {
                setValue(JSON.stringify({ [dataName]: color }));
            }
        } else {
            setValue(String(color));
        }
    };

    return (
        <div className={cn("relative select-none w-full max-w-full mb-3", className)}>
            {label && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{label}</span>
                </div>
            )}

            <input
                className="absolute -bottom-2 left-0 w-0 h-0 opacity-0 pointer-events-none"
                id={inputId}
                onChange={handleChange}
                value={colorHex}
                disabled={disabled}
                type="color"
            />

            <label
                htmlFor={inputId}
                className={cn(
                    "block w-full h-12 rounded-lg cursor-pointer relative overflow-hidden",
                    "focus-within:outline-violet-400 focus-within:outline-2 focus-within:outline-offset-2",
                    disabled && "cursor-not-allowed opacity-50"
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

            {description && (
                <div className="dark:text-neutral-500 text-neutral-400 text-sm mt-1">
                    {description}
                </div>
            )}
        </div>
    );
}