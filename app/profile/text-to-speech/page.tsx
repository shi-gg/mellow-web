"use client";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { InputSelect } from "@/components/inputs/select-menu";
import { InputSwitch } from "@/components/inputs/switch";
import Notice from "@/components/notice";
import { ScreenMessage } from "@/components/screen-message";
import { TTSFaq } from "@/components/tts-faq";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiEdit } from "@/lib/api/hook";
import { useApi } from "@/lib/api/hook";
import type { ApiV1UsersMeGetResponse, ApiV1UsersMeGuildsGetResponse } from "@/typings";
import { UserFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { getVoices, voices } from "@/utils/tts";
import { useState } from "react";

export default function Home() {
    const { data, isLoading, error, edit } = useApi<ApiV1UsersMeGetResponse>("/users/@me");

    if (isLoading) return null;
    if (!data || error) {
        return <ScreenMessage description={error || "An unknown error occurred."} />;
    }

    return (
        <div>
            <div className="lg:flex gap-6">
                <div className="lg:w-1/2 flex flex-col gap-2">
                    <InputSelect
                        label="Default speaker"
                        endpoint="/users/@me/text-to-speech"
                        k="voice"
                        description="The default voice for you globally."
                        items={voices.map((voice) => ({
                            name: getVoices(voice)[0],
                            value: voice
                        }))}
                        defaultState={data.voice?.default}
                        onSave={(value) => edit("voice", { ...data.voice, default: value! })}
                    />
                    <InputSwitch
                        label="Chat to Speech"
                        description="Whenever your messages should be spoken aloud in chat to speech channels."
                        inverted
                        endpoint="/users/@me"
                        k="flags"
                        defaultState={(data.flags & UserFlags.ChatToSpeechIgnore) !== 0}
                        transform={(value) => transformer(value, data.flags, UserFlags.ChatToSpeechIgnore)}
                        onSave={(value) => edit("flags", transformer(value, data.flags, UserFlags.ChatToSpeechIgnore))}
                    />
                    <InputSwitch
                        label="Markdown features"
                        description="Whether code-blocks, spoilers, and emojis should be spoken in Chat to Speech."
                        inverted
                        endpoint="/users/@me"
                        k="flags"
                        defaultState={(data.flags & UserFlags.ChatToSpeechIgnoreWeirdMarkdown) !== 0}
                        transform={(value) => transformer(value, data.flags, UserFlags.ChatToSpeechIgnoreWeirdMarkdown)}
                        onSave={(value) => edit("flags", transformer(value, data.flags, UserFlags.ChatToSpeechIgnoreWeirdMarkdown))}
                    />

                    <Separator className="mt-2 mb-4" />

                    <GuildScopedSettings data={data} edit={edit} />
                </div>

                <TTSFaq />
            </div>
        </div>
    );
}

function GuildScopedSettings({ data, edit }: { data: ApiV1UsersMeGetResponse; edit: ApiEdit<ApiV1UsersMeGetResponse>; }) {
    const [guildId, setGuildId] = useState<string | undefined>(undefined);

    return (
        <div className="space-y-2">
            <GuildSelect guildId={guildId} onSelect={setGuildId} />
            {guildId && (
                <InputSelect
                    label="Default speaker"
                    endpoint={`/users/@me/guilds/${guildId}/text-to-speech`}
                    k="voice"
                    description="The default voice for you in this server."
                    items={voices.map((voice) => ({
                        name: getVoices(voice)[0],
                        value: voice
                    }))}
                    showClear
                    defaultState={data.voice.overrides?.[guildId]}
                    onSave={(value) => edit("voice", { ...data.voice, overrides: { ...data.voice?.overrides, [guildId]: value! } })}
                />
            )}
        </div>
    );
}

function GuildSelect({
    guildId,
    onSelect
}: {
    guildId: string | undefined;
    onSelect: (guildId: string) => void;
}) {
    const { isLoading, data, error } = useApi<ApiV1UsersMeGuildsGetResponse[]>("/users/@me/guilds");

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-2 mt-2">
                <Skeleton className="w-32 h-5 rounded-lg" />
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-5 rounded-lg" />
            </div>
        );
    }

    if (error) return <Notice message={error} />;

    return (
        <InputSelect
            className="w-full"
            label="Choose a Server"
            items={(data || [])
                .filter((guild) => guild.bot)
                .map((guild) => ({
                    icon: (
                        <ImageReduceMotion
                            alt={guild.name}
                            className="rounded-md size-6"
                            url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                            size={32}
                        />
                    ),
                    name: guild.name,
                    value: guild.id
                }))
            }
            defaultState={guildId}
            onSave={(guildId) => onSelect(guildId!)}
        />
    );
}