"use client";

import DiscordChannel from "@/components/discord/channel";
import DiscordChannelCategory from "@/components/discord/channel-category";
import DiscordUser from "@/components/discord/user";
import { actor } from "@/utils/tts";
import Image from "next/image";
import { useEffect, useState } from "react";

const DEMO_MESSAGES = [
    "Hello everyone, welcome to the voice channel!",
    "Accessibility where it's needed most.",
    "Type in the chat, I'll speak for you.",
    "97 voices across 10 languages!"
];

const SUPPORTED_LANGS = ["us", "fr", "de", "es", "br", "pt", "id", "it", "jp", "kr"] as const;

const LANG_TO_NAME_MAP = Object
    .fromEntries(
        Object
            .values(actor)
            .map(([name, langCode]) => [langCode, name])
    );

enum AnimationPhase {
    Typing = 0,
    Speaking = 1,
    Pausing = 2
}

function Typewriter({ text, onComplete }: { text: string; onComplete: () => void; }) {
    const [charIndex, setCharIndex] = useState(0);

    useEffect(
        () => {
            if (charIndex < text.length) {
                const timeout = setTimeout(
                    () => setCharIndex((c) => c + 1),
                    40 + Math.random() * 30
                );

                return () => clearTimeout(timeout);
            }

            const timeout = setTimeout(onComplete, 100);
            return () => clearTimeout(timeout);
        },
        [charIndex, text.length, onComplete]
    );

    return (
        <>
            {text.slice(0, charIndex)}
            {charIndex < text.length && (
                <span className="inline-block w-0.5 h-4 bg-white ml-0.5 animate-blink" />
            )}
        </>
    );
}

function TTSDemoInterface() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [phase, setPhase] = useState<AnimationPhase>(AnimationPhase.Typing);

    const currentMessage = DEMO_MESSAGES[messageIndex];

    useEffect(
        () => {
            if (phase === AnimationPhase.Speaking) {
                const speakDuration = 2_000 + currentMessage.length * 30;
                const timeout = setTimeout(() => setPhase(AnimationPhase.Pausing), speakDuration);

                return () => clearTimeout(timeout);
            }

            if (phase === AnimationPhase.Pausing) {
                const timeout = setTimeout(
                    () => {
                        setMessageIndex((i) => (i + 1) % DEMO_MESSAGES.length);
                        setPhase(AnimationPhase.Typing);
                    },
                    800
                );

                return () => clearTimeout(timeout);
            }
        },
        [phase, currentMessage.length]
    );

    return (
        <>
            <div className="bg-discord-gray rounded-lg py-4 px-8 border border-white/5 backdrop-blur-sm">
                <DiscordChannelCategory name="#/voice/dev/null">
                    <DiscordChannel
                        type="voice"
                        name="• Public"
                    >
                        <DiscordUser username="Luna" avatar="/luna.webp" isMuted />
                        <DiscordUser username="Duck" avatar="/space.webp" isMuted />
                        <DiscordUser username="Wamellow" avatar="/waya-v3.webp" isTalking={phase === AnimationPhase.Speaking} isBot />
                    </DiscordChannel>
                </DiscordChannelCategory>
            </div>

            <div className="bg-[#383a40] rounded-lg p-3 w-full border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Image src="/luna.webp" alt="" width={64} height={64} className="size-6 rounded-full" priority />
                    <div className="flex-1 text-sm text-white min-h-5">
                        {phase === AnimationPhase.Typing ? (
                            <Typewriter
                                key={messageIndex}
                                text={currentMessage}
                                onComplete={() => setPhase(AnimationPhase.Speaking)}
                            />
                        ) : (
                            currentMessage
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export function TTSDemo() {
    return (
        <div className="relative w-full">
            <div className="absolute inset-0 -z-10">
                <div className="absolute -inset-4 bg-linear-to-br from-violet-600/30 via-indigo-500/20 to-pink-500/30 rounded-3xl blur-2xl animate-pulse-slow" />
                <div className="absolute -top-8 -left-8 size-32 bg-violet-500/25 rounded-full blur-3xl animate-float" />
                <div className="absolute -bottom-6 -right-6 size-24 bg-pink-500/20 rounded-full blur-2xl animate-float-delayed" />
            </div>

            <div className="flex flex-col gap-3 relative">
                <TTSDemoInterface />

                <div className="flex gap-1">
                    {SUPPORTED_LANGS.map((lang) => (
                        <Image
                            key={lang}
                            src={`/icons/${lang}.webp`}
                            alt={LANG_TO_NAME_MAP[lang] || lang}
                            width={64}
                            height={64}
                            className="size-5 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}