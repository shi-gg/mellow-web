"use client";

import { guildStore } from "@/common/guilds";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { ScreenMessage, SupportButton } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheOptions, getData } from "@/lib/api";
import type { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse } from "@/typings";
import { intl } from "@/utils/numbers";
import Head from "next/head";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Suspense, useEffect, useMemo, useState } from "react";
import { HiBell, HiChartBar, HiChevronLeft, HiCode, HiEye, HiHome, HiPaperAirplane, HiStar, HiUserAdd, HiUsers, HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

function useGuildData<T extends unknown[]>(
    url: string,
    guildId: string | string[] | undefined,
    onLoad: (data: T, error: boolean) => void
) {
    return useQuery(
        url,
        () => getData<T>(url),
        {
            enabled: Boolean(guildId),
            onSettled: (data) => {
                const isError = !data || "message" in data;
                onLoad(isError ? [] as unknown as T : data, isError);
            },
            ...cacheOptions
        }
    );
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const cookies = useCookies();
    const params = useParams();

    const [loaded, setLoaded] = useState<string[]>([]);

    const guildId = guildStore((g) => g?.id);
    const guildName = guildStore((g) => g?.name);
    const guildIcon = guildStore((g) => g?.icon);
    const guildMemberCount = guildStore((g) => g?.memberCount);

    const session = useMemo(() => cookies.get("session"), [cookies]);

    if (!session) redirect(`/login?callback=/dashboard/${params.guildId}`);

    const url = `/guilds/${params.guildId}` as const;

    const { data, isLoading } = useQuery(
        url,
        () => getData<ApiV1GuildsGetResponse>(url),
        {
            enabled: Boolean(params.guildId),
            ...cacheOptions,
            refetchOnMount: true
        }
    );

    useGuildData<ApiV1GuildsChannelsGetResponse[]>(
        `${url}/channels`,
        params.guildId,
        (data) => {
            guildStore.setState((state) => ({ ...state, channels: data }));
            setLoaded((loaded) => [...loaded, "channels"]);
        }
    );

    useGuildData<ApiV1GuildsRolesGetResponse[]>(
        `${url}/roles`,
        params.guildId,
        (data) => {
            guildStore.setState((state) => ({ ...state, roles: data }));
            setLoaded((loaded) => [...loaded, "roles"]);
        }
    );

    useGuildData<ApiV1GuildsEmojisGetResponse[]>(
        `${url}/emojis`,
        params.guildId,
        (data) => {
            guildStore.setState((state) => ({ ...state, emojis: data }));
            setLoaded((loaded) => [...loaded, "emojis"]);
        }
    );

    const error = data && "message" in data ? data.message : undefined;

    useEffect(() => {
        if (!data || "message" in data) return;
        guildStore.setState((state) => ({ ...state, ...data }));
    }, [data]);

    return (
        <div className="flex flex-col w-full">
            {guildName && (
                <Head>
                    <title>{guildName}{"'"}s Dashboard</title>
                </Head>
            )}

            <div className="flex flex-col gap-3 mb-3">
                <Button
                    asChild
                    variant="ghost"
                    className="w-fit pl-0 group"
                >
                    <Link href="/profile">
                        <HiChevronLeft className="mt-0.5 group-hover:translate-x-1 duration-200" />
                        Serverlist
                    </Link>
                </Button>

                <div className="text-lg flex gap-5">
                    <Skeleton
                        isLoading={!guildId}
                        className="rounded-xl size-14 ring-offset-(--background-rgb) ring-2 ring-offset-2 ring-violet-400/40 shrink-0 relative top-1 left-1"
                    >
                        <ImageReduceMotion
                            alt="this server's icon"
                            className="rounded-xl"
                            url={`https://cdn.discordapp.com/icons/${guildId}/${guildIcon}`}
                            size={128}
                        />
                    </Skeleton>

                    {isLoading ?
                        <div className="mt-1.5">
                            <Skeleton className="rounded-xl w-32 h-6 mb-2" />
                            <Skeleton className="rounded-xl w-10 h-3.5" />
                        </div>
                        :
                        <div className="flex flex-col mt-[6px]">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guildName || "Unknown Server"}</div>
                            <div className="text-xs font-semibold flex items-center gap-1">  <HiUsers /> {intl.format(guildMemberCount || 0)}</div>
                        </div>
                    }
                </div>
            </div>

            <Suspense>
                <ListTab
                    tabs={[
                        {
                            name: "Overview",
                            value: "/",
                            icon: <HiHome />
                        },
                        {
                            name: "Leaderboards",
                            value: "/leaderboards",
                            icon: <HiChartBar />
                        },
                        {
                            name: "Greetings",
                            value: "/greeting",
                            icon: <HiUserAdd />
                        },
                        {
                            name: "Starboard",
                            value: "/starboard",
                            icon: <HiStar />
                        },
                        {
                            name: "Notifications",
                            value: "/notifications",
                            icon: <HiBell />
                        },
                        {
                            name: "Dailyposts",
                            value: "/dailyposts",
                            icon: <HiPaperAirplane className="rotate-45" />
                        },
                        {
                            name: "Moderation",
                            value: "/moderation",
                            icon: <HiEye />
                        },
                        {
                            name: "Custom Commands",
                            value: "/custom-commands",
                            icon: <HiCode />
                        }
                    ]}
                    url={`/dashboard/${params.guildId}`}
                    disabled={!guildId || Boolean(error)}
                />
            </Suspense>

            {error ?
                <ScreenMessage
                    title={error.includes("permssions")
                        ? "You cannot access this page.."
                        : undefined
                    }
                    description={error}
                    buttons={<>
                        <Button
                            asChild
                            variant="secondary"
                        >
                            <Link href="/profile">
                                <HiViewGridAdd />
                                Go back to Dashboard
                            </Link>
                        </Button>
                        <SupportButton />
                    </>}
                />
                :
                (guildId && loaded.length === 3) ? children : <></>
            }

        </div>
    );
}