import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface Props {
    name?: string;
    placeholder?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: React.Dispatch<React.SetStateAction<any>>;

    disabled?: boolean;
    description?: string;
    thin?: boolean;

    dataName?: string;
}

export default function DumbColorInput({
    name,
    placeholder,
    value,
    setValue,
    disabled,
    description,
    thin,
    dataName
}: Props) {
    const className = cn(
        "mt-1 resize-none w-full dark:bg-wamellow bg-wamellow-100 rounded-lg flex items-center px-4 py-2 focus:outline-solid outline-violet-400 outline-2",
        thin ? "h-10" : "h-12",
        thin && "relative bottom-1",
        disabled && "cursor-not-allowed opacity-50"
    );

    // this cuz there can be multiple color inputs on the same page, so it will bug, so we need to identify them
    const [inputId] = useState<string>(() => Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15));

    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div className="relative select-none w-full max-w-full mb-3">
            {name &&
                <div className="flex items-center gap-2">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                </div>
            }

            <input
                className="absolute -bottom-2 left-0 w-0 h-0 opacity-0 pointer-events-none"
                id={inputId}
                placeholder={placeholder}
                onChange={(e) => {
                    if (dataName) {
                        setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: Number.parseInt(e.target.value.slice(1), 16) })));
                    } else {
                        setValue(Number.parseInt(e.target.value.slice(1), 16));
                    }
                }}
                value={(dataName ? JSON.parse(value)[dataName] : value) ? `#${(dataName ? JSON.parse(value)[dataName] : value)?.toString(16)}` : "#ffffff"}
                disabled={disabled}
                type={"color"}
            />

            <label
                htmlFor={inputId}
                className={className}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
                style={{
                    backgroundColor: (dataName ? JSON.parse(value)[dataName] : value) ? `#${(dataName ? JSON.parse(value)[dataName] : value)?.toString(16)}` : "#ffffff"
                }}
            >
                <AnimatePresence initial={false} mode="wait">
                    {isHovered && <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.15,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 left-0 w-full h-full bg-wamellow-900-alpha rounded-md pointer-events-none flex items-center justify-center">
                        <AiOutlineEdit className="w-6 h-6 text-[rgba(255,255,255,0.8)]" />
                    </motion.div>
                    }
                </AnimatePresence>
            </label>

            {description &&
                <div className="dark:text-neutral-500 text-neutral-400 text-sm mt-1">
                    {description}
                </div>
            }

        </div>
    );
}