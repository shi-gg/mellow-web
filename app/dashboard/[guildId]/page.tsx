"use client";

import { guildStore } from "@/common/guilds";
import { InputSwitch } from "@/components/inputs/switch";
import { Section } from "@/components/section";
import { GuildFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { useParams } from "next/navigation";
import { HiChartBar } from "react-icons/hi";

import { BotStyle } from "./style.component";
import { TTSSettings } from "./tts.component";
import FollowUpdates from "./updates.component";
import { OverviewLink } from "../../../components/overview-link";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    return (<>
        {(guild!.flags & GuildFlags.PrivateLeaderboard) === 0 && (
            <OverviewLink
                title="View Leaderboard"
                message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                url={`/leaderboard/${params.guildId}`}
                icon={<HiChartBar />}
            />
        )}

        <BotStyle />

        <FollowUpdates />

        <Section
            title="Text to Speech"
        >
            Let users to send messages to a channel and have wamellow read it out loud in voice chat.
        </Section>

        <TTSSettings />

        <Section
            title="Miscs"
        >
            Small tools that improve chatting to insanity.
        </Section>

        <InputSwitch
            label="Embed message links"
            description="Reply with the original content of a message if a message link is sent."
            endpoint={`/guilds/${params.guildId}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.EmbedDiscordLinks) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.EmbedDiscordLinks)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.EmbedDiscordLinks) })}
        />
    </>);
}