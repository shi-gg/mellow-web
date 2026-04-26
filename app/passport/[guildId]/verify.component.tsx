"use client";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ApiV1GuildsGetResponse } from "@/typings";
import { State, useCaptcha } from "@/utils/captcha";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation, HiFingerPrint, HiLockClosed } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

interface Props {
    guild: ApiV1GuildsGetResponse;
    isLoggedIn: boolean;
}

export function Verify({ guild, isLoggedIn }: Props) {
    const user = userStore((s) => s);

    const url = `/guilds/${guild.id}/passport-verification/captcha` as const;
    const { state, error, button } = useCaptcha(url, user?.id);

    return (
        <div className="flex flex-col gap-3 w-full mt-4">

            {isLoggedIn && (
                <Badge className="relative top-[3px] ml-0.5 w-fit h-6" radius="rounded">
                    <ImageReduceMotion
                        className="rounded-full size-5 relative right-1 -ml-[5px]"
                        alt="your avatar"
                        url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                        size={24}
                    />
                    {user?.username}
                </Badge>
            )}

            {error &&
                <div className="gap-1 text-red-400 text-sm">
                    <HiExclamation className="inline size-4 mr-1" />
                    {error}
                </div>
            }

            {isLoggedIn ?
                <Button
                    ref={button}
                    variant={state === State.Success ? "success" : "secondary"}
                    className={cn(error && "cursor-not-allowed", state === State.Success && "cursor-not-allowed", "font-medium w-full")}
                    disabled={Boolean(error) || state === State.Success}
                >
                    {state === State.Loading
                        ? <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />
                        : <HiFingerPrint />
                    }
                    {state === State.Success
                        ? "Verification successful"
                        : "Complete verification"
                    }
                </Button>
                :
                <Button
                    asChild
                    variant="blurple"
                >
                    <Link
                        href="/login"
                        prefetch={false}
                    >
                        <BsDiscord />
                        Login to verify
                    </Link>
                </Button>
            }

            <div className="flex w-full gap-2">
                <Button
                    asChild
                    className="w-1/2"
                >
                    <Link
                        href="/support"
                        target="_blank"
                    >
                        <BsDiscord />
                        Support
                    </Link>
                </Button>
                <Button
                    asChild
                    className="w-1/2"
                >
                    <Link
                        href="/privacy"
                        target="_blank"
                    >
                        <HiLockClosed />
                        Privacy
                    </Link>
                </Button>
            </div>

        </div>
    );

}