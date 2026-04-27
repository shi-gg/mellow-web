import { type User, userStore } from "@/common/user";
import Box from "@/components/box";
import { Shiggy } from "@/components/shiggy";
import { Button } from "@/components/ui/button";
import type { ApiV1UsersMeRankEmojiDeleteResponse, ApiV1UsersMeRankEmojiPutResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { deepMerge } from "@/utils/deepMerge";
import sleep from "@/utils/sleep";
import type { ApiError } from "next/dist/server/api-utils";
import Image from "next/image";
import { type ChangeEvent, useRef, useState } from "react";
import { HiUpload } from "react-icons/hi";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 3
}

export default function CardSyle() {
    const user = userStore((s) => s);
    const ref = useRef<HTMLInputElement | null>(null);

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    if (user?.id && !user.extended) return <></>;

    // TODO: Confetti & rainbow animation
    // TODO: Image replace animation(?)
    // TODO: Better error message

    async function upload(e: ChangeEvent<HTMLInputElement>) {
        setError(null);

        const file = e.target.files?.[0];
        if (!file) return;

        setState(State.Loading);

        const formData = new FormData();
        formData.append("file[0]", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/rank/emoji`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })
            .then((r) => r.json())
            .catch(() => null) as ApiV1UsersMeRankEmojiPutResponse | ApiError | null;

        if (!res || "message" in res) {
            setState(State.Idle);
            setError(
                res && "message" in res
                    ? res.message
                    : "Failed to update"
            );
            return;
        }

        await sleep(1_000 * 3);
        setState(State.Success);

        userStore.setState({
            ...deepMerge<User>(user, {
                extended: { rank: { emoji: res.id } }
            })
        });
    }

    async function remove() {
        setError(null);
        setState(State.Loading);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/rank/emoji`, {
            method: "DELETE",
            credentials: "include"
        })
            .then((r) => r.json())
            .catch(() => null) as ApiV1UsersMeRankEmojiDeleteResponse | ApiError | null;

        if (!res || "message" in res) {
            setState(State.Idle);
            setError(
                res && "message" in res
                    ? res.message
                    : "Failed to remove"
            );
            return;
        }

        setState(State.Idle);

        userStore.setState({
            ...deepMerge<User>(user, {
                extended: { rank: { emoji: null } }
            })
        });
    }

    const mimetypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    // if (user?.premium) mimetypes.push("image/gif");

    return (
        <div>
            <input
                accept={mimetypes.join()}
                className="hidden"
                onChange={upload}
                ref={ref}
                type="file"
            />

            <Box className="flex flex-col md:flex-row justify-center items-center h-56 relative overflow-hidden">

                <Shiggy
                    className="hidden md:block absolute bottom-0 left-2 w-52 opacity-40"
                />

                <div className="md:w-1/2 flex items-center justify-center relative z-10">
                    <div className="flex flex-col">
                        <Button
                            className={cn(state === State.Loading && "shake")}
                            variant="secondary"
                            onClick={() => ref.current?.click()}
                            icon={<HiUpload />}
                            loading={state === State.Loading}
                        >
                            {state === State.Success
                                ? "Looking good!"
                                : "Upload Emoji"
                            }
                        </Button>
                        {user?.extended?.rank?.emoji && (
                            <button
                                onClick={() => remove()}
                                className="text-red-400 hover:underline md:text-sm w-fit mt-1"
                            >
                                Remove
                            </button>
                        ) }
                    </div>
                </div>

                <div className="absolute blur-xs gap-4 grid grid-cols-6 left-4 lg:grid-cols-6 md:blur-none md:bottom-4 md:left-0 md:opacity-100 md:relative md:scale-100 md:top-0 md:w-1/2 opacity-45 rotate-1 scale-105 top-6 w-full">
                    {Array.from({ length: 18 }, (_, i) =>
                        <Emoji
                            key={`emoji-${i + 1}`}
                            index={i}
                            emojiId={user?.extended?.rank?.emoji || null}
                        />
                    )}
                </div>

            </Box>

            <div className="flex">
                {error && (
                    <div className="ml-auto text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

function Emoji({
    index,
    emojiId
}: {
    index: number;
    emojiId: string | null;
}) {
    const classNames = "rounded-xl relative size-12 aspect-square";
    const style = {
        transform: `rotate(${(index / 2.3) * 360}deg)`,
        top: `${index * 2 % 4}px`,
        left: `${index * 8 / 2}px`
    };

    if (!emojiId) return (
        <div
            className={cn(classNames, "bg-wamellow shadow-xl hover:scale-105 duration-100")}
            style={style}
        />
    );

    return (
        <Image
            alt=""
            className={classNames}
            draggable={false}
            height={64}
            src={`https://r2.wamellow.com/emoji/${emojiId}`}
            style={style}
            width={64}
        />
    );
}