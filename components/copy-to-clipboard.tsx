"use client";

import { cn } from "@/utils/cn";
import { useRef, useState } from "react";

import { Button } from "./ui/button";

interface Props {
    className?: string;
    icon?: React.ReactNode;
    text: string;
    title?: string;
    needsWait?: boolean;
}

export function CopyToClipboardButton({
    className,
    icon,
    text,
    title
}: Props) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [saved, setSaved] = useState<boolean>(false);

    function handleCopy(t: string) {
        void navigator.clipboard.writeText(t);
        setSaved(true);

        if (timeoutRef.current) clearInterval(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setSaved(false), 1_000 * 2);
    }

    return (
        <Button
            className={cn("w-full justify-start! truncate", className)}
            variant={saved
                ? "secondary"
                : undefined
            }
            onClick={() => handleCopy(text)}
        >
            {icon}
            {saved
                ? "Copied to clipboard"
                : (title || "Copy to clipboard")
            }
        </Button>
    );
}