"use client";

import SelectMenu from "@/components/inputs/select-menu";
import {
    AudioPlayerButton,
    AudioPlayerDuration,
    AudioPlayerProgress,
    AudioPlayerProvider,
    AudioPlayerTime
} from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import { InputBase, InputBaseTextarea } from "@/components/ui/input-base";
import { cn } from "@/utils/cn";
import { actor, getVoices, voices } from "@/utils/tts";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import { HiDownload } from "react-icons/hi";

import { getSpeech } from "./api";
import { History } from "./history";
import { useHistory } from "./use-history";

const MAX_TEXT_LENGTH = 6_000;

export default function Home() {
    const fallbackVoice = voices[0] ?? "";
    const [text, setText] = useState("");
    const [voice, setVoice] = useState<string>(fallbackVoice);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { history, error: historyError, state, addEntry, deleteEntry, ensureUrl } = useHistory();
    const captcha = useRef<TurnstileInstance>(null);

    const handleGenerate = async () => {
        setError(null);

        if (!text.trim()) {
            setError("Please enter some text to generate speech.");
            return;
        }

        if (!voice || !actor[voice]) {
            setError("Select a voice to continue.");
            return;
        }

        const token = captcha.current?.getResponse();
        if (!token) {
            setError("Complete the captcha first.");
            return;
        }

        setLoading(true);

        try {
            const { url, base64 } = await getSpeech(text.trim(), voice, token);
            setAudioUrl(url);

            void addEntry({ text: text.trim(), voice, base64, createdAt: Date.now() }, url);
        } catch (error_) {
            const message = error_ instanceof Error ? error_.message : "Unable to generate speech right now.";
            setError(message);
        } finally {
            setLoading(false);
            captcha.current?.reset();
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
                <div className="rounded-xl bg-linear-to-br from-violet-300/8 to-violet-200/5 p-5 h-fit">
                    <div className="flex flex-wrap items-center gap-3">
                        <SelectMenu
                            className="w-full"
                            name="Voice & language"
                            items={voices.map((voiceKey) => ({
                                name: getVoices(voiceKey)[0],
                                value: voiceKey
                            }))}
                            defaultState={voice}
                            onSave={({ value }) => setVoice((value as string) || fallbackVoice)}
                            showClear={false}
                        />
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm text-neutral-400">
                            <span>Text</span>
                            <span>{text.length}/{MAX_TEXT_LENGTH}</span>
                        </div>
                        <InputBase className={cn("bg-black/20 text-white", error && "border-red-500 ring-red-500/30")} >
                            <InputBaseTextarea
                                value={text}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    if (next.length > MAX_TEXT_LENGTH) return;
                                    setText(next);
                                }}
                                placeholder="Type what you want to hear..."
                                className="text-base"
                            />
                        </InputBase>
                        {error && <div className="text-sm text-red-400">{error}</div>}
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-3">
                            <Turnstile
                                className="mt-2 md:max-w-1"
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_KEY!}
                                options={{
                                    size: "flexible",
                                    theme: "dark"
                                }}
                                ref={captcha}
                            />

                            <Button onClick={handleGenerate} loading={loading} className="w-full md:w-auto">
                                {loading ? "Generating..." : "Generate speech"}
                            </Button>
                        </div>
                    </div>
                </div>
                {audioUrl && (
                    <div className="rounded-xl bg-linear-to-br from-violet-300/8 to-violet-200/5 p-5 mt-4">
                        <AudioPlayerProvider>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Button asChild>
                                        <a href={audioUrl} download>
                                            <HiDownload />
                                        </a>
                                    </Button>
                                    <AudioPlayerButton
                                        item={{
                                            id: audioUrl,
                                            src: audioUrl
                                        }}
                                    />
                                </div>
                                <AudioPlayerProgress className="flex-1" />
                                <AudioPlayerTime />
                                <span>/</span>
                                <AudioPlayerDuration />
                            </div>
                        </AudioPlayerProvider>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">History</h2>
                    <span className="text-xs text-neutral-400">Stored locally</span>
                </div>

                <History
                    history={history}
                    error={historyError}
                    state={state}
                    ensureUrl={ensureUrl}
                    fallbackVoice={fallbackVoice}
                    onPlay={(url) => setAudioUrl(url)}
                    onRefill={(newText, newVoice) => {
                        setText(newText);
                        setVoice(newVoice);
                    }}
                    onDelete={(id) => deleteEntry(id)}
                />
            </div>
        </div>
    );
}