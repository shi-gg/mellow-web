"use client";

import { Badge } from "@/components/ui/badge";
import { useSyncExternalStore } from "react";
import { HiFire } from "react-icons/hi";

export function NsfwBanner() {
    const isEmbedded = useSyncExternalStore(
        () => () => {},
        () => window.self !== window.top,
        () => false
    );

    if (isEmbedded) return null;

    return (
        <div className="p-4 pb-3 border border-divider rounded-lg my-8">
            <Badge
                className="mb-2"
                variant="flat"
                radius="rounded"
            >
                <HiFire />
                Supports NSFW
            </Badge>
            <div className="text-base">
                Find spicy nekos, waifus, and more in nsfw marked channels.
            </div>
        </div>
    );
}