import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { HiEmojiHappy, HiLockClosed } from "react-icons/hi";

enum State {
    Idle = 0,
    Loading = 1,
    Ratelimited = 2
}

export default function DiscordWidgetButton({
    guildId,
    isEnabled,
    setEnabled
}: {
    guildId: string;
    isEnabled: boolean;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const handle = async () => {
        setState(State.Loading);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/widget`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                enable: !isEnabled
            })
        });

        if (res.status === 429) {
            setState(State.Ratelimited);
            setTimeout(setState, 6 * 1_000, State.Idle);
        } else setState(State.Idle);

        if (res.ok) {
            setEnabled(!isEnabled);
            return;
        }

        if (res.headers.get("Content-Type")?.includes("application/json")) {
            const data = await res.json();
            setError(data.message);
            return;
        }

        setError(res.status + ": " + res.statusText);
    };

    return (<>
        <Button
            className="w-fit"
            onClick={handle}
            variant={
                isEnabled
                    ? "destructive"
                    : "secondary"
            }
            icon={
                isEnabled
                    ? <HiLockClosed />
                    : <HiEmojiHappy />

            }
            loading={state === State.Loading}
            disabled={state === State.Ratelimited}
        >
            {isEnabled
                ? "Disable invite widget"
                : "Enable invite widget"
            }
        </Button>

        {error && (
            <div className="text-red-500 text-sm mt-1">
                {error}
            </div>
        )}
    </>);
}