import type { User } from "@/common/user";
import type { ApiError } from "@/typings";
import type React from "react";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

export async function authorize({
    setState
}: {
    setState: React.Dispatch<React.SetStateAction<State>>;
}) {
    setState(State.Idle);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        credentials: "include"
    })
        .then((res) => res.json())
        .catch(() => null) as User | ApiError | null;

    if (res && "status" in res && res.status.toString().startsWith("4")) {
        window.location.href = "/login";
        return null;
    }

    if (!res || "status" in res) {
        setState(State.Failure);
        return null;
    }

    setState(State.Idle);
    return res;
}