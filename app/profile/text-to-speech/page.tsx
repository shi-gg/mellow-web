"use client";

import { InputSelect } from "@/components/inputs/select-menu";
import { InputSwitch } from "@/components/inputs/switch";
import { ScreenMessage } from "@/components/screen-message";
import { TTSFaq } from "@/components/tts-faq";
import { useApi } from "@/lib/api/hook";
import type { ApiV1UsersMeGetResponse } from "@/typings";
import { UserFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { getVoices, voices } from "@/utils/tts";

export default function Home() {
    const { data, isLoading, error, edit } = useApi<ApiV1UsersMeGetResponse>("/users/@me");

    if (isLoading) return null;
    if (!data || error) {
        return <ScreenMessage description={error || "An unknown error occurred."} />;
    }

    return (
        <div>
            <div className="lg:flex gap-6 mt-5">
                <div className="lg:w-1/2 flex flex-col gap-2">
                    <InputSelect
                        label="Default Speaker"
                        endpoint="/users/@me/text-to-speech"
                        k="voice"
                        description="This is the default voice for any text to speech conversion."
                        items={voices.map((voice) => ({
                            name: getVoices(voice)[0],
                            value: voice
                        }))}
                        defaultState={data.voice}
                        onSave={(value) => edit("voice", value!)}
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
                </div>

                <TTSFaq />
            </div>
        </div >
    );
}