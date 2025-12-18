import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateString, getTimeAgo } from "@/utils/time";
import { actor, getVoices } from "@/utils/tts";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
    HiDownload,
    HiPencil, HiPlay, HiSpeakerphone
} from "react-icons/hi";
import { HiTrash } from "react-icons/hi2";

import { type HistoryItem, State } from "./use-history";

const springAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.7
        }
    }
} as const;

export function History({
    history,
    error,
    state,
    ensureUrl,
    fallbackVoice,
    onPlay,
    onRefill,
    onDelete
}: {
    history: HistoryItem[];
    error: string | null;
    state: State;
    ensureUrl: (item: HistoryItem) => string;
    fallbackVoice: string;
    onPlay: (url: string) => void;
    onRefill: (text: string, voice: string) => void;
    onDelete: (id: number) => void;
}) {
    const [hasAnimated, setHasAnimated] = useState(false);
    const isLoading = state === State.Loading;
    const shouldAnimate = !hasAnimated && !isLoading && history.length > 0;

    useEffect(() => {
        if (hasAnimated || isLoading) return;
        if (history.length) {
            queueMicrotask(() => setHasAnimated(true));
        }
    }, [hasAnimated, history.length, isLoading]);

    if (error) {
        return <div className="text-sm text-red-400">{error}</div>;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-lg" style={{ opacity: 1 / (i * 2) }} />
                ))}
            </div>
        );
    }

    if (!history.length) {
        return (
            <div className="rounded-lg bg-wamellow px-4 py-6 text-sm text-neutral-400">
                Generated clips will show up here for quick replays.
            </div>
        );
    }

    return (
        <ScrollArea className="h-full lg:h-200 xl:h-[calc(100vh-37rem)]">
            <motion.div
                variants={{
                    hidden: { opacity: 1, scale: 0 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            delayChildren: 0.3,
                            staggerChildren: 0.2
                        }
                    }
                }}
                initial={shouldAnimate ? "hidden" : false}
                animate={shouldAnimate ? "visible" : false}
                className="flex flex-col gap-3"
            >
                {history.map((item) => (
                    <HistoryItem
                        key={item.id}
                        item={item}
                        fallbackVoice={fallbackVoice}
                        onPlay={onPlay}
                        onRefill={onRefill}
                        onDelete={onDelete}
                        ensureUrl={ensureUrl}
                    />
                ))}
            </motion.div>
        </ScrollArea>
    );
}

function HistoryItem({
    item,
    fallbackVoice,
    onPlay,
    onRefill,
    onDelete,
    ensureUrl
}: {
    item: HistoryItem;
    fallbackVoice: string;
    onPlay: (url: string) => void;
    onRefill: (text: string, voice: string) => void;
    onDelete: (id: number) => void;
    ensureUrl: (item: HistoryItem) => string;
}) {
    const createdAt = new Date(item.createdAt);

    return (
        <motion.div
            className="flex flex-col gap-2 bg-wamellow p-4 rounded-lg"
            variants={springAnimation}
        >
            <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-white/10 text-white">
                    <HiSpeakerphone className="mr-1 inline-block" />
                    {actor[item.voice]
                        ? getVoices(item.voice)[0]
                        : "Voice"}
                </Badge>
                <span className="text-xs text-neutral-400 ml-auto">
                    {createdAt.getDate() === new Date().getDate() && createdAt.getMonth() === new Date().getMonth() && createdAt.getFullYear() === new Date().getFullYear()
                        ? getTimeAgo(createdAt)
                        : getDateString(createdAt, "f")
                    }
                </span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-neutral-200">{item.text}</p>
            <div className="mt-3 flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onPlay(ensureUrl(item))}
                >
                    <HiPlay className="mr-1" /> Play
                </Button>
                <Button
                    size="sm"
                    onClick={() => {
                        const normalizedVoice = actor[item.voice] ? item.voice : fallbackVoice;
                        onRefill(item.text, normalizedVoice);
                    }}
                >
                    <HiPencil className="mr-1" /> Edit
                </Button>
                <Button
                    className="p-4.5"
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(item.id)}
                >
                    <HiTrash />
                </Button>
                <Button
                    className="p-4.5"
                    size="icon"
                    variant="ghost"
                    asChild
                >
                    <a href={ensureUrl(item)} download>
                        <HiDownload />
                    </a>
                </Button>
            </div>
        </motion.div>
    );
}