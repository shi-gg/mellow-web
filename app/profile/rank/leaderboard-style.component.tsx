"use client";

import { ScreenMessage } from "@/components/screen-message";
import { client } from "@/lib/api";
import { useApi } from "@/lib/api/hook";
import type { ApiV1UsersMeGetResponse } from "@/typings";
import { UserFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function LeaderboardStyle() {
    const { data, isLoading, error, edit } = useApi<ApiV1UsersMeGetResponse>("/users/@me");

    const [err, setErr] = useState<string | null>(null);

    if (isLoading) return null;
    if (!data || error) {
        return <ScreenMessage description={error || "An unknown error occurred."} />;
    }

    const enabled = (data.flags & UserFlags.LeaderboardAlternateStyle) !== 0;

    async function update(alternateLeaderboardStyle: boolean) {
        setErr(null);

        const res = await client.patch<ApiV1UsersMeGetResponse>("/users/@me", {
            flags: transformer(alternateLeaderboardStyle, data!.flags, UserFlags.LeaderboardAlternateStyle)
        });

        if (res.error || !res.data) {
            setErr(res.error || "Failed to update");
            return;
        }

        edit("flags", res.data.flags);
    }

    return (<>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <button
                className="w-full"
                onClick={() => enabled && update(false)}
            >
                <div
                    className={cn(
                        "border-2 duration-200 rounded-md group p-6 mt-1 grid grid-rows-5 grid-cols-2 gap-3",
                        enabled
                            ? "dark:border-neutral-700 hover:border-neutral-500 border-neutral-300 "
                            : "dark:border-violet-400/60 dark:hover:border-violet-400 border-violet-600/60 hover:border-violet-600"
                    )}
                >
                    {Array.from({ length: 10 }, (_, i) =>
                        <div key={`compact-style-${i + 1}`} className="flex gap-2">
                            <div
                                className={cn(
                                    "duration-200 h-6 w-6 aspect-square rounded-full",
                                    enabled
                                        ? "dark:bg-neutral-700/90 dark:group-hover:bg-neutral-400/60 bg-neutral-300/90 group-hover:bg-neutral-600/60"
                                        : "dark:bg-violet-400/50 dark:group-hover:bg-violet-400/70 bg-violet-600/50 group-hover:bg-violet-600/70"
                                )}
                            />
                            <div
                                className={cn(
                                    "duration-200 h-6 rounded-full",
                                    enabled
                                        ? "dark:bg-neutral-700/80 dark:group-hover:bg-neutral-400/50 bg-neutral-300/80 group-hover:bg-neutral-600/50"
                                        : "dark:bg-violet-400/40 dark:group-hover:bg-violet-400/60 bg-violet-600/40 group-hover:bg-violet-600/60"
                                )}
                                style={{ width: `${30 + ((i % 1.7) + (i % 3) + (i % 2)) * 10}%` }}
                            />
                        </div>
                    )}
                </div>
            </button>

            <button
                className="w-full"
                onClick={() => !enabled && update(true)}
            >
                <div
                    className={cn(
                        "border-2 duration-200 rounded-md p-4 mt-1 flex flex-col gap-2 group",
                        enabled
                            ? "dark:border-violet-400/60 dark:hover:border-violet-400 border-violet-600/60 hover:border-violet-600"
                            : "dark:border-neutral-700 hover:border-neutral-500 border-neutral-300 "
                    )}
                >
                    {Array.from({ length: 8 }, (_, i) =>
                        <div key={`alternate-style-${i + 1}`} className="flex gap-2">
                            <div
                                className={cn(
                                    "duration-200 h-4 w-4 aspect-square rounded-full",
                                    enabled
                                        ? "dark:bg-violet-400/50 dark:group-hover:bg-violet-400/70 bg-violet-600/50 group-hover:bg-violet-600/70"
                                        : "dark:bg-neutral-700/90 dark:group-hover:bg-neutral-400/60 bg-neutral-300/90 group-hover:bg-neutral-600/60"
                                )}
                            />
                            <div
                                className={cn(
                                    "duration-200 h-4 rounded-full",
                                    enabled
                                        ? "dark:bg-violet-400/40 dark:group-hover:bg-violet-400/60 bg-violet-600/40 group-hover:bg-violet-600/60"
                                        : "dark:bg-neutral-700/80 dark:group-hover:bg-neutral-400/50 bg-neutral-300/80 group-hover:bg-neutral-600/50"
                                )}
                                style={{ width: `${30 + ((i % 1.7) + (i % 3) + (i % 2)) * 10}%` }}
                            />
                        </div>
                    )}
                </div>
            </button>

        </div>

        <div className="flex">
            {err && (
                <div className="ml-auto text-red-500 text-sm">
                    {err}
                </div>
            )}
        </div>
    </>);
}