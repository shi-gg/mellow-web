import { cn } from "@/utils/cn";
import React from "react";
import { HiHashtag, HiVolumeUp } from "react-icons/hi";

interface Props {
    type: "text" | "voice";
    name: string;
    isTruncated?: boolean;
    children?: React.ReactNode;
}

export default function DiscordChannel({
    type,
    name,
    isTruncated,
    children
}: Props) {
    return (
        <div
            className={cn(
                "text-medium text-neutral-400 w-full",
                isTruncated && "max-w-[calc(100%-2rem)]"
            )
            }>
            <span className="flex items-center gap-1">
                {type === "text"
                    ? <HiHashtag />
                    : <HiVolumeUp />
                }
                <span className="w-full truncate">
                    {name}
                </span>
            </span>
            {children && (
                <div className="ml-6 mt-2 flex flex-col gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}