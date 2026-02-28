"use client";

import { useWindow } from "@/common/window";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { editApiCache, useApi } from "@/lib/api/hook";
import type { ApiV1GuildsGetResponse, ApiV1UsersMeBillingGetResponse } from "@/typings";
import { GuildFlags } from "@/typings";
import { isActive, MAX_PREMIUM_GUILDS } from "@/utils/premium";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiLightningBolt } from "react-icons/hi";
import { useQueryClient } from "react-query";

const WIDTH_THRESHOLD = 768;

export function PremiumReminder({ guild }: { guild: ApiV1GuildsGetResponse; }) {
    const params = useParams();
    const { width } = useWindow();

    const queryClient = useQueryClient();
    const { data, edit } = useApi<ApiV1UsersMeBillingGetResponse>("/users/@me/billing?with_portal_url=false");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasPremium = data && isActive(data.status);
    const hasGuildActivated = data?.guildIds?.includes(guild.id);
    const isMaxPremiumGuildsReached = (data?.guildIds?.length || 0) >= MAX_PREMIUM_GUILDS;
    const showReminder = hasPremium && !hasGuildActivated && !isMaxPremiumGuildsReached;

    if (!showReminder) return null;

    const handleEnable = async () => {
        setIsLoading(true);
        setError(null);

        const newGuildIds = [...data.guildIds, guild.id];

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/billing/premium-guilds`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guildIds: newGuildIds })
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.message || "Failed to enable premium");
            setIsLoading(false);
            return;
        }

        edit("guildIds", newGuildIds);
        editApiCache<ApiV1GuildsGetResponse>(queryClient, `/guilds/${params.guildId}`)("flags", guild.flags | GuildFlags.Premium);
        editApiCache<ApiV1UsersMeBillingGetResponse>(queryClient, "/users/@me/billing?with_portal_url=true")("guildIds", newGuildIds);
        setIsLoading(false);
    };

    return (
        <Alert className="my-2">
            <HiLightningBolt className="size-4" />
            <AlertTitle>Premium not active</AlertTitle>
            <AlertDescription>
                <p>
                    {error || "You have premium but haven't activated it on any server yet. Enable it to access server-specific features."}
                </p>

                {width < WIDTH_THRESHOLD && (
                    <Button className="w-full" variant="default" onClick={handleEnable} loading={isLoading}>
                        Enable for this server
                    </Button>
                )}
            </AlertDescription>
            {width >= WIDTH_THRESHOLD && (
                <AlertAction>
                    <Button size="sm" variant="default" onClick={handleEnable} loading={isLoading}>
                        Enable for this server
                    </Button>
                </AlertAction>
            )}
        </Alert>
    );
}