"use client";

import { guildStore } from "@/common/guilds";
import { InputSwitch } from "@/components/inputs/switch";
import { Section } from "@/components/section";
import { GuildFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { useParams } from "next/navigation";

import { BotStyle } from "./style.component";
import { TTSSettings } from "./tts.component";
import FollowUpdates from "./updates.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    return (<>
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