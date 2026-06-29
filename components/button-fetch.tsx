import React, { useState } from "react";

import { Button } from "./ui/button";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2,
    Ratelimited = 3
}

export default function Fetch({
    url,
    payload,
    icon,
    label,
    method,
    size,
    className
}: {
    url: string;
    payload?: Record<string, unknown>;
    icon: React.ReactNode;
    label: string;
    method: "PUT" | "POST" | "DELETE";
    size?: "sm" | "lg";
    className?: string;
}) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const handle = async () => {
        if (state === State.Ratelimited || state === State.Success) return;

        setState(State.Loading);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload || {})
        });

        if (res.status === 429) {
            setState(State.Ratelimited);
            setTimeout(setState, 6 * 1_000, State.Idle);
        }

        if (res.ok) {
            setState(State.Success);
            setTimeout(setState, 6 * 1_000, State.Idle);
            return;
        }

        setState(State.Idle);

        if (res.headers.get("Content-Type")?.includes("application/json")) {
            const data = await res.json();
            setError(data.message);
            return;
        }

        setError(res.status + ": " + res.statusText);
    };

    return (
        <div className={className}>
            <Button
                className="w-full"
                onClick={handle}
                variant={state === State.Success
                    ? "success"
                    : "flat"
                }
                disabled={state !== State.Idle}
                size={size}
                loading={state === State.Loading}
            >
                {state !== State.Loading && icon}
                {label}
            </Button>

            {error && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}
        </div>
    );
}