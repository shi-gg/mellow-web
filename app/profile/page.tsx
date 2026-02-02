"use client";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { ControlledInput } from "@/components/inputs/controlled-input";
import { ScreenMessage } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/api/hook";
import type { ApiV1UsersMeGuildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { HiChartBar, HiRefresh, HiUserAdd, HiViewGridAdd } from "react-icons/hi";

const MAX_GUILDS = 20 as const;

const springAnimation: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            type: "spring",
            bounce: 0.6,
            duration: 0.8
        }
    })
};

export default function Home() {
    const [search, setSearch] = useState<string>("");
    const [time] = useState<number>(() => Date.now());

    const { isLoading, data, error, dataUpdatedAt } = useApi<ApiV1UsersMeGuildsGetResponse[]>("/users/@me/guilds");

    const guilds = useMemo(
        () => Array.isArray(data) ? data.sort(sort).filter((guild) => filter(guild, search)).slice(0, MAX_GUILDS) : [],
        [data, search]
    );

    const size = Array.isArray(data) ? data.length : 0;
    const isHuge = size > MAX_GUILDS;

    if (error) {
        return (
            <ScreenMessage
                top="10rem"
                description={`${error}`}
            />
        );
    }

    return (<div className="flex flex-col w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
            <ControlledInput
                autoFocus
                thin
                value={search}
                setValue={setSearch}
                placeholder="Search by name or id"
            />

            <div className="flex gap-2 md:mt-0">
                <Button
                    asChild
                    className="w-1/2 md:w-min"
                >
                    <Link
                        href="/login?invite=true"
                        prefetch={false}
                    >
                        <HiUserAdd />
                        Add to Server
                    </Link>
                </Button>
                <Button
                    asChild
                    className="w-1/2 md:w-min"
                    variant="secondary"
                >
                    <Link
                        href="/login"
                        prefetch={false}
                    >
                        <HiRefresh />
                        Reload
                    </Link>
                </Button>
            </div>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 gap-3.5 w-full mt-3 lg:grid-cols-3 md:grid-cols-2">
                {Array.from({ length: 1 }).map((_, i) => (
                    <Skeleton key={i} className="h-22 rounded-xl" style={{ opacity: Math.min(1 / i, 1) }} />
                ))}
            </div>
        ) : (
            <ul className="grid grid-cols-1 gap-3.5 w-full mt-3 lg:grid-cols-3 md:grid-cols-2">
                {guilds.map((guild, index) => (
                    <Guild
                        key={"guild-" + guild.id}
                        {...guild}
                        lazy={isHuge}
                        index={index}
                        animate={(dataUpdatedAt + 1_000) > time}
                    />
                ))
                }
            </ul>
        )}

        {isHuge && (
            <ScreenMessage
                top="5rem"
                title="There are too many servers.."
                description={`To save some performance, use the search to find a guild. Showing ${MAX_GUILDS} out of ~${size < 1_000 ? size : Math.round(size / 1_000) * 1_000}.`}
            />
        )}
    </div >);
}

function sort(a: ApiV1UsersMeGuildsGetResponse, b: ApiV1UsersMeGuildsGetResponse) {
    return a.bot === b.bot
        ? 0
        : (a.bot ? -1 : 1);
}

function filter(guild: ApiV1UsersMeGuildsGetResponse, search: string) {
    if (!search) return true;

    if (guild.name?.toLowerCase().includes(search.toLowerCase())) return true;
    if (search.toLowerCase().includes(guild.name?.toLowerCase())) return true;

    if (guild.id.includes(search)) return true;
    if (search.includes(guild.id)) return true;

    return false;
}

function Guild({
    id,
    name,
    icon,
    bot: hasBotInvited,
    lazy,
    index,
    animate
}: ApiV1UsersMeGuildsGetResponse & { lazy: boolean; index: number; animate: boolean; }) {
    return (
        <motion.li
            custom={index}
            initial={animate ? "hidden" : "visible"}
            animate="visible"
            className={cn(
                "dark:bg-wamellow bg-wamellow-100 p-3.5 flex items-center rounded-xl drop-shadow-md overflow-hidden relative outline-violet-500 hover:outline-solid group/card opacity-0",
                !hasBotInvited && "saturate-50 brightness-50"
            )}
            variants={springAnimation}
        >
            <ImageReduceMotion
                alt=""
                className="absolute -top-12 left-0 w-full z-0 blur-xl opacity-30 pointer-events-none"
                size={16}
                url={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                forceStatic
                lazy={lazy}
            />

            <ImageReduceMotion
                alt={`Server icon of @${name}`}
                className="rounded-lg size-15 z-1 relative drop-shadow-md"
                size={56}
                url={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                lazy={lazy}
            />

            <div className="ml-3 text-sm relative bottom-0.5">
                <span className="text-lg dark:text-neutral-200 font-medium text-neutral-800 mb-1 sm:max-w-64 lg:max-w-56 truncate">
                    {name}
                </span>
                <div className="flex gap-1">
                    {hasBotInvited
                        ? <ManageButton guildId={id} />
                        : <InviteButton guildId={id} />
                    }
                    {hasBotInvited && <LeaderboardButton guildId={id} />}
                </div>
            </div>

        </motion.li>
    );
}

function InviteButton({ guildId }: { guildId: string; }) {
    return (
        <Button
            asChild
            className="h-8"
        >
            <Link
                href={`/login?invite=true&guild_id=${guildId}`}
                prefetch={false}
            >
                <HiUserAdd />
                Add Wamellow
            </Link>
        </Button>
    );
}

function ManageButton({ guildId }: { guildId: string; }) {
    const searchParams = useSearchParams();
    const to = searchParams.get("to");

    return (
        <Button
            asChild
            className="h-8"
        >
            <Link
                href={`/dashboard/${guildId}${to ? `/${to}` : ""}`}
                prefetch={false}
            >
                <HiViewGridAdd />
                Manage
            </Link>
        </Button>
    );
}

function LeaderboardButton({ guildId }: { guildId: string; }) {
    return (
        <Button
            asChild
            className="h-8"
        >
            <Link
                href={`/leaderboard/${guildId}`}
                prefetch={false}
            >
                <HiChartBar />
                Leaderboard
            </Link>
        </Button>
    );
}