import type { Guild } from "@/common/guilds";
import Notice from "@/components/notice";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheOptions } from "@/lib/api";
import { cn } from "@/utils/cn";
import type { RESTError, RESTGetAPIGuildWidgetJSONResult } from "discord-api-types/v10";
import { useState } from "react";
import { HiEmojiHappy, HiLockClosed } from "react-icons/hi";
import { useQuery } from "react-query";

import DiscordWidgetButton from "./widget-button.component";

interface Props {
    guild: Guild;
    disabled?: boolean;
}

export default function DiscordWidget({ guild, disabled }: Props) {
    const [isEnabled, setIsEnabled] = useState<boolean>(false);

    const url = `https://discord.com/api/guilds/${guild.id}/widget.json` as const;

    const { data, isLoading, error } = useQuery(
        url,
        () => fetch(url).then((res) => res.json()) as Promise<RESTGetAPIGuildWidgetJSONResult | RESTError>,
        {
            enabled: Boolean(guild.id) && !disabled,
            ...cacheOptions,
            onSuccess: (data) => setIsEnabled(!("code" in data)),
            refetchOnMount: true
        }
    );

    if ((error || (data && "message" in data && data.code !== 50_004)) && !disabled) {
        return (
            <div className="md:w-1/2">
                <Notice
                    message={
                        (data && data && "message" in data ? data.message : `${error}`)
                        || "An unknown error occurred."
                    }
                />
            </div>
        );
    }

    if (isLoading || !data) {
        return (
            <div className="pt-1">
                <Skeleton className="h-5 w-96 mb-2.5 rounded-lg" />
                <Skeleton className="h-10 w-52 rounded-lg" />
            </div>
        );
    }

    return (<>
        <div className={cn(
            "flex items-center gap-1 mb-2 font-medium",
            isEnabled
                ? "text-violet-400"
                : "text-red-500"
        )}>
            {isEnabled
                ? <HiEmojiHappy />
                : <HiLockClosed />
            }
            {isEnabled
                ? "Invite widget is enabled — people can join this server"
                : "Invite widget is disabled — this server is private"
            }
        </div>

        <DiscordWidgetButton
            guildId={guild.id}
            isEnabled={isEnabled}
            setEnabled={setIsEnabled}
        />
    </>);
}